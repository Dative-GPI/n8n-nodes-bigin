/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDataObject, IExecuteFunctions, INodeExecutionData, NodeOperationError } from "n8n-workflow";
import { Resource,  getEndpoint,  InputModes, LoadedPipelineLayouts, Methods, ModuleEndpoints, Operation, OrderByClause, IdLocator} from "../types";
import { buildCoqlQuery, buildWhereConditions, extractId, filterSearchableFields, getFields,  getFieldsAsString, getFieldsMetadata, getPicklistValues, getRequiredFieldsMetadata, getStages, getSubPipelines, mapMetadataToOptions, zohoApiBatchedRequest, zohoApiCoqlRequest, zohoApiRequest, zohoApiRequestAllItemsBatch } from "./GenericFunctions";




export const getManyCoql = async function (
	this: IExecuteFunctions,
	resource: Resource,
	i: number,
): Promise<IDataObject[]> {

	// ----------------------------------------
	// 1. Basic parameters
	// ----------------------------------------
	this.logger.debug('Entered: getManyCoql');

	const returnAll = this.getNodeParameter('Returnall', i) as boolean;
	let limit = 0;

	if (!returnAll) {
		limit = this.getNodeParameter('Limit', i) as number;
	}

	const offset = this.getNodeParameter('Offset', i) as number;
	const selectAll = this.getNodeParameter('Selectallfields', i) as boolean;

	// ----------------------------------------
	// 2. Field metadata + select fields
	// ----------------------------------------
	const allFieldMetadata = await getFieldsMetadata.call(this, resource);
	const searchableFields = filterSearchableFields(allFieldMetadata);
	const searchableFieldOptions = mapMetadataToOptions(searchableFields);

	const defaultFields = await getRequiredFieldsMetadata.call(this,resource) 
	const defaultFieldOptions = mapMetadataToOptions(defaultFields);

	let selectFields: string[];

	if (selectAll) {
		selectFields = searchableFieldOptions.map(o => o.value);
	} else {
		selectFields = this.getNodeParameter('Selectfields', i) as string[];
	}

	// ----------------------------------------
	// 3. WHERE clause
	// ----------------------------------------
	const whereGroup = this.getNodeParameter('Where', i) as IDataObject;
	const rawConditions = (whereGroup.Condition as IDataObject[]) || [];

	// eslint-disable-next-line prefer-const
	let { conditions, logic} = buildWhereConditions(rawConditions);

	if (conditions.length === 0 && defaultFieldOptions.length > 0) {
		const defaultField = defaultFieldOptions[0].value;

		this.logger.debug(
			`No filters provided. Fallback to ${defaultField} IS NOT NULL`,
		);

		conditions = [
			{
				field: defaultField,
				operator: 'is not null',
				value: null,
			},
		];
	}

	// ----------------------------------------
	// 4. ORDER BY
	// ----------------------------------------
	const orderGroupObj = this.getNodeParameter('Orderby', i) as IDataObject;

	const sortRules = Array.isArray(orderGroupObj.Sortrule)
		? (orderGroupObj.Sortrule as Array<{ Field: string; Direction: string }>)
		: [];

	const orderByClause: OrderByClause[] = sortRules
		.filter(r => r.Field && r.Direction)
		.map(r => ({
			Field: r.Field,
			Direction:
				r.Direction === 'DESC'
					? 'DESC'
					: 'ASC',
		}));
	this.logger.debug("orderGroupObj"+orderGroupObj.toString())
	// ----------------------------------------
	// 5. Build COQL query
	// ----------------------------------------
	const coqlQuery = buildCoqlQuery(
		resource,
		selectFields,
		conditions,
		logic,
		orderByClause,
		limit,
		offset,
	);

	this.logger.debug(
		`COQL Query: ${JSON.stringify(coqlQuery, null, 2)}`,
	);

	// ----------------------------------------
	// 6. Execute query
	// ----------------------------------------
	const records = await zohoApiCoqlRequest.call(
		this,
		coqlQuery,
		returnAll,
	);

	return records;
};


export const execute = async function(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		this.logger.debug("Entered: Execute function");
		const resource = this.getNodeParameter('resource', 0) as Resource;
		const operation = this.getNodeParameter('operation', 0) as Operation;
		let responseData;

		for (let i = 0; i < items.length; i++) {

			try {

				if (operation === Operation.Create) {
					// ----------------------------------------
					//           Account & Contacts:  create
					// ----------------------------------------
					const endpoint = getEndpoint(resource);
				
					const columnsData = this.getNodeParameter('Columns', i) as IDataObject;

					const customFieldsWrapper = this.getNodeParameter('Multipicklist', i, {}) as IDataObject;
					const multiPicklistItems = (customFieldsWrapper.property || []) as Array<{ field: string; value: string[] }>;

					const multiPicklistData: IDataObject = {};

					for (const item of multiPicklistItems) {
						if (item.field) {
							multiPicklistData[item.field] = item.value;
						}
					}
				
					
					const body = {
						...((columnsData.value || {}) as IDataObject),
						...multiPicklistData
					};
					
					responseData = await zohoApiRequest.call(
						this, 
						Methods.POST, 
						endpoint, 
						body
					);
				}
	
				else if (operation === Operation.Delete) {
					const recordParam = this.getNodeParameter('Recordid', i) as IdLocator

					let recordId = recordParam.value;
					if(recordParam.mode=== 'url'){

						recordId=extractId(resource,recordParam)
					}
					const endpoint = getEndpoint(resource)+`/${recordId}`;
					responseData = await zohoApiRequest.call(this, Methods.DELETE, endpoint);
					responseData=responseData.data
				}
	
				else if (operation === Operation.Get) {

					const recordParam = this.getNodeParameter('Recordid', i) as  IdLocator

					const selectAll = this.getNodeParameter('Selectallfields', i) as boolean;
					let fields: string;
					if(selectAll){
						fields= await getFieldsAsString.call(this, resource)	;
					}
					else{
						const fieldList = this.getNodeParameter('Selectfields', i) as string[];
						fields = fieldList.join(',');
					}
					const qs: IDataObject = {
						fields: fields,
					};
					let recordId = recordParam.value;
					if(recordParam.mode=== 'url'){
						recordId=extractId(resource,recordParam)
					}


					const endpoint = getEndpoint(resource)+`/${recordId}`;
					responseData = await zohoApiRequest.call(this, Methods.GET, endpoint,{},qs);
					responseData= responseData.data
				}

				else if (operation === Operation.GetMany) {
					responseData = await getManyCoql.call(this, resource, i);
				}

				else if( operation === Operation.GetAll) {
					this.logger.debug("Operation: GetAll");
					const selectAll = this.getNodeParameter('Selectallfields', i) as boolean;
					let fields: string;
					if(selectAll){
						fields= await getFieldsAsString.call(this, resource)	;
					}
					else{
						const fieldList = this.getNodeParameter('Selectfields', i) as string[];
						fields = fieldList.join(',');
					}
				
					const endpoint = getEndpoint(resource);
					 
					const qs: IDataObject = {
						fields: fields,
					};

					responseData = await zohoApiRequestAllItemsBatch.call(this, Methods.GET, endpoint, {}, qs);
				}		
				else if (operation === Operation.Patch || operation === Operation.Update) {
					const Inputmode = this.getNodeParameter('Inputmode', i);
					
					let endpoint = getEndpoint(resource);
					const columnsData = this.getNodeParameter('Columns', i) as IDataObject;


					if(resource === Resource.Pipelines){
						const stage = (columnsData.value as IDataObject)?.Stage as string;
						const subPipeline = (columnsData.value as IDataObject)?.Sub_Pipeline as string;		
				 		const availableStages = await getStages.call(this,subPipeline)
						this.logger.debug(availableStages.toString())
						const allowedStageValues = availableStages.map((s) => s.value);
						if (!allowedStageValues.includes(stage)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid Stage "${stage}" for Sub_Pipeline "${subPipeline}".`,
								{
									description: `Available stages: ${allowedStageValues.join(' | ')}`,
								},
							);
						}
					}

					const MultipicklistWrapper = this.getNodeParameter('Multipicklist', i, {}) as IDataObject;

					const multiPicklistItems = (MultipicklistWrapper.Property || []) as Array<{ Field: string; Value: string[] }>;

					const multiPicklistData: IDataObject = {};

					for (const item of multiPicklistItems) {
						if (item.Field) {
							multiPicklistData[item.Field] = item.Value;
						}
					}
					
					const body= {
						...((columnsData.value || {}) as IDataObject),
						...multiPicklistData
					};
					const method = operation === Operation.Patch ? Methods.PATCH : Methods.PUT



					if (Inputmode === InputModes.Single) {
						const recordParam = this.getNodeParameter('Recordid', i) as IdLocator
						let recordId = recordParam.value;

						if(recordParam.mode=== 'url'){
							recordId=extractId(resource,recordParam)
						}
						endpoint = endpoint+`/${recordId}`;

						
						responseData = await zohoApiRequest.call(
							this,
							method,
							endpoint,
							body, 
						);
						
					}
					else if (Inputmode === InputModes.Many) {
						// ----------------------------------------
						// 				Patch (batch)
						// ----------------------------------------
						
						const recordsListRaw = this.getNodeParameter('Recordlist', i) as Array<string | { id: string }>;
			
						const patchData = recordsListRaw.map(record => {
		
							const recordObj = typeof record === 'string' ? { id: record } : { ...record };

							return {
								...recordObj,   
								...body,
							};
						});

						const response = await zohoApiBatchedRequest.call(
							this,
							method,
							endpoint,
							patchData,
						);
						
						responseData = response;
					}
				}
	
				else if (operation === Operation.Upsert) {
					// ----------------------------------------
					//            Account & Contacts: upsert
					// ----------------------------------------
					const Inputmode = this.getNodeParameter('Inputmode', i);
					const endpoint = getEndpoint(resource)+'/upsert';
					const customFieldsWrapper = this.getNodeParameter('Multipicklist', i, {}) as IDataObject;

					const multiPicklistItems = (customFieldsWrapper.Property || []) as Array<{ Field: string; Value: string[] }>;

					const multiPicklistData: IDataObject = {};
					for (const item of multiPicklistItems) {
						if (item.Field) {
							multiPicklistData[item.Field] = item.Value;
						}
					}

					const columnsData = this.getNodeParameter('Columns', i) as IDataObject;
					const recordData = {
						...((columnsData.value || {}) as IDataObject),
						...multiPicklistData
					};	

					
					const duplicateCheckFields = (await getRequiredFieldsMetadata.call(this,resource)).map(f => f.api_name)
					this.logger.debug("Duplicate check fields:"+duplicateCheckFields)
					const body: IDataObject = {
						data: [recordData]
					};

					if (duplicateCheckFields.length > 0) {
						body.duplicate_check_fields = duplicateCheckFields;
					}

					if (Inputmode === InputModes.Single) {
						responseData = await zohoApiRequest.call(
							this,
							Methods.POST,
							endpoint,
							body,
						);

						if (responseData && responseData.data && responseData.data[0]) {
							responseData = responseData.data[0].details;
						}
					} 

					else if (Inputmode === InputModes.Many) {
						// ----------------------------------------
						//     Upsert (batch)
						// ----------------------------------------
						const recordsList = this.getNodeParameter('Recordlist', i) as Array<IDataObject>;
						const upsertData = recordsList.map(record => {
							return {
								...record,
								...body,
							};
						});

						const response = await zohoApiBatchedRequest.call(
							this,
							Methods.POST,
							endpoint,
							upsertData,
						);

						responseData = response;
					}
				}				

			else if(operation === Operation.Count){
				// ----------------------------------------
				//            Account & Contacts: count
				// ----------------------------------------
				const endpoint = `/${resource}${ModuleEndpoints.RecordCount}`;
				responseData = await zohoApiRequest.call(this, Methods.GET, endpoint);
				responseData = { count: responseData.count };
			}

			else if (operation === Operation.GetPipelines) {
				// ----------------------------------------
				//         Pipelines: getPipelines
				// ----------------------------------------
				const endpoint = ModuleEndpoints.Layouts;
				const queryString: IDataObject = {
					module: Resource.Pipelines
				};
				const response = await zohoApiRequest.call(this, Methods.GET, endpoint, {}, queryString) as LoadedPipelineLayouts;
				
				if (!response.layouts?.length) {
					responseData = [];
				} else {
					const subPipelineOptions = response.layouts
						.flatMap(layout => layout.profiles)
						.flatMap(profile => profile._default_assignment_view)
						.map(view => ({id: view.id, name: view.name}));

					const uniqueMap = new Map();
					subPipelineOptions.forEach(item => uniqueMap.set(item.id, item));

					responseData = Array.from(uniqueMap.values()).map(item => ({
						id: item.id,
						name: item.name
					}));
				}
			}
			else if (operation === Operation.GetSubPipelines) {
				responseData= await getSubPipelines.call(this)
			}
			else if (operation === Operation.GetStages) {
				// ----------------------------------------
				//         Pipelines: getStages
				// ----------------------------------------
				const subPipelineName = this.getNodeParameter('Subpipelinename', i) as string;
				responseData =  await getStages.call(this,subPipelineName);
			}

			else if( operation === Operation.GetModuleDeals) {
				// ----------------------------------------
				//         Deals: getModuleDeals
				// ----------------------------------------

				this.logger.debug('--- Get Module Deals ---');
					const recordId = this.getNodeParameter('Recordid', i) as string;
					let endpoint = getEndpoint(resource);
					endpoint = `${endpoint}/${recordId}${ModuleEndpoints.RelatedDeals}`;
					let fields: string;
					const selectAll = this.getNodeParameter('Selectallfields', i) as boolean;
					if(selectAll){
						fields= await getFieldsAsString.call(this, resource)	;
					}
					else{
						const fieldList = this.getNodeParameter('Selectfields', i) as string[];
						fields = fieldList.join(',');
					}
					const queryString: IDataObject = {
						fields: fields,
					};
					const response = await zohoApiRequest.call(this, Methods.GET, endpoint, {}, queryString);
					responseData = response;	
				
			}

			else if( operation === Operation.GetModuleCalls) {
				// ----------------------------------------
				//         Calls: getModuleCalls
				// ----------------------------------------
				this.logger.debug('--- Get Module Calls ---');
				const recordId = this.getNodeParameter('Recordid', i) as string;

				let endpoint = getEndpoint(resource);
				endpoint = `${endpoint}/${recordId}${ModuleEndpoints.RelatedCalls}`;
					let fields: string;
				const selectAll = this.getNodeParameter('Selectallfields', i) as boolean;
				if(selectAll){
					fields= await getFieldsAsString.call(this, resource)	;
				}
				else{
					const fieldList = this.getNodeParameter('Selectfields', i) as string[];
					fields = fieldList.join(',');
				}
				const queryString: IDataObject = {
					fields: fields,
				};
				const response = await zohoApiRequest.call(this, Methods.GET, endpoint, {}, queryString);
				responseData = response;	
			}			
			else if(operation === Operation.GetFields) {
				// ----------------------------------------
				//         Get Module Fields
				// ----------------------------------------
				this.logger.debug('--- Get Module Fields ---');

				const fields = await getFields.call(this, resource);
				this.logger.debug('Fields: '+ fields);
				
				//use the field value for both display and value 
				const fieldsObject = fields.reduce((acc, field) => {
					acc[field.value] = field.value;
					return acc;
				}, {} as Record<string, any>);
				
				responseData = fieldsObject;
			}
			else if (operation === Operation.GetPickListValues) {
				// ----------------------------------------
				//         Get Module Fields
				// ----------------------------------------
				this.logger.debug('--- Get Module Fields ---');
				
				const field = this.getNodeParameter('Field', i) as string;

				const fieldValues = await getPicklistValues.call(this, resource, field);

				responseData = fieldValues.map(item => ({ display_value: item.name,actual_value: item.value }));
			}

		}catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {} });
					continue;
				}
				throw error;
			}
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}

		return [returnData];
	}



/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { Resource,  getEndpoint,  InputModes, LoadedPipelineLayouts, Methods, ModuleEndpoints, Operation, OrderByClause, IdLocator, BiginDataTypes, GlitchyField} from "../types";
import { buildCoqlQuery, buildWhereConditions, extractId, filterSearchableFields, getDefaultValue, getFields,  getFieldsAsString, getFieldsMetadata, getPicklistValues, getRequiredFieldsMetadata, getSearchableFields, getStages, getSubPipelines, mapMetadataToOptions, zohoApiBatchedRequest, zohoApiCoqlRequest, zohoApiRequest, zohoApiRequestAllItemsBatch } from "./GenericFunctions";




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

					const Subpipelinename = this.getNodeParameter('Subpipelinenamew', i, {}) as string;
					const Stage = this.getNodeParameter('Stagecreate', i, {}) as string;


					const multiPicklistData: IDataObject = {};

					for (const item of multiPicklistItems) {
						if (item.field) {
							multiPicklistData[item.field] = item.value;
						}
					}
					
					const body = {
						...((columnsData.value || {}) as IDataObject),
						...multiPicklistData,
						...({ Sub_Pipeline: Subpipelinename }),
        				...({ Stage: Stage })
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
					const recordParam = this.getNodeParameter('Recordid', i) as  IdLocator
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
					const MultipicklistWrapper = this.getNodeParameter('Multipicklist', i, {}) as IDataObject;
					const multiPicklistItems = (MultipicklistWrapper.Property || []) as Array<{ Field: string; Value: string[] }>;
					const multiPicklistData: IDataObject = {};
					for (const item of multiPicklistItems) {
						if (item.Field) {
							multiPicklistData[item.Field] = item.Value;
						}
					}

					this.logger.debug(`Operation: ${operation}, Inputmode: ${Inputmode}`);
					const glitchyValues = Object.values(GlitchyField) as string[];
					if (operation === Operation.Patch) {
						this.logger.debug('Processing Patch operation');

						const body: IDataObject = {
							...((columnsData.value || {}) as IDataObject),
							...multiPicklistData
						};

						if (Inputmode === InputModes.Single) {
							const Subpipelinename = this.getNodeParameter('Subpipelinenamero', i, '') as string;
							const Stage = this.getNodeParameter('Stage', i, '') as string;
							
							if (Subpipelinename) body.Sub_Pipeline = Subpipelinename;
							if (Stage) body.Stage = Stage;
							const recordParam = this.getNodeParameter('Recordid', i) as IdLocator;
							let recordId = recordParam.value;
							if (recordParam.mode === 'url') {
								recordId = extractId(resource, recordParam);
							}
							endpoint = `${endpoint}/${recordId}`;

							responseData = await zohoApiRequest.call(this, Methods.PATCH, endpoint, body);
						} else if (Inputmode === InputModes.Many) {
							const recordsListRaw = this.getNodeParameter('Recordlist', i);
							if (!Array.isArray(recordsListRaw)) {
								throw new Error(`Invalid input for 'Recordlist' parameter. Expected an array.`);
							}
							if (recordsListRaw.length === 0) {
								throw new Error(`The 'Recordlist' parameter is empty.`);
							}

							const patchData = recordsListRaw.map(record => {
								let recordObj: IDataObject = {};
									if (typeof record === 'string') {
										recordObj = { id: record };
									} else {
										recordObj = Object.fromEntries(
											Object.entries(record as IDataObject).filter(
												([key]) => !glitchyValues.includes(key)
											)
										);
									}		
								return { ...recordObj, ...body };
							});

							responseData = await zohoApiBatchedRequest.call(this, Methods.PATCH, endpoint, patchData);
						}
					} 
					else if (operation === Operation.Update) {
						this.logger.debug('Processing Update operation');

						const writableFields = await getSearchableFields.call(this, resource);

						if (Inputmode === InputModes.Single) {
							const body: IDataObject = {
								...((columnsData.value || {}) as IDataObject),
								...multiPicklistData
							};

							const Subpipelinename = this.getNodeParameter('Subpipelinenamero', i, '') as string;
							const Stage = this.getNodeParameter('Stage', i, '') as string;
							
							if (Subpipelinename) body.Sub_Pipeline = Subpipelinename;
							if (Stage) body.Stage = Stage;

							const selectedFields = new Set([
								...Object.keys((columnsData.value || {}) as IDataObject),
								...Object.keys(multiPicklistData)
							]);

							for (const field of writableFields) {
								if (!selectedFields.has(field.api_name) && 
									!field.read_only && 
									!field.system_mandatory &&
									!Object.values(GlitchyField).includes(field.api_name)
									) {
									body[field.api_name] = getDefaultValue(field.data_type as BiginDataTypes, field.api_name);
								}
							}

							const recordParam = this.getNodeParameter('Recordid', i) as IdLocator;
							let recordId = recordParam.value;
							if (recordParam.mode === 'url') {
								recordId = extractId(resource, recordParam);
							}
							endpoint = `${endpoint}/${recordId}`;

							responseData = await zohoApiRequest.call(this, Methods.PUT, endpoint, body);
						} 
						else if (Inputmode === InputModes.Many) {
							const recordsListRaw = this.getNodeParameter('Recordlist', i);
							if (!Array.isArray(recordsListRaw)) {
								throw new Error(`Invalid input for 'Recordlist'.`);
							}

							const updateData = recordsListRaw.map((record) => {
								let recordObj: IDataObject = {};
											if (typeof record === 'string') {
												recordObj = { id: record };
											} else {
												recordObj = Object.fromEntries(
													Object.entries(record as IDataObject).filter(
														([key]) => !glitchyValues.includes(key)
													)
												);
											}

								const body: IDataObject = {
									...recordObj,
									...((columnsData.value || {}) as IDataObject),
									...multiPicklistData
								};

								const selectedFields = new Set([
									...Object.keys(recordObj).filter(key => key !== 'id'),
									...Object.keys((columnsData.value || {}) as IDataObject),
									...Object.keys(multiPicklistData)
								]);

								for (const field of writableFields) {
									if (!selectedFields.has(field.api_name) && 
										!field.read_only && 
										!field.system_mandatory &&
										!Object.values(GlitchyField).includes(field.api_name)
)
										{
										body[field.api_name] = getDefaultValue(field.data_type as BiginDataTypes, field.api_name);
									}
								}
								return body;
							});

							responseData = await zohoApiBatchedRequest.call(this, Methods.PUT, endpoint, updateData);
						}
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

					const Subpipelinename = this.getNodeParameter('Subpipelinenamew', i, '') as string;
					const Stage = this.getNodeParameter('Stage', i, '') as string;
					
					if (Subpipelinename) recordData.Sub_Pipeline = Subpipelinename;
					if (Stage) recordData.Stage = Stage;

					
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
				const subPipelineName = this.getNodeParameter('Subpipelinenamew', i) as string;
				responseData =  await getStages.call(this,subPipelineName);
			}

			else if( operation === Operation.GetModuleDeals) {
				// ----------------------------------------
				//         Deals: getModuleDeals
				// ----------------------------------------

				this.logger.debug('--- Get Module Deals ---');
				const recordParam = this.getNodeParameter('Recordid', i) as  IdLocator
				let recordId = recordParam.value;
				if(recordParam.mode=== 'url'){
					recordId=extractId(resource,recordParam)
				}
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
				responseData = response.data;	
				
			}

			else if( operation === Operation.GetModuleCalls) {
				// ----------------------------------------
				//         Calls: getModuleCalls
				// ----------------------------------------
				this.logger.debug('--- Get Module Calls ---');
				const recordParam = this.getNodeParameter('Recordid', i) as  IdLocator
				let recordId = recordParam.value;
				if(recordParam.mode=== 'url'){
					recordId=extractId(resource,recordParam)
				}
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
				responseData = response.data;	
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



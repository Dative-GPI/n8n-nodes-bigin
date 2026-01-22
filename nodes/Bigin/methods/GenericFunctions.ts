
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-condition */


import sortBy from 'lodash/sortBy';
import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
  IHttpRequestOptions,
  INodeListSearchResult,

} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import {
	type LoadedFields,
	type ModuleItems,
	type BiginOAuth2ApiCredentials,
	Methods,
	Resource,
	ModuleEndpoints,
	BiginCredentialName,
	BiginCoqlLimit,
	COQLOperators,
	COQLCommands,
	SelectClause,
	OrderByClause,
	WhereClause,
	SearchLogic,
	COQLQuery,
	WhereCondition,
  BiginCoqlOffsetLimit,
  BiginFieldMetadata,
  BiginDataTypes,
  BannedFields,
  LoadedPipelineLayouts,
  PipelineLayout,
  IdLocator,
} from '../types';
import { isBiginDataType } from './ResourceMappingMethods';

export function throwOnErrorStatus(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	responseData: {
		data?: Array<{ status: string; message: string }>;
	},
) {
	if (responseData?.data?.[0].status === 'error') {
		throw new NodeOperationError(this.getNode(), responseData as Error);
	}
}

export async function zohoApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	coqlQuery: boolean = false,
) {
	const { oauthTokenData } = await this.getCredentials<BiginOAuth2ApiCredentials>(BiginCredentialName);


	this.logger.debug("oauthTokenData:" + oauthTokenData);
	this.logger.debug("Api_domain:" +oauthTokenData.api_domain );
	this.logger.debug("Body:"+ body);
	this.logger.debug("QS:"+ qs);
	this.logger.debug("method: "+method, );
  this.logger.debug("Endpoint:" + endpoint);

  if(!(coqlQuery || endpoint.toString().endsWith('upsert'))){
    body = { data: [body] };
  }


	const options: IHttpRequestOptions = {
		body,
		method,
		qs,
		url: `${oauthTokenData.api_domain}/bigin/v2${endpoint}`,
		json: true,
	};
	this.logger.debug("Url:"+options.url );



	try {
		const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, BiginCredentialName, options);
		if (responseData === undefined) return [];
		throwOnErrorStatus.call(this, responseData as IDataObject);
		return responseData;
	} catch (error) {
    const args = error.cause?.data
			? {
					message: error.cause.data.message || 'The Zoho API returned an error.',
					description: JSON.stringify(error.cause.data, null, 2),
				}
			: undefined;
		throw new NodeApiError(this.getNode(), error as JsonObject, args);
	}
}


export async function zohoApiBatchedRequest(
    this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject | IDataObject[] = {},
    qs: IDataObject = {},
    coqlQuery: boolean = false,
): Promise<IDataObject[]> {
    const { oauthTokenData } = await this.getCredentials<BiginOAuth2ApiCredentials>(BiginCredentialName);
    const baseUri = `${oauthTokenData.api_domain}/bigin/v2${endpoint}`;
    const results: IDataObject[] = [];

    const bodyArray = Array.isArray(body) ? body : [body];
    const BATCH_SIZE = 100;


    const batches = [];
    for (let i = 0; i < bodyArray.length; i += BATCH_SIZE) {
        batches.push(bodyArray.slice(i, i + BATCH_SIZE));
    }



    for (const batch of batches) {
        if (!coqlQuery) {
            body = { data: batch };
        }
        this.logger.debug("Processing batch number:" + (batches.indexOf(batch) + 1) + " of " + batches.length);
        this.logger.debug("Request body:" + JSON.stringify(body, null, 2)); 
        const options: IHttpRequestOptions = {
            body,
            method,
            qs,
            url: baseUri,
            json: true,
        };

        if (!Object.keys(qs).length) {
            delete options.qs;
        }

        try {
            const responseData = await this.helpers.httpRequestWithAuthentication?.call(this, BiginCredentialName, options);
            if (responseData === undefined) continue;

			      this.logger.debug("Zoho response:"+ JSON.stringify(responseData, null, 2));
            throwOnErrorStatus.call(this, responseData as IDataObject);
            if (Array.isArray(responseData.data)) {
                results.push(...responseData.data);
            } else {
                results.push(responseData);
            }
        } catch (error) {
			this.logger.debug("Error in batch request:", error);
            const args = error.cause?.data
                ? {
                      message: error.cause.data.message || 'The Zoho API returned an error.',
                      description: JSON.stringify(error.cause.data, null, 2),
                  }
                : undefined;



            throw new NodeApiError(this.getNode(), error as JsonObject, args);
        }
    }

    return results;
}

export async function zohoApiRequestAllItemsBatch(
    this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
) {
    const returnData: IDataObject[] = [];
    const returnAll = this.getNodeParameter('Returnall', 0) as boolean;
    let limit = 0;
    if (!returnAll) {
        limit = this.getNodeParameter('Limit', 0) as number;
    }

    let nextPageToken = null;
    let responseData;

    do {
        if (nextPageToken) {
            qs.page_token = nextPageToken;
        }

        responseData = await zohoApiRequest.call(this, method, endpoint, body, qs);
        if (Array.isArray(responseData) && !responseData.length) break;

        const records = responseData.data as IDataObject[];
        if (!returnAll && limit > 0) {
            const remainingSpace = limit - returnData.length;
            if (remainingSpace <= 0) break;
            returnData.push(...records.slice(0, remainingSpace));
        } else {
            returnData.push(...records);
        }

        if (!returnAll && returnData.length >= limit) break;
        
        nextPageToken = responseData.info.next_page_token;
        this.logger.debug("Response Info:", responseData.info); 
        if(!nextPageToken){
          this.logger.debug("No next page token, ending pagination.");
          break;
        }

    } while (
        nextPageToken !== null &&
        nextPageToken !== undefined &&
        (returnAll || (limit > 0 && returnData.length < limit))
    );

    if (!returnAll && limit > 0) {
        return returnData.slice(0, limit);
    }

    return returnData;
}


export async function zohoApiRequestAllItemsBatchReturnAll(
    this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
) {
    const returnData: IDataObject[] = [];
    const returnAll = true;
    let nextPageToken = null;
    let responseData;
    do {
        if (nextPageToken) {
            qs.page_token = nextPageToken;
        }
        responseData = await zohoApiRequest.call(this, method, endpoint, body, qs);
        if (Array.isArray(responseData) && !responseData.length) break;
        const records = responseData.data as IDataObject[];
        returnData.push(...records);
        nextPageToken = responseData.info.next_page_token;
    } while (
        nextPageToken !== null &&
        nextPageToken !== undefined &&
        (returnAll)
    );
    return returnData;
}


export async function zohoApiListSearch(
	this: ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {

	const qs: IDataObject = {};

	if (filter) {
		qs.search = filter;
	}

	if (paginationToken) {
		qs.page_token = paginationToken;
	}

	const response = await zohoApiRequest.call(
		this,
		method,
		endpoint,
		{},
		qs,
	);



	const records = response.data as IDataObject[];



	const results = records.map((record) => ({
		name: record.name as string,
		value: record.id as string,
	}));



	const nextToken = response.info?.next_page_token;




	return {
		results,
		paginationToken: nextToken,
	};
}


export interface BuildCoqlQueryParams {
	resource: Resource | Resource;
	selectFields: string[];
	whereConditions: WhereCondition[];
	whereLogic?: SearchLogic;
	orderBy?: OrderByClause[];
	limit?: number;
	offset?: number;
}

export function buildCoqlQuery(
	resource: Resource,
	selectFields: string[],
	whereConditions: WhereCondition[],
	whereLogic?: SearchLogic,
	orderBy?: OrderByClause[],
	limit?: number,
	offset?: number,
): COQLQuery {

	const selectClause: SelectClause = {
		fields: selectFields,
		allFields: false,
	};

	const whereClause: WhereClause = {
		conditions: whereConditions,
	};

	if (whereLogic) {
		whereClause.logic = whereLogic;
	}

	return {
		select: selectClause,
		from: resource.toString(),
		where: whereClause,
		orderBy: orderBy && orderBy.length > 0 ? orderBy : undefined,
		limit,
		offset,
	};
}



export function extractId(resource : Resource,recordParam: IdLocator): string{
  const regex = new RegExp(`${resource.toLowerCase()}/([0-9a-zA-Z]+)(?:\\?|$)`);
  const match = recordParam.value.match(regex);
  if (!match) {
    throw new Error(`Could not extract ID from URL: ${recordParam.value}`);
  }
  const recordId = match[1];
  return recordId
}

export async function searchModule(
	this: ILoadOptionsFunctions,
	resource: Resource,
	searchField: string,
  outputFields: string[],
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {

this.logger.debug("searchField: "+searchField)
this.logger.debug("filter: "+filter)

	const { conditions } = buildWhereConditions([
		{
			Field: searchField,
			Operator: 'like',
			Value: filter,
		},
	]);

	const coqlQuery = buildCoqlQuery(
		resource,                                // resource
		['id',searchField],                      // selectFields
		conditions,                              // whereConditions
		undefined,                               // whereLogic
		undefined,                               // orderBy
		20,                                      // limit
		paginationToken ? Number(paginationToken) : 0, // offset
	);



	const response = await zohoApiCoqlRequest.call(this, coqlQuery, false);



	const results = response.map((r: any) => {
		const displayName = outputFields
			.map(f => r[f])
			.filter(v => v !== undefined && v !== null)
			.join(' | '); 

		return {
			name: displayName,
			value: r.id,
		};
	});



	const nextToken = String(Number(paginationToken ?? 0) + 20);



	return {
		results,
		paginationToken: nextToken,
	};
}




function buildSelectClause(select: SelectClause): string {
  return `${COQLCommands.SELECT} ${select.fields.join(', ')}`;
}

function buildOrderByClause(orderBy: OrderByClause[]): string {
  if (orderBy.length === 0) {
    return '';
  }
  return `${COQLCommands.ORDERBY} ${orderBy
    .map(({ Field, Direction }) => `${Field} ${Direction}`)
    .join(', ')}`;
}


export function buildWhereConditions(
	whereConditions: IDataObject[],
): { conditions: WhereCondition[]; logic?: SearchLogic } {

	const validConditions = whereConditions
		.map((c: IDataObject) => {
			const field = c.Field as string;
			let operator = c.Operator as string;
			const value = c.Value;

			if (!field || !operator) return null;

			if (operator === 'equals') {
				operator = '=';
			}

			if (operator === 'starts with') {
				const strVal = String(value ?? '');
				return {
					field,
					operator: 'like',
					value: strVal.endsWith('%') ? strVal : `${strVal}%`,
				};
			}

			if (operator === 'ends with') {
				const strVal = String(value ?? '');
				return {
					field,
					operator: 'like',
					value: strVal.startsWith('%') ? strVal : `%${strVal}`,
				};
			}

			if (operator === 'like' || operator === 'not like') {
				const strVal = String(value ?? '');
				return {
					field,
					operator: operator as COQLOperators,
					value: strVal.includes('%') ? strVal : `%${strVal}%`,
				};
			}

			if (operator === 'in' || operator === 'not in') {
				const listVal = Array.isArray(value)
					? value.map(String)
					: String(value ?? '').split(',').map(v => v.trim());

				return {
					field,
					operator: operator as COQLOperators,
					value: listVal,
				};
			}

			// if (operator === 'between' || operator === 'not between') {
			// 	const values = Array.isArray(value)
			// 		? value
			// 		: String(value ?? '').split(',').map(v => v.trim());

			// 	return {
			// 		field,
			// 		operator: operator as COQLOperators,
			// 		value: [String(values[0]), String(values[1])],
			// 	};
			// }

			if (operator === 'is null' || operator === 'is not null') {
				return { field, operator: operator as COQLOperators, value: null };
			}

			return {
				field,
				operator: operator as COQLOperators,
				value: value !== undefined && value !== null ? String(value) : null,
			};
		})
		.filter(Boolean) as WhereCondition[];

	let logic: SearchLogic | undefined;

	if (whereConditions.length > 1) {
		logic =
			whereConditions[0].logic === 'OR'
				? 'OR'
				: 'AND';
	}

	return { conditions: validConditions, logic };
}




function buildWhereClause(where: WhereClause): string {
  if (where.conditions.length === 0) {
    return '';
  }

  const logic = where.logic || 'AND';
  const conditions = where.conditions.map(condition => {
    const { field, operator, value } = condition;
    switch (operator) {
      case 'is null':
      case 'is not null':
        return `(${field} ${operator})`;
      case 'in':
      case 'not in':
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error(`Value for ${operator} must be a non-empty array`);
        }
        return `(${field} ${operator} ('${value.join("','")}'))`;
      //case 'between':
      // case 'not between':
      //   if (!Array.isArray(value) || value.length !== 2) {
      //     throw new Error(`Value for ${operator} must be an array of two elements`);
      //   }
      //   return `(${field} ${operator} '${value[0]}' AND '${value[1]}')`;
      case 'like':
      case 'not like':
        if (value === null) {
          throw new Error(`Value for ${operator} cannot be null`);
        }
        return `(${field} ${operator} '${value}' )`;
      default:
        if (value === null) {
          throw new Error(`Value for ${operator} cannot be null`);
        }
        return `(${field} ${operator} '${value}')`;
    }
  });

  // Regrouper les conditions par paires de 2, avec des parenthèses autour de chaque paire
  const groupedConditions: string[] = [];
  for (let i = 0; i < conditions.length; i += 2) {
    if (i + 1 < conditions.length) {
      // Si une paire existe, regrouper les deux conditions
      groupedConditions.push(`(${conditions[i]} ${logic} ${conditions[i + 1]})`);
    } else {
      // Sinon, ajouter la condition seule avec des parenthèses
      groupedConditions.push(`(${conditions[i]})`);
    }
  }

  return `${COQLCommands.WHERE} ${groupedConditions.join(` ${logic} `)}`;
}


function buildLimitClause(limit: number): string {
  return `${COQLCommands.LIMIT} ${limit}`;
}

function buildOffsetClause(offset: number): string {
  return `${COQLCommands.OFFSET} ${offset}`;
}

function buildCOQLQuery(query: COQLQuery): string {
  
  const select = buildSelectClause(query.select);
  const from = `${COQLCommands.FROM} ${query.from}`;
  const where = query.where ? buildWhereClause(query.where) : '';
  const orderBy = query.orderBy ? buildOrderByClause(query.orderBy) : '';

  const offset = query.offset !== undefined ? buildOffsetClause(query.offset) : '';
  query.offset = Math.min(query.offset || 0, BiginCoqlOffsetLimit);
  query.limit = Math.min(BiginCoqlOffsetLimit - query.offset, query.limit || BiginCoqlOffsetLimit);

  const limit = query.limit !== undefined ? buildLimitClause(query.limit) : '';

  return [select, from, where, orderBy, limit, offset]
    .filter(clause => clause !== '')
    .join(' ');
}


export async function zohoApiCoqlRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  query: COQLQuery,
  returnAll = false,
) {
  const batchSize = BiginCoqlLimit; // 200 for non-IN queries
  const returnData: IDataObject[] = [];
  const fetched = 0;
  const offset = query.offset || 0;

	this.logger.debug("COQL Query:"+JSON.stringify(query, null, 2) );



  // Check if any condition uses the IN operator
  const inConditions = query.where?.conditions.filter(
    c => c.operator === 'in'
  ) || [];

  if (inConditions.length > 0) {
    returnData.push(...await handleInOperatorQueries.call(
      this,
      query,
      inConditions,
      returnAll,
      batchSize,
      fetched
    ));
  } else {
    returnData.push(...await handleNonInOperatorQueries.call(
      this,
      query,
      returnAll,
      batchSize,
      fetched,
      offset
    ));
  }

  if (!returnAll && query.limit && fetched > query.limit) {
    return returnData.slice(0, query.limit);
  }
  return returnData;
}





async function handleInOperatorQueries(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  query: COQLQuery,
  inConditions: WhereCondition[],
  returnAll: boolean,
  batchSize: number,
  fetched: number
): Promise<IDataObject[]> {   
  const inOperatorLimit = 50;
  const returnData: IDataObject[] = [];

  for (const inCondition of inConditions) {
    const { field, value } = inCondition;
    if (!Array.isArray(value)) {
      throw new Error(`Value for ${'in'} must be an array`);
    }

    const valueChunks = [];
    for (let i = 0; i < value.length; i += inOperatorLimit) {
      valueChunks.push(value.slice(i, i + inOperatorLimit));
    }

    for (const chunk of valueChunks) {
      const chunkWhere: WhereClause = {
        conditions: query.where!.conditions.map(condition =>
          condition.operator === 'in' && condition.field === field
            ? { ...condition, value: chunk }
            : condition
        ),
        logic: query.where?.logic,
      };

      let chunkFetched = 0;
      let chunkOffset = query.offset || 0;

      do {
        const currentLimit = returnAll
          ? inOperatorLimit
          : Math.min(inOperatorLimit, (query.limit || inOperatorLimit) - fetched - chunkFetched);

        if(currentLimit <= 0 || chunkOffset >= BiginCoqlOffsetLimit){
          break;
        }

        const coqlQuery = buildCOQLQuery({
          ...query,
          where: chunkWhere,
          limit: currentLimit,
          offset: chunkOffset,
        });

        const body = { select_query: coqlQuery };
        this.logger.debug(`Executing COQL Query (IN chunk): ${coqlQuery}`);

        const response = await zohoApiRequest.call(
          this,
          Methods.POST,
          ModuleEndpoints.Coql,
          body,
          {},
          true
        );

        const records = response.data as IDataObject[];
        if (!records || records.length === 0) break;

        returnData.push(...records);
        chunkFetched += records.length;
        fetched += records.length;
        chunkOffset += inOperatorLimit;

        if (!returnAll && query.limit && fetched >= query.limit) break;
        if (records.length < inOperatorLimit) break;
      } while (true);

      if (!returnAll && query.limit && fetched >= query.limit) break;
    }

    if (!returnAll && query.limit && fetched >= query.limit) break;
  }

  return returnData;
}


async function handleNonInOperatorQueries(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  query: COQLQuery,
  returnAll: boolean,
  batchSize: number,
  fetched: number,
  offset: number
) {
  const returnData: IDataObject[] = [];

  do {
    const currentLimit = returnAll
      ? batchSize
      : Math.min(batchSize, (query.limit || batchSize) - fetched);

    if(currentLimit <= 0 || offset >= BiginCoqlOffsetLimit){
      break;
    }

    const coqlQuery = buildCOQLQuery({
      ...query,
      limit: currentLimit,
      offset,
    });

    const body = { select_query: coqlQuery };
    this.logger.debug(`Executing COQL Query: ${coqlQuery}`);

    const response = await zohoApiRequest.call(
      this,
      Methods.POST,
      ModuleEndpoints.Coql,
      body,
      {},
      true
    );

    const records = response.data as IDataObject[];
    if (!records || records.length === 0) break;

    returnData.push(...records);
    fetched += records.length;
    offset += batchSize;

    if (!returnAll && query.limit && fetched >= query.limit) break;
    if (records.length < batchSize && offset < BiginCoqlOffsetLimit && fetched < BiginCoqlOffsetLimit) break;
  } while (true);

  return returnData;
}







export function throwOnEmptyUpdate(this: IExecuteFunctions, module: Resource) {
	throw new NodeOperationError(
		this.getNode(),
		`Please enter at least one field to update for the ${module}.`,
	);
}

//               helpers
// ----------------------------------------

export const toLoadOptions = (items: ModuleItems, nameProperty: string) =>
	items.map((item) => ({ name: `${item[nameProperty]} (${item.id})`, value: item.id }));




/**
 * Retrieve all fields for a resource, sorted alphabetically.
 */
export async function getFields(
	this: ILoadOptionsFunctions | IExecuteFunctions,
	module: Resource | Resource,
	{ onlyCustom } = { onlyCustom: false },
) {
	const qs = { module };

	let { fields } = (await zohoApiRequest.call(
		this,
		Methods.GET,
		ModuleEndpoints.Fields,
		{},
		qs,
	)) as LoadedFields;

	if (onlyCustom) {
		fields = fields.filter(({ custom_field }) => custom_field);
	}

	const options = fields.map(({ field_label, api_name }) => ({
		name: field_label,
		value: api_name,
	}));

	return sortBy(options, (o) => o.name);
}

export const mapMetadataToOptions = (fields: BiginFieldMetadata[]) =>
  fields.map((field) => ({
    name: field.field_label,
    value: field.api_name,
  }));


//Owner,

export const getDefaultValue = (dataType: BiginDataTypes, apiName: string): any => {
	// Edge Case: These fields are consistently arrays in Bigin records 
	// even if metadata classifies them differently (e.g., Tag as text)
	const arrayFields = ['Tag', 'Actions'];
	if (arrayFields.includes(apiName)) {
		return [];
	}

	switch (dataType) {
		case BiginDataTypes.boolean:
			return false;
		case BiginDataTypes.multiselectpicklist:
			return [];
		// For all other types: text, picklist, email, phone, datetime, lookup, textarea, date, integer, etc.
		// Bigin's native "empty" state in fresh records is null.
		default:
			return null;
	}
};

export async function getSearchableFields(this: ILoadOptionsFunctions | IExecuteFunctions,	module: Resource): Promise<BiginFieldMetadata[]> {
    return filterSearchableFields(await getFieldsMetadata.call(this, module))
}

export async function getFilterableFields(this: ILoadOptionsFunctions | IExecuteFunctions,	module: Resource): Promise<BiginFieldMetadata[]> {
    return filterFilterableFields (await getFieldsMetadata.call(this, module))
}

export async function getSortableFields(this: ILoadOptionsFunctions | IExecuteFunctions,	module: Resource): Promise<BiginFieldMetadata[]> {
    return filterSortableFields(await getFieldsMetadata.call(this, module))
}


export function filterSortableFields(fields: BiginFieldMetadata[]): BiginFieldMetadata[] {
    return fields.filter(e => e.sortable == true && !Object.values(BannedFields).includes(e.api_name))
}

export function filterSearchableFields(fields: BiginFieldMetadata[]): BiginFieldMetadata[] {
    return fields.filter(e => e.searchable == true && !Object.values(BannedFields).includes(e.api_name))
}

export function filterFilterableFields(fields: BiginFieldMetadata[]): BiginFieldMetadata[] {
    return fields.filter(e => e.filterable == true && !Object.values(BannedFields).includes(e.api_name))
}




  export async function getFieldsMetadata(
    this: ILoadOptionsFunctions | IExecuteFunctions,
    module: Resource | Resource,
    onlyCustom:boolean =false,
  ): Promise<BiginFieldMetadata[]> {
    const qs = { module };

    this.logger.debug(`Fetching metadata for module: ${module}`);

    const response = (await zohoApiRequest.call(
      this,
      Methods.GET,
      ModuleEndpoints.Fields,
      {},
      qs,
    )) as { fields?: any[] };

    let fields = response.fields;

    if (!Array.isArray(fields)) {
      this.logger.warn('Bigin API returned no fields:', response);
      return [];
    }

    if (onlyCustom) {
      fields = fields.filter(({ custom_field }) => custom_field);
    }

    //Some Fields are returned by Bigin even though we can't select/filter/sort on the field returns an error when done
    fields = fields.filter((field) => isBiginDataType(field.data_type))
    
    const metadata: BiginFieldMetadata[] = fields.map((field) => ({
      api_name: field.api_name,
      field_label: field.field_label,
      data_type: field.data_type, // now safely narrowed
      module: module ,
      custom_field: field.custom_field,
      system_mandatory: field.system_mandatory ?? false,
      searchable : field.searchable,
      filterable : field.filterable,
      sortable : field.sortable,
      read_only: field.read_only,
      tooltip: field.tooltip ?? undefined,
      pick_list_values: field.pick_list_values,
    }));
  metadata.sort((a,b)=>a.field_label.localeCompare(b.field_label))
    return metadata;
  }

    export async function getStages(this: ILoadOptionsFunctions | IExecuteFunctions, subPipelineName: string): Promise<{ name: string; value: string }[]> {             
              const responseData = (await zohoApiRequest.call(
                  this,
                  Methods.GET,
                  ModuleEndpoints.Layouts,
                  {},
                  { module: Resource.Pipelines },
              )) as LoadedPipelineLayouts;
              
              if (!responseData.layouts?.length) return [];
              
              const matchingLayouts = responseData.layouts.filter((layout: PipelineLayout) => {
                  return layout.profiles?.some(
                      (profile) => profile._default_assignment_view?.name === subPipelineName
                  );
              });
              
              const stagePickListOptions = matchingLayouts
                  .flatMap(layout => layout.sections)
                  .flatMap(section => section.fields)
                  .filter(field => field.api_name === 'Sub_Pipeline')
                  .flatMap(field => field.pick_list_values || [])
                  .filter(pickValue => pickValue.display_value === subPipelineName)
                  .flatMap(pickValue => pickValue.maps || [])
                  .flatMap(map => map.pick_list_values || []);
              
              let stages = stagePickListOptions.map(o => ({
                  name: o.display_value,
                  value: o.actual_value,
              }));

              stages = stages.sort((a,b) =>a.name.localeCompare(b.name) )

              
              const uniqueStages = stages.filter((stage, index, self) =>
                  index === self.findIndex((s) => s.value === stage.value)
              );
              
              return uniqueStages;
      }

      export async function getSubPipelines(this: ILoadOptionsFunctions | IExecuteFunctions): Promise<{ display_value: string; actual_value: string }[]> {             

        const endpoint = ModuleEndpoints.Layouts;
				const queryString: IDataObject = {
					module: Resource.Pipelines
				};
				const response = await zohoApiRequest.call(this, Methods.GET, endpoint, {}, queryString) as LoadedPipelineLayouts;
				
				if (!response.layouts?.length) {
					return [];
				} else {
					const subPipelineOptions = response.layouts
						.flatMap(layout => layout.sections)
						.flatMap(section => section.fields)
						.filter(field => field.pick_list_values && field.pick_list_values.length > 0)
						.flatMap(field => field.pick_list_values!)
						.filter(pickList => pickList.maps && pickList.maps.length > 0)
						.map(pickList => ({
							id: pickList.actual_value,
							name: pickList.display_value
						}));
					

					const uniqueMap = new Map();
					subPipelineOptions.forEach(item => uniqueMap.set(item.id, item));
					

					return Array.from(uniqueMap.values()).map(item => ({
						display_value: item.name,
            actual_value: item.id,
					}));
				}
      }


export async function getRequiredFieldsMetadata(
	this: ILoadOptionsFunctions | IExecuteFunctions,
	module: Resource,
	onlyCustom :boolean = false ,
): Promise<BiginFieldMetadata[]> {
  return (await getFieldsMetadata.call(this,module,onlyCustom)).filter(field => field.system_mandatory === true)
}


export async function getFieldMetadata(
	this: ILoadOptionsFunctions | IExecuteFunctions,
	module: Resource,
	inputField: string
): Promise<BiginFieldMetadata> {

	const fields = await getFieldsMetadata.call(this, module);
	const field = fields.find(f => f.api_name === inputField);

	if (!field) {
		throw new Error(`Field "${inputField}" not found in module "${module}"`);
	}

	return field;
}



const TEXT_LIKE_OPERATORS: readonly COQLOperators[] = [
  'equals',
  '!=',
  'like',
  'not like',
  'starts with',
  'ends with',
  'in',
  'is null',
  'is not null',
] as const;

const NUMERIC_DATE_OPERATORS: readonly COQLOperators[] = [
  'equals',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'is null',
  'is not null',
] as const;

const BOOLEAN_OPERATORS: readonly COQLOperators[] = [
  'equals',
  '!=',
  'in',
  'is null',
  'is not null',
] as const;

const DEFAULT_OPERATORS: readonly COQLOperators[] = [
  'equals',
  '!=',
  'is null',
  'is not null',
];

export const OPERATORS_BY_BIGIN_TYPE_GROUPS: Array<{
  types: BiginDataTypes[];
  operators: readonly COQLOperators[];
}> = [
  {
    types: [
      BiginDataTypes.datetime,
      BiginDataTypes.date,
      BiginDataTypes.text,
      BiginDataTypes.email,
      BiginDataTypes.website,
      BiginDataTypes.double_str,
      BiginDataTypes.long_str,
      BiginDataTypes.autonumber,
      BiginDataTypes.phone,
      BiginDataTypes.picklist,
      BiginDataTypes.textarea,
      BiginDataTypes.profileimage,
      BiginDataTypes.multiselectpicklist,
    ],
    operators: TEXT_LIKE_OPERATORS,
  },
  {
    types: [
      BiginDataTypes.integer,
      BiginDataTypes.currency,
      BiginDataTypes.decimal,
      BiginDataTypes.bigint,
      BiginDataTypes.percent,
    ],
    operators: NUMERIC_DATE_OPERATORS,
  },
  {
    types: [
      BiginDataTypes.boolean,
    ],
    operators: BOOLEAN_OPERATORS,
  },
];

export const OPERATORS_BY_BIGIN_TYPE: Record<
	BiginDataTypes,
	readonly COQLOperators[]
> = Object.values(BiginDataTypes).reduce((acc, type) => {
	const group = OPERATORS_BY_BIGIN_TYPE_GROUPS.find((g) =>
		g.types.includes(type as BiginDataTypes),
	);

	const operators = (group?.operators ?? DEFAULT_OPERATORS)
		.slice()
		.sort((a, b) => a.localeCompare(b));

	acc[type as BiginDataTypes] = operators;

	return acc;
}, {} as Record<BiginDataTypes, readonly COQLOperators[]>);


export function getOperatorsForType(type: BiginDataTypes): readonly COQLOperators[] {
	return OPERATORS_BY_BIGIN_TYPE[type] ?? DEFAULT_OPERATORS;
}


export async function getFieldsAsString(
	this: ILoadOptionsFunctions | IExecuteFunctions,
	module: Resource | Resource,
	{ onlyCustom } = { onlyCustom: false },
): Promise<string> {
	const options = await getFields.call(this, module, { onlyCustom });
	return options.map((o) => o.value).join(',');
}



export const capitalizeInitial = (str: string) => str[0].toUpperCase() + str.slice(1);

export async function getPicklistValues(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	module: Resource,
	fieldName: string,
) {
	const fields = await getFieldsMetadata.call(this, module);

	return fields
		.filter((f: any) => f.api_name === fieldName)
		.flatMap((f: any) => f.pick_list_values || [])
		.map((option: any) => ({
			name: option.display_value,
			value: option.actual_value,
		}))
    .sort((a, b) => a.name.localeCompare(b.name));;
}


export async function getDisplayPicklistValues(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	module: Resource,
	fieldName: string,
) {
	const fields = await getFieldsMetadata.call(this, module);
  this.logger.debug("getDisplayPicklistValues")
	return fields
		.filter((f: any) => f.api_name === fieldName)
		.flatMap((f: any) => f.pick_list_values || [])
		.map((option: any) => ({
			name: option.display_value,
			value: option.display_value,
		}));
}





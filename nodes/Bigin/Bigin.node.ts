import {

	IExecuteFunctions,
	INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { myLoadOptions } from './methods/LoadOptionsMethods';
import { execute } from './methods/ExecuteMethods';
import { getMappingColumns } from './methods/ResourceMappingMethods';
import { myListSearch } from './methods/ListSearchMethods';
import { accountFields, accountOperations, callsFields, callsOperations, contactFields, contactOperations, eventFields, eventOperations, pipelineFields, pipelineOperations, productFields, productOperations, taskFields, taskOperations, } from './descriptions';
import { makeBiginFields, makeMultiPickListFields } from './descriptions/SharedFields';





export class Bigin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bigin',
		name: 'bigin',
		icon: 'file:bigin.svg',
		group: ['transform'],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		version: 1,
		description: 'Consume Bigin API',
		defaults: {
			name: 'Bigin',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				displayName: 'Bigin Credentials',
				name: 'biginOAuth2Api',
				required: true,
	
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Call',
						value: 'Calls',
					},
					{
						name: 'Company',
						value: 'Accounts',
					},
					{
						name: 'Contact',
						value: 'Contacts',
					},
					{
						name: 'Event',
						value: 'Events',
					},
					{
						name: 'Pipeline',
						value: 'Pipelines',
					},
					{
						name: 'Product',
						value: 'Products',
					},
					{
						name: 'Task',
						value: 'Tasks',
					},
				],
				default: 'Accounts',
			},

			...accountOperations,
			...accountFields,
			...contactOperations,
			...contactFields,
			...pipelineOperations,
			...pipelineFields,
			...productOperations,
			...productFields,
			...callsOperations,
			...callsFields,
			...taskOperations,
			...taskFields,
			...eventOperations,
			...eventFields,
			makeBiginFields(),
			makeMultiPickListFields(),
		],
	};

	methods = {
		loadOptions: myLoadOptions,
		resourceMapping: {
			getMappingColumns,
		},
		listSearch: myListSearch,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return execute.call(this);
	}
}

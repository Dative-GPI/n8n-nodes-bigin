/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */
import type { INodeProperties } from 'n8n-workflow';

import {
	makeDelete,
	makeGet,
	makeGetAll,
	makeGetMany,
	makeGetPicklistValues,
	makeInputMode,
	makePatch,
	makeRecordsListInput,
	makeUpdate,
	makeUpsert,
} from './SharedFields';

//Buggy api for write operations
export const pipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		 name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['Pipelines'],
			},
		},
		options: [
			{
				'name': 'Count',
				'value': 'Count',
				'description': 'Get the total number of deals',
                    'action': 'Count amount of deals'

			},
			{
				'name': 'Create',
				'value': 'Create',
				'description': 'Create a deal',
				'action': 'Create a deal'
			},
			{
				'name': 'Create Or Update',
				'value': 'Upsert',
				'description': 'Create a new record, or update the current one if it already exists (upsert)',
				'action': 'Create or update a deal'
			},
			{
				'name': 'Delete',
				'value': 'Delete',
				'description': 'Delete a deal',
				'action': 'Delete a deal'
			},
			{
				'name': 'Get',
				'value': 'Get',
				'description': 'Get a deal',
				'action': 'Get a deal'
			},
			{
				'name': 'Get All',
				'value': 'Getall',
				'description': 'Get all deals',
				'action': 'Get all deals'
			},
			{
				'name': 'Get Fields',
				'value': 'Getfields',
				'description': 'Get the fields of deals',
				'action': 'Get fields of deals'
			},
			{
				'name': 'Get Many',
				'value': 'Getmany',
				'description': 'Get many deals',
				'action': 'Get many deals'
			},
			{
				'name': 'Get PickList Values',
				'value': 'GetpickListvalues',
				'description': 'Get the values of a picklist',
				'action': 'Get the values of a picklist'
			},
			{
				'name': 'Obtain All Pipelines',
				'value': 'Getpipelines',
				'description': 'Obtain all Pipelines',
				'action': 'Get all pipelines'
			},
			{
				'name': 'Obtain All Sub Pipelines',
				'value': 'Getsubpipelines',
				'description': 'Obtain all Sub Pipelines',
				'action': 'Get all sub pipelines'
			},
			{
				'name': 'Obtain All Sub Pipelines Stages',
				'value': 'Getstages',
				'description': 'Obtain all Stages of a Sub Pipeline',
				'action': 'Get all stages of a sub pipeline'
			},
			{
				'name': 'Update All fields',
				'value': 'Update',
				'description': 'Update a deal',
				'action': 'Update a deal'
			},
			{
				'name': 'Update Specific Fields',
				'value': 'Patch',
				'description': 'Update specific fields of a deal',
				'action': 'Patch a deal'
			}
		],
		default: 'Create',
	},
];


const makePipelineFields = (): INodeProperties[] => {
	return [
		{
			displayName: 'Sub Pipeline Name or ID',
			name: 'Subpipelinenamew',
			description: 'Name of the sub pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			placeholder: '',
			type: 'options',
			required: true,
			default: '',
			typeOptions:{
				loadOptionsMethod: 'getSubPipelines'
			},		
			displayOptions: {
				show: {
					resource: ['Pipelines'],
					operation: ['Getstages','Create'],
				},
			},
		},

//Stage and Sub pipeline depend on the current deal position. We stop the user from modifying the sub pipeline
		{
			displayName: 'Sub Pipeline Name or ID',
			name: 'Subpipelinenamero',
			description: 'Name of the sub pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			placeholder: '',
			type: 'options',
			required: true,
			default: '',
			typeOptions:{
				loadOptionsMethod: 'getRecordSubPipeline',
				loadOptionsDependsOn: ['Recordid']
			},		
			displayOptions: {
				show: {
					resource: ['Pipelines'],
					operation: ['Patch','Update'],
					Inputmode: ['Single']
				},
			},
		},
		

		{
			displayName: 'Stage Name or ID',
			name: 'Stagecreate',
			description: 'Name of the sub pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			placeholder: '',
			type: 'options',
			required: true,
			default: '',
			typeOptions:{
				loadOptionsMethod: 'getStages',
				loadOptionsDependsOn: ['Subpipelinenamero','Subpipelinenamew']
			},		
			displayOptions: {
				show: {
					resource: ['Pipelines'],
					operation: ['Create','Patch','Update','Upsert'],
				},
			},
		},

		{
			displayName: 'Stage Name or ID',
			name: 'Stage',
			description: 'Name of the sub pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			placeholder: '',
			type: 'options',
			required: true,
			default: '',
			typeOptions:{
				loadOptionsMethod: 'getStages',
				loadOptionsDependsOn: ['Subpipelinenamero','Subpipelinenamew']
			},		
			displayOptions: {
				show: {
					resource: ['Pipelines'],
					operation: ['Patch','Update','Upsert'],
					Inputmode: ['Single']
				},
			},
		},


		

	]

}

export const pipelineFields: INodeProperties[] = [

	...makeInputMode('Pipelines'),
		//Disabled because of api issues
	...makeUpsert('Pipelines'),

	...makeUpdate('Pipelines'),
	...makePatch('Pipelines'),

	...makePipelineFields(),
	...makeRecordsListInput('Pipelines'),

	...makeGetPicklistValues('Pipelines'),

	...makeDelete('Pipelines'),
	...makeGetMany('Pipelines'),
	...makeGet('Pipelines'),

    ...makeGetAll('Pipelines'),
];


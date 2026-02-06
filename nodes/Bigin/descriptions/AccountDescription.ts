import type { INodeProperties } from 'n8n-workflow';
import { makeInputMode, makeRecordsListInput, makeDelete, makeGet, makeGetMany, makeGetPicklistValues, makeGetAll, makeGetModuleCalls, makeGetModuleDeals, makeUpdate, makePatch, makeUpsert, makeCreateTags, makeAddTags, makeDeleteTags } from './SharedFields';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['Accounts'],
			},
		},
		default: 'Get',
		options: [
			{
				name: 'Count',
				value: 'Count',
				description: 'Get the total number of companies',
				action: 'Count amount of companies'
			},
			{
				name: 'Create',
				value: 'Create',
				description: 'Create an account',
				action: 'Create a company'
			},
			{
				name: 'Create Or Update',
				value: 'Upsert',
				description: 'Create a new company, or update the current one if it already exists (upsert)',
				action: 'Create or update a company'
			},
			{
				name: 'Delete',
				value: 'Delete',
				description: 'Delete a company',
				action: 'Delete a company'
			},
			{
				name: 'Get',
				value: 'Get',
				description: 'Get a company',
				action: 'Get a company'
			},
			{
				name: 'Get All',
				value: 'Getall',
				description: 'Get all companies',
				action: 'Get all companies'
			},

			{
				name: 'Get Company Calls',
				value: 'Getmodulecalls',
				description: 'Get all calls linked to a company',
				action: 'Get all calls linked to a company'
			},
			{
				name: 'Get Company Deals',
				value: 'Getmoduledeals',
				description: 'Get all deals linked to a company',
				action: 'Get all deals linked to a company'
			},
			
			{
				name: 'Get Fields',
				value: 'Getfields',
				description: 'Get fields of a company',
				action: 'Get fields of a company'
			},
			{
				name: 'Get Many',
				value: 'Getmany',
				description: 'Get many companies',
				action: 'Get many companies'
			},
			{
				name: 'Get PickList Values',
				value: 'Getpicklistvalues',
				description: 'Get the values of a picklist',
				action: 'Get the values of a picklist'
			},
			{
				name: 'Tags Add',
				value: 'Addtags',
				description: 'Add available tags to a company',
				action: 'Add available tags to a company'
			},
			{
				name: 'Tags Create',
				value: 'Createtags',
				description: 'Create new company tags',
				action: 'Create new company tags'
			},
			{
				name: 'Tags Delete',
				value: 'Deletetags',
				description: 'Delete companies tag',
				action: 'Delete companies tag'
			},
			{
				name: 'Tags Get',
				value: 'Gettags',
				description: 'Get companies tags',
				action: 'Get companies tags'
			},

			{
				name: 'Update All Fields',
				value: 'Update',
				description: 'Update a company',
				action: 'Update a company'
			},
			{
				name: 'Update Specific Fields',
				value: 'Patch',
				description: 'Update specific fields of a company',
				action: 'Update specific fields of a company'
			},
		],

	},
];

export const accountFields: INodeProperties[] = [

	...makeInputMode('Accounts'),

	...makeRecordsListInput('Accounts'),
	...makeUpsert('Accounts'),
	...makeUpdate('Accounts'),
	...makePatch('Accounts'),
	...makeDelete('Accounts'),


	...makeGet('Accounts'),

	...makeGetMany('Accounts'),
	...makeAddTags('Accounts'),
	...makeCreateTags('Accounts'),
	...makeGetPicklistValues('Accounts'),
	...makeGetAll('Accounts'),
	...makeDeleteTags('Accounts'),
	...makeGetModuleCalls('Accounts'),
	...makeGetModuleDeals('Accounts'),
	
];
import type { INodeProperties} from 'n8n-workflow';

import {
	makeAddTags,
	makeCreateTags,
	makeDelete,
	makeDeleteTags,
	makeGet,
	makeGetAll,
	makeGetMany,
	makeGetModuleCalls,
	makeGetModuleDeals,
	makeGetPicklistValues,
	makeInputMode,
	makePatch,
	makeRecordsListInput,
	makeUpdate,
	makeUpsert,
} from './SharedFields';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['Contacts'],
			},
		},
		options: [
			{
				name: 'Count',
				value: 'Count',
				description: 'Get the total number of contacts',
				action: 'Count amount of contacts'

			},
			{
				name: 'Create',
				value: 'Create',
				description: 'Create a contact',
				action: 'Create a contact'
			},
			{
				name: 'Create Or Update',
				value: 'Upsert',
				description: 'Create a new record, or update the current one if it already exists (upsert)',
				action: 'Create or update a contact'
			},
			{
				name: 'Delete',
				value: 'Delete',
				description: 'Delete a contact',
				action: 'Delete a contact'
			},
			{
				name: 'Get',
				value: 'Get',
				description: 'Get a contact',
				action: 'Get a contact'
			},
			{
				name: 'Get All',
				value: 'Getall',
				description: 'Get all contacts',
				action: 'Get all contacts'
			},

			{
				name: 'Get Fields',
				value: 'Getfields',
				description: 'Get the fields of contacts',
				action: 'Get fields of contacts'
			},
			{
				name: 'Get Many',
				value: 'Getmany',
				description: 'Get many contacts',
				action: 'Get many contacts'
			},
			{
				name: 'Get PickList Values',
				value: 'Getpicklistvalues',
				description: 'Get the values of a picklist',
				action: 'Get the values of a picklist'
			},
			
			{
				name: 'Get Record Calls',
				value: 'Getmodulecalls',
				description: 'Get all calls linked to a contact',
				action: 'Get all calls linked to a contact'
			},
			{
				name: 'Get Record Deals',
				value: 'Getmoduledeals',
				description: 'Get all deals linked to a contact',
				action: 'Get all deals linked to a contact'
			},
			{
				name: 'Tags Add',
				value: 'Addtags',
				description: 'Add available tags to a contact',
				action: 'Add available tags to a contact'
			},
			{
				name: 'Tags Create',
				value: 'Createtags',
				description: 'Create new contact tags',
				action: 'Create new contact tags'
			},
			{
				name: 'Tags Delete',
				value: 'Deletetags',
				description: 'Delete contacts tag',
				action: 'Delete contacts tag'
			},
			{
				name: 'Tags Get',
				value: 'Gettags',
				description: 'Get contacts tags',
				action: 'Get contacts tags'
			},
			{
				name: 'Update All Fields',
				value: 'Update',
				description: 'Update a contact',
				action: 'Update a contact'
			},
			{
				name: 'Update Specific Fields',
				value: 'Patch',
				description: 'Update specific fields of a contact',
				action: 'Update specific fields of a contact'
			},
			

		],

		default: 'Get',
	},
];



export const contactFields: INodeProperties[] = [
	
	
	...makeInputMode('Contacts'),
	...makeUpsert('Contacts'),

	...makeUpdate('Contacts'),
	...makePatch('Contacts'),

	...makeRecordsListInput('Contacts'),
	
	...makeDelete('Contacts'),

	...makeGet('Contacts'),
	...makeAddTags('Contacts'),
	...makeCreateTags('Contacts'),
	...makeDeleteTags('Contacts'),
	...makeGetPicklistValues('Contacts'),

	...makeGetMany('Contacts'),


	...makeGetAll('Contacts'),

	...makeGetModuleCalls('Contacts'),
	
	...makeGetModuleDeals('Contacts'),
];





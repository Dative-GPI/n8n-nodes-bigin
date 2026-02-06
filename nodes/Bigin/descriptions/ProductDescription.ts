import type { INodeProperties } from 'n8n-workflow';

import { makeAddTags, makeCreateTags, makeDelete, makeDeleteTags, makeGet, makeGetAll, makeGetMany,  makeGetPicklistValues,  makeInputMode, makePatch, makeRecordsListInput, makeUpdate, makeUpsert } from './SharedFields';
export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['Products'],
			},
		},
		options: [
			{
				name: 'Count',
				value: 'Count',
				description: 'Get the total number of products',
				action: 'Count amount of products'
			},
			{
				name: 'Create',
				value: 'Create',
				description: 'Create a product',
				action: 'Create a product'
			},
			{
				name: 'Create or Update',
				value: 'Upsert',
				description: 'Create a new record, or update the current one if it already exists (upsert)',
				action: 'Create or update a product'
			},
			{
				name: 'Delete',
				value: 'Delete',
				description: 'Delete a product',
				action: 'Delete a product'
			},
			{
				name: 'Get',
				value: 'Get',
				description: 'Get a product',
				action: 'Get a product'
			},
			{
				name: 'Get All',
				value: 'Getall',
				description: 'Get all products',
				action: 'Get all products'
			},
			{
				name: 'Get Fields',
				value: 'Getfields',
				description: 'Get the fields of products',
				action: 'Get fields of products'
			},
			{
				name: 'Get Many',
				value: 'Getmany',
				description: 'Get many products',
				action: 'Get many products'
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
				description: 'Add available tags to a product',
				action: 'Add available tags to a product'
			},
			{
				name: 'Tags Create',
				value: 'Createtags',
				description: 'Create new product tags',
				action: 'Create new product tags'
			},
			{
				name: 'Tags Delete',
				value: 'Deletetags',
				description: 'Delete products tag',
				action: 'Delete products tag'
			},
			{
				name: 'Tags Get',
				value: 'Gettags',
				description: 'Get products tags',
				action: 'Get products tags'
			},
			{
				name: 'Update All Fields',
				value: 'Update',
				description: 'Update a product',
				action: 'Update a product'
			},
			{
				name: 'Update Specific Fields',
				value: 'Patch',
				description: 'Update specific fields of a product',
				action: 'Update specific fields of a product'
			},
					
		],
		default: 'Get',
	},
];

export const productFields: INodeProperties[] = [
	...makeInputMode('Products'),
	...makeUpsert('Products'),

	...makeUpdate('Products'),
	...makePatch('Products'),
	...makeRecordsListInput('Products'),

	...makeGetPicklistValues('Products'),

	...makeDelete('Products'),
	...makeAddTags('Products'),
	...makeCreateTags('Products'),
        	...makeDeleteTags('Products'),
	...makeGet('Products'),

	...makeGetMany('Products'),


	...makeGetAll('Products'),
];

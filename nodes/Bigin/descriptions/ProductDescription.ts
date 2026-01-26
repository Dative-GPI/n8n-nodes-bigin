/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */
import type { INodeProperties } from 'n8n-workflow';

import { makeDelete, makeGet, makeGetAll, makeGetMany,  makeGetPicklistValues,  makeInputMode, makePatch, makeRecordsListInput, makeUpdate, makeUpsert } from './SharedFields';
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
				'name': 'Count',
				'value': 'Count',
				'description': 'Get the total number of products',
				'action': 'Count amount of products'
			},
			{
				'name': 'Create',
				'value': 'Create',
				'description': 'Create a product',
				'action': 'Create a product'
			},
			{
				'name': 'Create or Update',
				'value': 'Upsert',
				'description': 'Create a new record, or update the current one if it already exists (upsert)',
				'action': 'Create or update a product'
			},
			{
				'name': 'Delete',
				'value': 'Delete',
				'description': 'Delete a product',
				'action': 'Delete a product'
			},
			{
				'name': 'Get',
				'value': 'Get',
				'description': 'Get a product',
				'action': 'Get a product'
			},
			{
				'name': 'Get All',
				'value': 'Getall',
				'description': 'Get all products',
				'action': 'Get all products'
			},
			{
				'name': 'Get Fields',
				'value': 'Getfields',
				'description': 'Get the fields of products',
				'action': 'Get fields of products'
			},
			{
				'name': 'Get Many',
				'value': 'Getmany',
				'description': 'Get many products',
				'action': 'Get many products'
			},
			{
				'name': 'Get PickList Values',
				'value': 'Getpicklistvalues',
				'description': 'Get the values of a picklist',
				'action': 'Get the values of a picklist'
			},
			{
				'name': 'Update All fields',
				'value': 'Update',
				'description': 'Update a product',
				'action': 'Update a product'
			},
			{
				'name': 'Update Specific Fields',
				'value': 'Patch',
				'description': 'Update specific fields of a product',
				'action': 'Update specific fields of a product'
			},
					
		],
		default: 'Create',
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

	...makeGet('Products'),

	...makeGetMany('Products'),


	...makeGetAll('Products'),
];

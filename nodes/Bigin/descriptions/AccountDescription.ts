/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */
import type { INodeProperties } from 'n8n-workflow';
import { makeInputMode, makeRecordsListInput, makeDelete, makeGet, makeGetMany, makeGetPicklistValues, makeGetAll, makeGetModuleCalls, makeGetModuleDeals, makeUpdate, makePatch, makeUpsert } from './SharedFields';

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
		default: 'Create',
		options: [
			{
				'name': 'Count',
				'value': 'Count',
				'description': 'Get the total number of companies',
				'action': 'Count amount of companies'

			},
			{
				'name': 'Create',
				'value': 'Create',
				'description': 'Create an account',
				'action': 'Create a company'
			},
			{
				'name': 'Create Or Update',
				'value': 'Upsert',
				'description': 'Create a new company, or update the current one if it already exists (upsert)',
				'action': 'Create or update a company'
			},
			{
				'name': 'Delete',
				'value': 'Delete',
				'description': 'Delete a company',
				'action': 'Delete a company'
			},
			{
				'name': 'Get',
				'value': 'Get',
				'description': 'Get a company',
				'action': 'Get a company'
			},
			{
				'name': 'Get All',
				'value': 'Getall',
				'description': 'Get all companies',
				'action': 'Get all companies'
			},
			{
				'name': 'Get Many',
				'value': 'Getmany',
				'description': 'Get many companies',
				'action': 'Get many companies'
			},
			{
				'name': 'Get Company Deals',
				'value': 'Getmoduledeals',
				'description': 'Get all deals linked to a company',
				'action': 'Get all deals linked to a company'
			},
			{
				'name': 'Get Company Calls',
				'value': 'GetmoduleCalls',
				'description': 'Get all calls linked to a company',
				'action': 'Get all calls linked to a company'
			},
			{
				'name': 'Get Fields',
				'value': 'Getfields',
				'description': 'Get fields of a company',
				'action': 'Get fields of a company'
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
				'description': 'Update a company',
				'action': 'Update a company'
			},
			{
				'name': 'Update Specific Fields',
				'value': 'Patch',
				'description': 'Update specific fields of a company',
				'action': 'Update specific fields of a company'
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
	// ----------------------------------------
	//             account: delete
	// ----------------------------------------
	...makeDelete('Accounts'),

	// ----------------------------------------
	//               account: get
	// ----------------------------------------
	...makeGet('Accounts'),

	// ----------------------------------------
	//             account: getAll
	// ----------------------------------------
	...makeGetMany('Accounts'),

	...makeGetPicklistValues('Accounts'),
	...makeGetAll('Accounts'),
	...makeGetModuleCalls('Accounts'),
	...makeGetModuleDeals('Accounts'),
	
];
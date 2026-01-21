/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */

import type { INodeProperties } from 'n8n-workflow';
import {  makeDelete, makeGet, makeGetAll, makeGetMany, makeGetPicklistValues, makeInputMode, makePatch, makeRecordsListInput, makeUpdate, makeUpsert } from './SharedFields';


export const callsOperations: INodeProperties[] = [
    {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
			noDataExpression: true,
			default: 'Create',
            options: [
                {
                    'name': 'Create',
                    'value': 'Create',
                    'description': 'Create a call',
                    'action': 'Create a call'
                },
                {
                    'name': 'Create Or Update',
                    'value': 'Upsert',
                    'description': 'Create a new call, or update the current one if it already exists',
                    'action': 'Create or update a call'
                },
                {
                    'name': 'Delete',
                    'value': 'Delete',
                    'description': 'Delete a call',
                    'action': 'Delete a call'
                },
                {
                    'name': 'Get',
                    'value': 'Get',
                    'description': 'Get a call',
                    'action': 'Get a call'
                },
                {
                    'name': 'Get All',
                    'value': 'Getall',
                    'description': 'Get all calls',
                    'action': 'Get all calls'
                },
                {
                    'name': 'Get Many',
                    'value': 'Getmany',
                    'description': 'Get many calls',
                    'action': 'Get many calls'
                },
                {
                    'name': 'Get Fields',
                    'value': 'Getfields',
                    'description': 'Get the fields of calls',
                    'action': 'Get fields of calls'
                },
                {
                    'name': 'Get PickList Values',
                    'value': 'Getpicklistvalues',
                    'description': 'Get the values of a picklist',
                    'action': 'Get the values of a picklist'
                },
                {
                    'name': 'Update All Fields',
                    'value': 'Update',
                    'description': 'Update a call',
                    'action': 'Update a call'
                },
                {
                    'name': 'Update Specific Fields',
                    'value': 'Patch',
                    'description': 'Update specific fields of a call',
                    'action': 'Patch a call'
                },
            ],

            displayOptions: {
                show: {
                    resource: ['Calls'],
                },
            },

        },

];
    
export const callsFields: INodeProperties[] = [


    ...makeInputMode('Calls'),
    ...makeUpsert('Calls'),

    ...makeUpdate('Calls'),
    ...makePatch('Calls'),
    ...makeRecordsListInput('Calls'),

    ...makeGetPicklistValues('Calls'),
    ...makeDelete('Calls'),

    ...makeGet('Calls'),

    ...makeGetAll('Calls'),
    ...makeGetMany('Calls'),

]

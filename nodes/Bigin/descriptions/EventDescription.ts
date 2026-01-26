/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */
import type { INodeProperties } from 'n8n-workflow';

import { makeDelete, makeGet, makeGetAll, makeGetMany,  makeGetPicklistValues,  makeInputMode, makePatch, makeRecordsListInput, makeUpdate } from './SharedFields';
export const eventOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['Events'],
            },
        },
        options: [
            {
                'name': 'Count',
                'value': 'Count',
                'description': 'Get the total number of events',
                'action': 'Count amount of events'
            },
            {
                'name': 'Create',
                'value': 'Create',
                'description': 'Create an event',
                'action': 'Create an event'
            },
            {
                'name': 'Delete',
                'value': 'Delete',
                'description': 'Delete an event',
                'action': 'Delete an event'
            },
            {
                'name': 'Get',
                'value': 'Get',
                'description': 'Get an event',
                'action': 'Get an event'
            },
            {
                'name': 'Get All',
                'value': 'Getall',
                'description': 'Get all events',
                'action': 'Get all events'
            },
            {
                'name': 'Get Fields',
                'value': 'Getfields',
                'description': 'Get the fields of events',
                'action': 'Get fields of events'
            },
            {
                'name': 'Get Many',
                'value': 'Getmany',
                'description': 'Get many events',
                'action': 'Get many events'
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
                'description': 'Update an event',
                'action': 'Update an event'
            },
            {
                'name': 'Update Specific Fields',
                'value': 'Patch',
                'description': 'Update specific fields of an event',
                'action': 'Update specific fields of an event'
            }
        ],

        default: 'Get',
    },
];

export const eventFields: INodeProperties[] = [
        ...makeInputMode('Events'),
    
        ...makeUpdate('Events'),
        ...makePatch('Events'),

        ...makeRecordsListInput('Events'),
    
        ...makeGetPicklistValues('Events'),
    
        ...makeDelete('Events'),
    
        ...makeGet('Events'),
    
        ...makeGetMany('Events'),
    
    
        ...makeGetAll('Events'),
];

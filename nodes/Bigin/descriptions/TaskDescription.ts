import type { INodeProperties } from 'n8n-workflow';

import { makeDelete, makeGet, makeGetAll, makeGetMany,  makeGetPicklistValues,  makeInputMode, makePatch, makeRecordsListInput, makeUpdate, makeUpsert } from './SharedFields';
export const taskOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['Tasks'],
            },
        },
        options: [
            {
				name: 'Count',
				value: 'Count',
				description: 'Get the total number of tasks',
				action: 'Count amount of tasks',
			},
            {
                name: 'Create',
                value: 'Create',
                description: 'Create a task',
                action: 'Create a task',
            },
            {
                name: 'Create Or Update',
                value: 'Upsert',
                description: 'Create a new record, or update the current one if it already exists (upsert)',
                action: 'Create or update a task',
            },
            {
                name: 'Delete',
                value: 'Delete',
                description: 'Delete a task',
                action: 'Delete a task',
            },

            {
                name: 'Get',
                value: 'Get',
                description: 'Get a task',
                action: 'Get a task',
            },
            {
                name: 'Get All',
                value: 'Getall',
                description: 'Get all tasks',
                action: 'Get all tasks',
            },
            {
                name: 'Get Fields',
                value: 'Getfields',
                description: 'Get the fields of tasks',
                action: 'Get fields of tasks',
            },
            {
                name: 'Get Many',
                value: 'Getmany',
                description: 'Get many tasks',
                action: 'Get many tasks',
            },
            {
                name: 'Get PickList Values',
                value: 'GetpickListvalues',
                description: 'Get the values of a picklist',
                action: 'Get the values of a picklist',
            },
            {
                name: 'Update All Fields',
                value: 'Update',
                description: 'Update a task',
                action: 'Update a task',
            },
            {
                name: 'Update Specific Fields',
                value: 'Patch',
                description: 'Update specific fields of a task',
                action: 'Update specific fields of a task',
            },
        ],
        default: 'Create',
    },
];

export const taskFields: INodeProperties[] = [
        ...makeInputMode('Tasks'),
        ...makeUpsert('Tasks'),
    
        ...makeUpdate('Tasks'),
        ...makePatch('Tasks'),
    
        ...makeRecordsListInput('Tasks'),
    
        ...makeGetPicklistValues('Tasks'),
        ...makeDelete('Tasks'),
    
        ...makeGet('Tasks'),
    
        ...makeGetMany('Tasks'),
    
        ...makeGetAll('Tasks'),
];

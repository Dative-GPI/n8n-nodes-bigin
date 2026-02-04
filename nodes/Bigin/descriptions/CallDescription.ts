import type { INodeProperties } from 'n8n-workflow';
import {  makeDelete, makeGet, makeGetAll, makeGetMany, makeGetPicklistValues, makeInputMode,  makeRecordsListInput} from './SharedFields';


export const callsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'Get',
        options: [
            {
                name: 'Create',
                value: 'Create',
                description: 'Create a call',
                action: 'Create a call'
            },
            {
                name: 'Delete',
                value: 'Delete',
                description: 'Delete a call',
                action: 'Delete a call'
            },
            {
                name: 'Get',
                value: 'Get',
                description: 'Get a call',
                action: 'Get a call'
            },
            {
                name: 'Get All',
                value: 'Getall',
                description: 'Get all calls',
                action: 'Get all calls'
            },
            {
                name: 'Get Fields',
                value: 'Getfields',
                description: 'Get the fields of calls',
                action: 'Get fields of calls'
            },
            {
                name: 'Get Many',
                value: 'Getmany',
                description: 'Get many calls',
                action: 'Get many calls'
            },
            {
                name: 'Get PickList Values',
                value: 'Getpicklistvalues',
                description: 'Get the values of a picklist',
                action: 'Get the values of a picklist'
            },
			{
				name: 'Tags Add',
				value: 'Updatetags',
				description: 'Add available tags to a call',
				action: 'Add available tags to a call'
			},
			{
				name: 'Tags Create',
				value: 'Createtags',
				description: 'Create new call tags',
				action: 'Create new call tags'
			},
			{
				name: 'Tags Get',
				value: 'Gettags',
				description: 'Get calls tags',
				action: 'Get calls tags'
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

    // ...makeUpdate('Calls'),
    // ...makePatch('Calls'),
    ...makeRecordsListInput('Calls'),

    ...makeGetPicklistValues('Calls'),
    ...makeDelete('Calls'),

    ...makeGet('Calls'),

    ...makeGetAll('Calls'),
    ...makeGetMany('Calls'),

]

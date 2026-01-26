import type { INodeProperties } from 'n8n-workflow';


import {  Operation, Resource } from '../types';

export const makeBiginFields = (): INodeProperties => {
    return {
        displayName: 'Columns',
        name: 'Columns', 
        type: 'resourceMapper', 
        default: {
            value: null,
        },
        required: true,
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: 'getMappingColumns',
                mode: 'add',
                fieldWords: {
                    singular: 'column',
                    plural: 'columns',
                },
				allowEmptyValues:true, //important
                addAllFields: false, 
                multiKeyMatch: true,
                supportAutoMap: false,
            },
			loadOptionsDependsOn: [
				'resource',
				'operation',
				'Inputmode',
			],
        },
        displayOptions: {
            show: {
                resource: ['Contacts', 'Accounts','Products','Calls','Events','Tasks','Pipelines'],
				operation: ['Upsert', 'Create', 'Update', 'Patch'],
            },
        },
    };
};


export const makeMultiPickListFields = (): INodeProperties => {
	return {
		displayName: 'Multi Select Fields',
		name: 'Multipicklist',
		placeholder: 'Add Custom Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		description: 'Filter by custom fields',
		default: {},
		options: [
			{
				name: 'Property',
				displayName: 'Custom Field',
				values: [
					{
						displayName: 'Bigin Field Name or ID',
						name: 'Field',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getMultiPicklistFields',
							loadOptionsDependsOn: ['resource'], 
						},
						default: '',
						description: 'The custom field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},

					{
						displayName: 'Bigin Picklist Values',
						name: 'Value',
						type: 'multiOptions',
						typeOptions: {
							loadOptionsMethod: 'getPicklistValuesForField',
							loadOptionsDependsOn: ['Field','resource'], 
						},
						default: [],
						displayOptions: {
							hide: {
								Field: [''],
							},
						},
						description: 'The values to set. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Warning Please select a Field above before adding another item. The values only update themselves with the last field values',
						name: 'FieldNotice',
						type: 'notice',
						default: '',
						displayOptions: {
							show: {
								Field: [''],
							},
						},
						typeOptions: {
							notice: 'Please select a Field above before adding another item.',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: [
					'Upsert', 
					'Create', 
					'Update', 
					'Patch'
				],
			},
		},
	};
};


export const makeGetPicklistValues=(resource: Resource): INodeProperties[] =>{
	return [
		{
			displayName: `${resource} Field`,
			name: 'Field',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getPicklistFields', 
				loadOptionsDependsOn:['resource']
			},
			default: '',
			required: true,
			description: 'Select the field to get its possible values. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			displayOptions: {
				show: {
					operation: ['Getpicklistvalues'],
					resource: [resource],
				},
			},
		},
	]
}




export const makeGetAll = (resource: Resource): INodeProperties[] => {
	return makeGetAllFields(resource,['Getall'])
};

export const makeGetFields = (resource: Resource, operations: Operation[]= []): INodeProperties[] => {

	return [
		{
			displayName: 'Select All Fields',
			name: 'Selectallfields',
			type: 'boolean',
			default: true,
			description: 'Whether to check to select all fields, uncheck to select specific fields',
			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
				},
			},
		},
		{
			displayName: 'Select Fields',
			name: 'Selectfields',
			type: 'multiOptions',
			required: true,
			typeOptions: {
				loadOptionsMethod: `getSearchable${resource}Fields`,
				loadOptionsDependsOn:['resource']
			},
			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
					['Selectallfields']: [false],
				},
			},
			default: [],	
			description: 'Fields to include in the result (e.g., Name, Owner, Created_Time)',
		},
	];
};

export const makeGetAllFields = (resource: Resource, operations: Operation[]= []): INodeProperties[] => {
	return [
		{
			displayName: 'Return All',
			name: 'Returnall',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'Limit',
			type: 'number',
			default: 50,
			description: 'Max number of results to return',
			typeOptions: {
				minValue: 1,
				maxValue: 50000,
			},

			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
					Returnall: [false],
				},
			},
		},
		...makeGetFields(resource,operations)
	];
};





export const makeGetMany = (resource: Resource): INodeProperties[] => {
	return [
		...makeGetAllFields(resource,['Getmany']),
		...makeSearchFilter(resource)
	];
};



export const makeUpsert = (resource: Resource): INodeProperties[] => {
	return [
		{
			displayName: `Similar ${resource} are based on required fields`,
			name:'Upsertnotice',
			type: 'notice',
			default: 'Similar ${resource} are based on required fields',
			displayOptions:{
				show: {
					operation: ['Upsert'],
					resource: [resource],
				}
			}
		}
	]
}

export const makeSearchFilter = (resource: Resource): INodeProperties[] => {

	return [
		// =============================
		// WHERE
		// =============================
		{
			displayName: 'Filter (WHERE)',
			name: 'Where',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmany'],
				},
			},
			default: {},
			description: 'Define conditions to filter records',
			options: [
				{
					displayName: 'Condition',
					name: 'Condition',
					// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
					values: [
						{
							displayName: 'Field',
							name: 'Field',
							type: 'options',
							typeOptions: {
								loadOptionsMethod: `getFilterable${resource}Fields`,								
							},
							default: '',
						},
						{
							displayName: 'Warning To update the available operators when changing fields, remove the element and add it again',
							name: 'Notice',
							type: 'notice',
							default: '',
						},
						{
							displayName: 'Operator Name or ID',
							name: 'Operator',
							type: 'options',
							typeOptions: {
								loadOptionsMethod: 'getOperators',
								loadOptionsDependsOn: ['Field']
							},
							displayOptions:{
								hide:{
									Field: ['']
								}
							},
							default: '',
							description: 'Operator to apply for the filter condition. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
						},
						

						{
							displayName: 'Value',
							name: 'Value',
							type: 'string',
							default: '',
							placeholder: 'Enter a value:',
							typeOptions: {
								loadOptionsDependsOn: ['Field']
							},
							displayOptions: {
								hide: {
									Operator: [
										'is null',
										'is not null',
									],
									Field: ['']
								},
							},
						},
						
						{
							displayName: 'Logic',
							name: 'Logic',
							type: 'options',
							default: 'AND',
							required: true,
							options: [
								{ name: 'AND', value: 'AND' },
								{ name: 'OR', value: 'OR' },
							],
						},

					],
				},
			],
		},

		// =============================
		// OFFSET
		// =============================
		{
			displayName: 'Offset',
			name: 'Offset',
			type: 'number',
			default: 0,
			description: 'Number of records to skip before returning results',
			typeOptions: { minValue: 0 },
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmany'],
				},
			},
		},

		// =============================
		// ORDER BY
		// =============================
		{
			displayName: 'Order By',
			name: 'Orderby',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			description: 'Specify how results should be sorted',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmany'],
				},
			},
			options: [
				{
					displayName: 'Sort Rule',
					name: 'Sortrule',
					values: [
						{
							displayName: 'Field',
							name: 'Field',
							type: 'options',
							typeOptions: {
								loadOptionsMethod: `getSortable${resource}Fields`,
							},
							default: '',
						},
						{
							displayName: 'Direction',
							name: 'Direction',
							type: 'options',
							default: 'ASC',
							options: [
								{ name: 'Ascending', value: 'ASC' },
								{ name: 'Descending', value: 'DESC' },
							],
						},
					],
				},
			],
		},
	];
};


export const makeInputMode = (resource: Resource): INodeProperties[] => {
	     return [   {
            displayName: 'Input Mode',
            name: 'Inputmode',
            type: 'options',
			required:true,
			default: 'Single',
            options: [
                { name: 'Single Record', value: 'Single' },
                { name: 'Multi Record', value: 'Many' },
            ],
			displayOptions: {
                show: {
                    resource: [resource],
                    operation: ['Upsert','Update','Patch'],
                },
            },
        }
	]
}

export const makeDelete = (resource: Resource): INodeProperties[] => {
	return [	
		...makeResourceLocator(resource,['Delete'])
	];
};


export const makeGet = (resource: Resource): INodeProperties[] => {
	return [
			...makeGetFields(resource,['Get']),
			...makeResourceLocator(resource,['Get'])
	];
};

export const makeUpdate = (resource: Resource): INodeProperties[] => {
	return [
			...makeInputModeResourceLocator(resource,['Update'])
	];
};


export const makePatch = (resource: Resource): INodeProperties[] => {
	return [
			...makeInputModeResourceLocator(resource,['Patch'])
	];
};


export const makeResourceLocator = (resource : Resource,operation:Operation[]): INodeProperties[] => {
	return [
			{
				displayName: `${resource}`,
				name: 'Recordid',
				description: `Select the ${resource} to retrieve`,
				type: 'resourceLocator',
				default: '',
				typeOptions: {
					loadOptionsDependsOn: ['resource']
				},
				required: true,
				modes: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						hint: `Enter a ${resource} ID`,
						placeholder: '123456789',
						
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						hint: `Paste a ${resource} URL`,
						placeholder: `https://bigin.zoho.eu/bigin/org20046285116/Home#/${resource.toLowerCase()}/1531990000034496328?section=Potentials`,
					},
					{
						displayName: 'List',
						name: 'list',
						type: 'list',
						typeOptions: {
							searchListMethod: `search${resource}`,
							searchable: true,
							searchFilterRequired: true,

				
							slowLoadNotice: {
								message: "Try to search by ID if it takes too long",
								timeout: 10
							}	
						},
					},
				],

				displayOptions: {
					show: {
						resource: [resource],
						operation: operation,
					},
				},
			},
	];
}





export const makeInputModeResourceLocator = (resource : Resource,operation:Operation[]): INodeProperties[] => {
	return [
			{
				displayName: `${resource}`,
				name: 'Recordid',
				description: `Select the ${resource} to retrieve`,
				type: 'resourceLocator',
				default: '',
				typeOptions: {
					loadOptionsDependsOn: ['resource']
				},
				required: true,
				modes: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						hint: `Enter a ${resource} ID`,
						placeholder: '123456789',
						
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						hint: `Paste a ${resource} URL`,
						placeholder: `https://bigin.zoho.eu/bigin/org20046285116/Home#/${resource.toLowerCase()}/1531990000034496328?section=Potentials`,
					},
					{
						displayName: 'List',
						name: 'list',
						type: 'list',
						typeOptions: {
							searchListMethod: `search${resource}`,
							searchable: true,
							searchFilterRequired: true,
							slowLoadNotice: {
								message: "Try to search by ID if it takes too long",
								timeout: 10
							}	
						},
					},
				],

				displayOptions: {
					show: {
						resource: [resource],
						operation: operation,
					},
					hide:{
						Inputmode: ['Many'],
					}
				},
			},
	];
}







export const makeGetModuleDeals = (resource: Resource): INodeProperties[] => {
	return [

		...makeResourceLocator(resource,[Operation.GetModuleDeals]),
		{
			displayName: 'Select All Fields',
			name: 'Selectallfields',
			type: 'boolean',
			default: true,
			description: 'Whether to check to select all fields, uncheck to select specific fields',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmoduledeals'],
				},
			},
		},

		{
			displayName: 'Select Field Names or IDs',
			name: 'Selectfields',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getPipelinesFields',
			},
			required: true,
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmoduledeals'],
				},
				hide:{
					['Selectallfields']: [true],
				}
			},
			default: [],
			description: 'Fields to include in the result. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		},
	]
}

export const makeGetModuleCalls = (resource: Resource): INodeProperties[] => {
	return [

		...makeResourceLocator(resource,[Operation.GetModuleCalls]),
		{
			displayName: 'Select All Fields',
			name: 'Selectallfields',
			type: 'boolean',
			default: true,
			description: 'Whether to check to select all fields, uncheck to select specific fields',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmodulecalls'],
				},
			},
		},

		{
			displayName: 'Select Field Names or IDs',
			name: 'Selectfields',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'getCallsFields',
			},
			required: true,
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['Getmodulecalls'],
				},
				hide:{
					['Selectallfields']: [true],
				}
			},
			default: [],
			description: 'Fields to include in the result. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		},
	]
}




export const makeRecordsListInput = (resource: Resource): INodeProperties[] => {
    return [
        {
            displayName: `${resource} List (JSON)`,
            name: 'Recordlist',
            type: 'string',
            default: '',
			placeholder:'{{ $json.data }} or any list, use Aggregate node',
            description: 'Paste a JSON array of records. Example: [ { "ID": "123", "Account_Name": "New Name" } ].',
            displayOptions: {
                show: {
                    Inputmode: ['Many'],
                    resource: [resource],
                },
				hide: {
					Inputmode: ['Single'],
				}
            },
        },
    ];
};


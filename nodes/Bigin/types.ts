export const BiginCoqlLimit = 200;
export const BiginCoqlInLimit = 50;
export const BiginCoqlOffsetLimit = 10000;

export const OperationName = { 
  Create: 'Create',
  Delete: 'Delete',
  Get: 'Get',
  GetMany: 'Get Many Up to 10K records',
  GetAll: 'Get All records',
  Update: 'Update all fields',
  Upsert: 'Create or Update',
  Patch: 'Update specific Fields',
  Count: 'Count amount of Records',
  GetSubPipelines: 'Obtain all Sub Pipelines',
  GetPipelines: 'Obtain all Pipelines',
  GetStages: 'Obtain all Sub Pipelines Stages',
  GetModuleDeals: 'Get Record Deals',
  GetModuleCalls: 'Get Record Calls',
  GetFields: 'Get Fields',
  GetPickListValues: 'Get PickList Values'
}as const;

export type OperationName = typeof OperationName[keyof typeof OperationName];

export const Operation = { 
  Count: 'Count',
  Create: 'Create',
  Delete: 'Delete',
  Get: 'Get',
  GetAll: 'Getall',
  GetFields: 'Getfields',
  GetMany: 'Getmany',
  GetModuleDeals: 'Getmoduledeals',
  GetModuleCalls: 'Getmodulecalls', 
  GetPickListValues: 'Getpicklistvalues',
  GetPipelines: 'Getpipelines',
  GetStages: 'Getstages',
  GetSubPipelines: 'Getsubpipelines',
  Patch: 'Patch',
  Update: 'Update',
  Upsert: 'Upsert',
}as const;

export type Operation = typeof Operation[keyof typeof Operation];

export const DefaultAction: string = Operation.Create;




export const Resource = {
  Accounts: 'Accounts',
  Contacts: 'Contacts',
  Pipelines: 'Pipelines',
  Products: 'Products',
  Tasks: 'Tasks',
  Events: 'Events',
  Calls: 'Calls',
  Notes: 'Notes',
  Attachments: 'Attachments',
  Associate_Products: 'Associate_Products',
}


export const DefaultModule: string = Resource.Accounts;

export type Resource = typeof Resource[keyof typeof Resource];


export const ModuleEndpoints = {
  Accounts: `/${Resource.Accounts}`,
  Contacts: `/${Resource.Contacts}`,
  Pipelines: `/${Resource.Pipelines}`,
  Products: `/${Resource.Products}`,
  Tasks: `/${Resource.Tasks}`,
  Events: `/${Resource.Events}`,
  Calls: `/${Resource.Calls}`,
  Coql: '/coql',
  Layouts: '/settings/layouts',
  Fields: '/settings/fields',
  RecordCount: '/actions/count',
  RelatedCalls: '/All_Calls',
  RelatedDeals: '/Deals',
} as const;

export type ModuleEndpoints = typeof ModuleEndpoints[keyof typeof ModuleEndpoints];

export const ResourceEndpointMap: Partial<Record<Resource, ModuleEndpoints>> = {
  [Resource.Accounts]: ModuleEndpoints.Accounts,
  [Resource.Contacts]: ModuleEndpoints.Contacts,
  [Resource.Pipelines]: ModuleEndpoints.Pipelines,
  [Resource.Products]: ModuleEndpoints.Products,
  [Resource.Tasks]: ModuleEndpoints.Tasks,
  [Resource.Events]: ModuleEndpoints.Events,
  [Resource.Calls]: ModuleEndpoints.Calls,
};

export const getEndpoint = (resource: Resource): string => {
  return ResourceEndpointMap[resource]?.toString() ?? '';
};

export const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  UPSERT: 'UPSERT',
} as const;

export type Methods = typeof Methods[keyof typeof Methods];


export const BiginCredentialName = 'biginOAuth2Api';

export const ContactFields = {
  Account_Name: 'Account_Name',
  First_Name: 'First_Name',
  Last_Name: 'Last_Name',
  Email: 'Email',
  Phone: 'Phone',
  Title: 'Title',
  Mailing_Street: 'Mailing_Street',
  Mailing_City: 'Mailing_City',
  Mailing_State: 'Mailing_State',
  Mailing_Zip: 'Mailing_Zip',
  Mailing_Country: 'Mailing_Country', 
  Full_Name: 'Full_Name',
  Mobile: 'Mobile',
  Home_Phone: 'Home_Phone',
  Email_Opt_Out: 'Email_Opt_Out',
  Description: 'Description',
  Tag: 'Tag',
  Unsubscribed_Mode: 'Unsubscribed_Mode',
  Last_Activity_Time: 'Last_Activity_Time',
  Modified_Time: 'Modified_Time',
  Created_Time: 'Created_Time',
}

export type ContactFields = typeof ContactFields[keyof typeof ContactFields];

export const allContactFields: string[] = Object.values(ContactFields);



export const PipelineFields = {
    Owner: 'Owner',
    Amount: 'Amount',
    Deal_Name: 'Deal_Name',
    Closing_Date: 'Closing_Date',
    Account_Name: 'Account_Name',
    Stage: 'Stage',
    Contact_Name: 'Contact_Name',
    Created_By: 'Created_By',
    Modified_By: 'Modified_By',
    Created_Time: 'Created_Time',
    Modified_Time: 'Modified_Time',
    Last_Activity_Time: 'Last_Activity_Time',
    Description: 'Description',
    Pipeline: 'Pipeline',
    Tag: 'Tag',
    Sub_Pipeline: 'Sub_Pipeline',
    Record_Creation_Source_ID__s: 'Record_Creation_Source_ID__s',
    Associated_Products: 'Associated_Products',
    Secondary_Contacts: 'Secondary_Contacts',
};

export type PipelineFields = typeof PipelineFields[keyof typeof PipelineFields];
export const allPipelineFields: string[] = Object.values(PipelineFields);


export const AccountFields = {
  Account_Name: 'Account_Name',
  Phone: 'Phone',
  Website: 'Website',
  Description: 'Description',
  Billing_Street: 'Billing_Street',
  Billing_City: 'Billing_City',
  Billing_State: 'Billing_State',
  Billing_Code: 'Billing_Code',
  Billing_Country: 'Billing_Country',
} as const;

export type AccountFields = typeof AccountFields[keyof typeof AccountFields];

export const allAccountFields: string[] = Object.values(AccountFields);

export const CallFields = {
  Subject: 'Subject',
  CTI_Entry: 'CTI_Entry',
  Call_Agenda: 'Call_Agenda',
  Call_Duration: 'Call_Duration',
  Call_Start_Time: 'Call_Start_Time',
  Call_Duration_in_seconds: 'Call_Duration_in_seconds',
  Owner: 'Owner',
  Modified_By: 'Modified_By',
  Last_Activity_Time: 'Last_Activity_Time',
  Description: 'Description',
  Dialled_Number: 'Dialled_Number',
  Created_Time: 'Created_Time',
  Caller_ID: 'Caller_ID',
  Call_Type: 'Call_Type',
  Created_By: 'Created_By',
  Call_Status: 'Call_Status',
  Reminder: 'Reminder',
  Who_Id: 'Who_Id',
  What_Id: 'What_Id',
  Voice_Recording__s: 'Voice_Recording__s',
  Tag: 'Tag',
};



export type CallFields = typeof CallFields[keyof typeof CallFields];

export const allCallsFields: string[] = Object.values(CallFields);

export const NodeParameters = {
  resource: 'resource',
  operation: 'operation',
  recordId: 'Recordid',
  recordList: 'Recordlist',
  field: 'Field',
  value: 'Value',
  multipicklist: 'Multipicklist',
  inputMode: 'Inputmode',
  returnAll: 'Returnall',
  limit: 'Limit',
  singleRecord: 'Singlerecord',
  multiRecord: 'Multirecord',
  logic: 'Logic',
  orderBy : 'Orderby',
  direction: 'Direction',
  sortRule: 'Sortrule',
  selectFields: 'Selectfields',
  where: 'Where',
  condition : 'Condition',
  operator: 'Operator',
  offset: 'Offset',
  selectAllFields: 'Selectallfields',
  subPipelineName: 'Subpipelinename',
  Columns: 'Columns',
  ...AccountFields,
  ...ContactFields,
  ...PipelineFields,
  ...CallFields,
} as const;

export type NodeParameters = typeof NodeParameters[keyof typeof NodeParameters];
export const InputModes = {
  Single: 'Single',
  Many: 'Many',
} as const;

export type InputModes = typeof InputModes[keyof typeof InputModes];



export const NodeTypes = {
  boolean: 'boolean',
  collection: 'collection',
  button: 'button',
  color: 'color',
  dateTime: 'dateTime',
  fixedCollection: 'fixedCollection',
  hidden: 'hidden',
  json: 'json',
  callout: 'callout',
  multiOptions: 'multiOptions',
  number: 'number',
  notice: 'notice',
  options: 'options',
  string: 'string',
  credentialsSelect: 'credentialsSelect',
  resourceLocator: 'resourceLocator',
  curlImport: 'curlImport',
  resourceMapper: 'resourceMapper',
  filter: 'filter',
  assignmentCollection: 'assignmentCollection',
  credentials: 'credentials',
  workflowSelector: 'workflowSelector',
} as const;
export type NodeTypes = typeof NodeTypes[keyof typeof NodeTypes];




export const BiginFunctions = {
  getAccounts : 'getAccounts',
  getPipelines : 'getPipelines',
  getStages : 'getStages',
  getProducts : 'getProducts',
  getContacts : 'getContacts',
  getSubPipelines : 'getSubPipelines',
  getContactsIds : 'getContactsIds',
  getAccountsIds : 'getAccountsIds',
  getModules : 'getModules',
  getAccountsFields : 'getAccountsFields',
  getContactsFields : 'getContactsFields',
  getProductsFields : 'getProductsFields',
  getPipelinesFields : 'getPipelinesFields',
  getCustomPipelineFields : 'getCustomPipelineFields',
  getCustomAccountFields : 'getCustomAccountFields',
  getCustomContactFields : 'getCustomContactFields',
  getCustomProductFields : 'getCustomProductFields',
  getPipelinesIds: 'getPipelinesIds',
  getCallsFields : 'getCallsFields',
  getOperators: 'getOperators',
  getPicklistFields: 'getPicklistFields',
  getMultiPicklistFields: 'getMultiPicklistFields',
  getPicklistValuesForField: 'getPicklistValuesForField',
} as const;

export type BiginFunctions = typeof BiginFunctions[keyof typeof BiginFunctions];





export type GetAllFilterOptions = {
	fields: string[];
	[otherOptions: string]: unknown;
};

// ----------------------------------------
//               for auth
// ----------------------------------------

export type BiginOAuth2ApiCredentials = {
	oauthTokenData: {
		api_domain: string;
	};
};

// ----------------------------------------
//         for field adjusters
// ----------------------------------------

export type ModuleItems = Array<{ [key: string]: string }>;


export type BiginFieldMetadata = {
  api_name: string;
  field_label: string;
  data_type: BiginDataTypes;
  module: Resource;
  custom_field?: boolean;
  system_mandatory?: boolean;
  tooltip?: string;
  searchable: boolean,
  sortable: boolean,
  filterable: boolean,
  read_only : boolean,
  pick_list_values?: Array<{
    display_value: string;
    actual_value: string;
  }>;
}

export const BiginDataTypes = {
  text: 'text',
  email: 'email',
  website: 'website',
  autonumber: 'autonumber',
  picklist: 'picklist',
  ownerlookup: 'ownerlookup',
  lookup: 'lookup',
  boolean: 'boolean',
  textarea: 'textarea',
  profileimage: 'profileimage',
  multiselectpicklist: 'multiselectpicklist',
  phone: 'phone',
  integer: 'integer',
  date: 'date',
  datetime: 'datetime',
  bigint: 'bigint',
  userlookup: 'userlookup',
  long_str: 'long_str',
  currency: 'currency',
  double_str: 'double_str',
  decimal: 'decimal',
  percent: 'percent',
} as const;
export type BiginDataTypes = typeof BiginDataTypes[keyof typeof BiginDataTypes];


//API does not indicate not searchable filterable etc..., they are not visible in UI and to be created by Bigin. and make request fail.
export const BannedFields = {
  CTI_Entry : 'CTI_Entry',
  Call_Status : 'Call_Status',
  Associated_Products : 'Associated_Products',
  Secondary_Contacts: 'Secondary_Contacts',
  Participants: 'Participants'
}
export type BannedFields = typeof BiginDataTypes[keyof typeof BiginDataTypes];


export const GlitchyField = {
  $se_module : '$se_module',
  Full_Name: 'Full_Name',
  $related_module: '$related_module',
}
export type GlitchyField = typeof GlitchyField[keyof typeof GlitchyField];

export type IdLocator = {
	mode: 'id' | 'url' | 'list';
	value: string;
};

export const SearchLogic = {
  AND: 'AND',
  OR: 'OR',
};

export type SearchLogic = typeof SearchLogic[keyof typeof SearchLogic];

export const COQLCommands = {
  SELECT : 'SELECT',
  FROM : 'FROM',
  WHERE : 'WHERE',
  LIMIT : 'LIMIT',
  OFFSET : 'OFFSET',
  ORDERBY : 'ORDER BY',
  ASC : 'ASC',
  DESC : 'DESC',
} as const;

export type COQLCommands = typeof COQLCommands[keyof typeof COQLCommands];

export const COQLOperators = {
  equals: 'equals',
  not_equal: '!=',
  like: 'like',
  not_like: 'not like',
  in: 'in',
  not_in: 'not in',
  is_null: 'is null',
  is_not_null: 'is not null',
  greater: '>',
  greater_equal: '>=',
  less: '<',
  less_equal: '<=',
  //between: 'between',
  //not_between: 'not between',
  join: '.',
  starts_with: 'starts with',
  ends_with: 'ends with', 

} as const;

export type COQLOperators = typeof COQLOperators[keyof typeof COQLOperators];

export interface SelectClause {
  fields: string[];  
  allFields?: boolean; 
}

type Operator = typeof COQLOperators[keyof typeof COQLOperators];

export interface WhereCondition {
  field: string;
  operator: Operator;
  value: string | string[] | number | boolean | null;
}

export interface WhereClause {
  conditions: WhereCondition[];
  logic?: SearchLogic; 
}


export interface OrderByClause {
  Field: string;
  Direction: 'ASC' | 'DESC';
}

export interface LimitClause {
  limit: number;
}

export interface OffsetClause {
  offset: number;
}

export interface COQLQuery {
  select: SelectClause;
  from: string;
  where?: WhereClause;
  orderBy?: OrderByClause[];
  limit?: number;
  offset?: number;
}


// ----------------------------------------
//         for resource loaders
// ----------------------------------------

export type LoadedAccounts = Array<{
	Account_Name: string;
	id: string;
}>;


export type LoadedPipelines = Array<{
	Pipeline: string;
	id: string;
}>;



export type LoadedProducts = Array<{
	Product_Name: string;
	id: string;
}>;

export type LoadedContacts = Array<{
	Full_Name: string;
	id: string;
}>;

export type LoadedSubPipelines = Array<{
	Sub_Pipeline: string;  
	value: string;    
}>;


export type LoadedFields = {
	fields: Array<{
		field_label: string;
		api_name: string;
		custom_field: boolean;
	}>;
};

export type LoadedFieldsMetadata = {
  fields: BiginFieldMetadata[];
}


export type LoadedTasks = Array<{
	id: string;
}>;

export type LoadedEvents = Array<{
	id: string;
}>;
//----------------------------------------
export type LoadedCalls = Array<{
	id: string;
}>;

export type DeduplicationAccount = {
  Phone: string;
  Website: string;
  Account_Name:string;
  id: string;
};

export type DeduplicationContact = {
  Last_Name: string;
  First_Name: string;
  Email: string;
  Phone: string;
  Title: string;
  Account_Name: { 
    name: string;
    id: string;
  };
  id: string;
};

export type PipelineLayout = {
	id: string;
	name: string;
	display_label: string;
	status: string;
	created_time: string | null;
	modified_time: string | null;
	visible: boolean;
	source: string;
	generated_type: string;
	show_business_card: boolean;
	profiles: Array<{
		id: string;
		name: string;
		default: boolean;
		_default_view: {
			id: string;
			name: string;
			type: string;
		};
		_default_assignment_view: {
			id: string;
			name: string;
			type: string;
		};
	}>;
	sections: Array<{
		id: string;
		name: string;
		display_label: string;
		sequence_number: number;
		column_count: number;
		isSubformSection: boolean;
		tab_traversal: number;
		api_name: string;
		type: string;
		fields: Array<{
			id: string;
			field_label: string;
			api_name: string;
			display_label: string;
			type: string;
			read_only: boolean;
			required: boolean;
			pick_list_values?: Array<{
				display_value: string;
				actual_value: string;
				sequence_number: number;
				maps?: Array<{
					api_name: string;
					id: string;
					pick_list_values: Array<{
						display_value: string;
						actual_value: string;
						id: string;
						colour_code: string | null;
					}>;
				}>;
			}>;
		}>;
	}>;
};

export type ContactLayout = {
  id: string;
  field_label: string;
  api_name: string;
  display_label: string;
  type: string;
  json_type: string;
  data_type: string;
  length: number;
  read_only: boolean;
  required: boolean;
  visible: boolean;
  field_read_only: boolean;
  display_type: number;
  ui_type: number;
  system_mandatory: boolean;
  custom_field: boolean;
  default_value: string | null;
  sortable: boolean;
  sequence_number: number;
  pick_list_values?: Array<{
    display_value: string;
    actual_value: string;
    sequence_number: number;
    maps?: Array<{
      api_name: string;
      id: string;
      pick_list_values: Array<{
        display_value: string;
        actual_value: string;
        id: string;
        colour_code: string | null;
      }>;
    }>;
  }>;
  profiles: Array<{
    id: string;
    name: string;
    permission_type: string;
  }>;
  view_type: {
    view: boolean;
    edit: boolean;
    quick_create: boolean;
    create: boolean;
  };
};

export type AccountLayout = {
  id: string;
  field_label: string;
  api_name: string;
  display_label: string;
  type: string;
  json_type: string;
  data_type: string;
  length: number;
  read_only: boolean;
  required: boolean;
  visible: boolean;
  field_read_only: boolean;
  display_type: number;
  ui_type: number;
  system_mandatory: boolean;
  custom_field: boolean;
  default_value: string | null;
  sortable: boolean;
  sequence_number: number;
  display_field: boolean;
  pick_list_values_sorted_lexically: boolean;
  global_picklist: string | null;
  display_format: string | null;
  history_tracking: Record<string, boolean> | null;
  formula: Record<string, string | number | boolean>;
  decimal_place: number | null;
  mass_update: boolean;
  multiselectlookup: Record<string, string[]>;
  auto_number: {
    prefix?: string;
    suffix?: string;
    start_number?: number;
  };
  pick_list_values?: Array<{
    display_value: string;
    actual_value: string;
    sequence_number: number;
    maps?: Array<{
      api_name: string;
      id: string;
      pick_list_values: Array<{
        display_value: string;
        actual_value: string;
        id: string;
        colour_code: string | null;
      }>;
    }>;
  }>;
  profiles: Array<{
    id: string;
    name: string;
    permission_type: string;
  }>;
  view_type: {
    view: boolean;
    edit: boolean;
    quick_create: boolean;
    create: boolean;
  };
};




export type LoadedPipelineLayouts = {
	layouts: PipelineLayout[];
};




export type LoadedLayouts = {
	layouts: Array<{
		sections: Array<{
			api_name: string;
			fields: Array<{
				api_name: string;
				pick_list_values: Array<{
					display_value: string;
					actual_value: string;
				}>;
			}>;
		}>;
	}>;
};




export type LoadedDeals = Array<{
	Deal_Name: string;
	id: string;
}>;


export type LoadedVendors = Array<{
	Vendor_Name: string;
	id: string;
}>;


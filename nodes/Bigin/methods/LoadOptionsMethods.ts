import { IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";
import { allAccountFields, BiginDataTypes, LoadedAccounts, LoadedContacts, LoadedPipelineLayouts, LoadedProducts, Methods, ModuleEndpoints, Resource } from "../types";
import { getFieldMetadata, getFields, getFieldsAsString, getFieldsMetadata, getFilterableFields, getOperatorsForType, getPicklistValues, getSearchableFields, getSortableFields, getStages, getSubPipelines, mapMetadataToOptions, toLoadOptions, zohoApiRequest, zohoApiRequestAllItemsBatch, zohoApiRequestAllItemsBatchReturnAll } from "./GenericFunctions";


export const myLoadOptions: { [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]> } = {


            // ----------------------------------------
            //               modules
            // ----------------------------------------
            async getAccounts(this: ILoadOptionsFunctions) {
                const fields = await getFieldsAsString.call(this, Resource.Accounts, { onlyCustom: false });
                const qs = {
                    fields: fields
                };
                const accounts = (await zohoApiRequestAllItemsBatch.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Accounts,
                    {},
                    qs
                )) as LoadedAccounts;
                return toLoadOptions(accounts, 'Account_Name');
            },

            async getPipelines(this: ILoadOptionsFunctions) {
                const responseData = (await zohoApiRequest.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Layouts,
                    {},
                    { module: Resource.Pipelines },
                )) as LoadedPipelineLayouts;

                if (!responseData.layouts?.length) return [];

                return responseData.layouts.map(layout => ({
                    name: layout.display_label, 
                    value: layout.name,          
                }));
            },

            

            async getProducts(this: ILoadOptionsFunctions) {
                const products = (await zohoApiRequestAllItemsBatch.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Products,
                )) as LoadedProducts;
                return toLoadOptions(products, 'Product_Name');
            },

            async getContacts(this: ILoadOptionsFunctions) {
                const fields = await getFieldsAsString.call(this, Resource.Contacts, { onlyCustom: false });
                    const qs = {
                        fields: fields// Only fetch needed fields
                    };
                const contacts = (await zohoApiRequestAllItemsBatch.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Contacts,
                    {},
                    qs
                )) as LoadedContacts;
                return toLoadOptions(contacts, 'Full_Name');
            },

            async getContactsIds(this: ILoadOptionsFunctions) {
                const qs = {fields: 'id,Full_Name'}; 
                const contacts = (await zohoApiRequestAllItemsBatchReturnAll.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Contacts,
                    {},
                    qs
                )) as LoadedContacts;
                this.logger.debug(contacts.toString());
                return toLoadOptions(contacts, 'Full_Name');
            },

            //Rework the Get account as if there are thousands of accounts it will be unefficient and for now we load limit and returnAll with the fields 
            async getAccountsIds(this: ILoadOptionsFunctions) {
                const qs = {fields: 'id,Account_Name'}; 
                const accounts = (await zohoApiRequestAllItemsBatchReturnAll.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Accounts,
                    {},
                    qs
                )) as LoadedAccounts;
                return toLoadOptions(accounts, 'Account_Name');
            },

            async getPipelinesIds(this: ILoadOptionsFunctions) {
                const responseData = (await zohoApiRequest.call(
                    this,
                    Methods.GET,
                    ModuleEndpoints.Layouts,
                    {},
                    { module: Resource.Pipelines },
                )) as LoadedPipelineLayouts;

                if (!responseData.layouts?.length) return [];

                return responseData.layouts.map(layout => ({
                    name: layout.display_label,  
                    value: layout.id,          
                }));
            },

            async getModules(this: ILoadOptionsFunctions): Promise<{ name: string; value: string }[]> {
                return Object.values(Resource).map(module => ({
                    name: module,
                    value: module,
                }));
            },

           async getSubPipelines(this: ILoadOptionsFunctions): Promise<{ name: string; value: string }[]> {
                return (await getSubPipelines.call(this)).map(p =>({
                    name: p.display_value,
                    value : p.actual_value
                }));
            },


            async getStages(this: ILoadOptionsFunctions): Promise<{ name: string; value: string }[]> {
                const subPipelineName = this.getNodeParameter('Subpipelinename') as string;                              
                const stages = await getStages.call(this,subPipelineName)
                const displayStages = stages.map(s => ({
                    name: s.name,
                    value: s.name,
                }));
                return displayStages;
            },

            // ----------------------------------------
            //             module fields
            // ----------------------------------------

            //Accounts
            async getAccountsFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Accounts);
                return mapMetadataToOptions(fields)
            },

            async getSearchableAccountsFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Accounts);
                return mapMetadataToOptions(fields)
            },

            async getFilterableAccountsFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Accounts);              
                return mapMetadataToOptions(fields)
            },

            async getSortableAccountsFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Accounts);               
                return mapMetadataToOptions(fields)
            },


            //Contacts
            async getContactsFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Contacts);
                return mapMetadataToOptions(fields)
            },

            async getSearchableContactsFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Contacts);               
                return mapMetadataToOptions(fields)
            },

            async getFilterableContactsFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Contacts);         
                return mapMetadataToOptions(fields)
            },

            async getSortableContactsFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Contacts);                
                return mapMetadataToOptions(fields)
            },


            //Pipelines
            async getPipelinesFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Pipelines);
                return mapMetadataToOptions(fields)
            },

            async getSearchablePipelinesFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Pipelines);               
                return mapMetadataToOptions(fields)
            },

            async getFilterablePipelinesFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Pipelines);             
                return mapMetadataToOptions(fields)
            },

            async getSortablePipelinesFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Pipelines);             
                return mapMetadataToOptions(fields)
            },

            
            //Calls
            async getCallsFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Calls);
                return mapMetadataToOptions(fields)
            },

            async getSearchableCallsFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Calls);            
                return mapMetadataToOptions(fields)
            },

            async getFilterableCallsFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Calls);               
                return mapMetadataToOptions(fields)
            },

            async getSortableCallsFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Calls);               
                return mapMetadataToOptions(fields)
            },



            //Products
            async getProductsFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Products);
                return mapMetadataToOptions(fields)
            },

            async getSearchableProductsFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Products);            
                return mapMetadataToOptions(fields)
            },

            async getFilterableProductsFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Products);               
                return mapMetadataToOptions(fields)
            },

            async getSortableProductsFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Products);               
                return mapMetadataToOptions(fields)
            },



            //Tasks
            async getTasksFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Tasks);
                return mapMetadataToOptions(fields)
            },

            async getSearchableTasksFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Tasks);            
                return mapMetadataToOptions(fields)
            },

            async getFilterableTasksFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Tasks);               
                return mapMetadataToOptions(fields)
            },

            async getSortableTasksFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Tasks);               
                return mapMetadataToOptions(fields)
            },



            //Events
            async getEventsFields(this: ILoadOptionsFunctions) {
                const fields = await getFieldsMetadata.call(this, Resource.Events);
                return mapMetadataToOptions(fields)
            },

            async getSearchableEventsFields(this: ILoadOptionsFunctions) {
                const fields = await getSearchableFields.call(this, Resource.Events);            
                return mapMetadataToOptions(fields)
            },

            async getFilterableEventsFields(this: ILoadOptionsFunctions) {
                const fields = await getFilterableFields.call(this, Resource.Events);               
                return mapMetadataToOptions(fields)
            },

            async getSortableEventsFields(this: ILoadOptionsFunctions) {
                const fields = await getSortableFields.call(this, Resource.Events);               
                return mapMetadataToOptions(fields)
            },

            




            async getStaticAccountsFields(this: ILoadOptionsFunctions) {
                return allAccountFields.map(field => ({
                    name: field,
                    value: field,
                    }));
            },



            // Custom fields
            async getCustomPipelinesFields(this: ILoadOptionsFunctions) {
                return await getFields.call(this, Resource.Pipelines, { onlyCustom: true });
            },

            async getCustomAccountsFields(this: ILoadOptionsFunctions) {
                return await getFields.call(this, Resource.Accounts, { onlyCustom: true });
            },

            async getCustomContactsFields(this: ILoadOptionsFunctions) {
                return await getFields.call(this, Resource.Contacts, { onlyCustom: true });
            },

            async getCustomProductsFields(this: ILoadOptionsFunctions) {
                return await getFields.call(this, Resource.Products, { onlyCustom: true });
            },

            async getOperators(
                this: ILoadOptionsFunctions,
            ): Promise<INodePropertyOptions[]> {

                const resource = this.getNodeParameter('resource') as Resource

                const parameters = this.getNode().parameters

                const where=parameters.Where as IDataObject

                const condition= where.Condition as Array<IDataObject>
                const listSize=condition.length

                const lastIndex=listSize-1

                const field = this.getNodeParameter(`Where.Condition[${lastIndex}].Field`) as string

                const fieldmetadata = await getFieldMetadata.call(this,resource,field)


                const operators = getOperatorsForType( fieldmetadata.data_type)

                const capitalizeWords = (str: string): string => {
                        return str.replace(/\b\w/g, (char) => char.toUpperCase());
                    };

                    return operators.map((op) => ({
                        name: capitalizeWords(op.replace(/_/g, ' ')), // Replace underscores with spaces and capitalize
                        value: op,
                    }));
            },


           async getPicklistValuesForField(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const parameters = this.getNode().parameters

                const customFields=parameters.Multipicklist as IDataObject

                const properties= customFields.Property as Array<IDataObject>
                const listSize=properties.length

                const lastIndex=listSize-1

                const field = this.getNodeParameter(`Multipicklist.Property[${lastIndex}].Field`) as string

                const resource = this.getNodeParameter('resource') as Resource
                return getPicklistValues.call(this,resource,field)
            },
                        // ----------------------------------------
            //        module picklist options
            // ----------------------------------------

            async getPicklistFields(this: ILoadOptionsFunctions) {
                const resource = this.getNodeParameter('resource') as Resource
                const fields = await getFieldsMetadata.call(this, resource)

                return fields.filter(f => f.data_type === BiginDataTypes.multiselectpicklist
                    || f.data_type === BiginDataTypes.picklist)
                    .map(f => ({ 
                        name: f.field_label,
                        value: f.api_name
                    })); 
            },


            async getMultiPicklistFields(this: ILoadOptionsFunctions) {
                const resource = this.getNodeParameter('resource') as Resource
                const fields = await getFieldsMetadata.call(this, resource)

                return fields.filter(f => f.data_type === BiginDataTypes.multiselectpicklist)
                    .map(f => ({ 
                        name: f.field_label,
                        value: f.api_name
                    })); 
            }

}

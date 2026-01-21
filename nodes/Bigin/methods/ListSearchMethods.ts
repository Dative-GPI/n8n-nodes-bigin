import { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { searchModule } from './GenericFunctions';
import { AccountFields, ContactFields, PipelineFields, Resource } from '../types';

export const myListSearch: {
	[key: string]: (
		this: ILoadOptionsFunctions,
		filter?: string,
		paginationToken?: string,
	) => Promise<INodeListSearchResult>;
} = {
    
	async searchContacts(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Contacts,ContactFields.Full_Name,[ContactFields.Full_Name,'id'],filter,paginationToken)  
    },

    async searchAccounts(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Accounts,AccountFields.Account_Name,[AccountFields.Account_Name,'id'],filter,paginationToken)
    },

    async searchPipelines(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Pipelines,PipelineFields.Deal_Name,[PipelineFields.Deal_Name,PipelineFields.Sub_Pipeline,PipelineFields.Stage,'id'],filter,paginationToken)
    },
    async searchProducts(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Products,'Product_Name',['Product_Name','Product_Category','id'],filter,paginationToken)
    },
    async searchCalls(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Calls,'Call_Start_Time',['Call_Start_Time','Subject','id'],filter,paginationToken)
    },

    async searchEvents(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Events,'Event_Title',['Event_Title','Start_DateTime','End_DateTime','id'],filter,paginationToken)
    },

    async searchTasks(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
    ): Promise<INodeListSearchResult> {
        return searchModule.call(this,Resource.Tasks,'Subject',['Subject','Due_Date','id'],filter,paginationToken)
    },

};

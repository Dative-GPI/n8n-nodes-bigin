import { type ILoadOptionsFunctions, type ResourceMapperFields, type FieldType, type ResourceMapperField } from 'n8n-workflow';


import { BiginDataTypes, Resource, InputModes, Operation, PipelineFields } from '../types';
import {  getFieldsMetadata, getPicklistValues } from './GenericFunctions';

const fieldTypeMapping: Partial<Record<FieldType, BiginDataTypes[]>> = {
    string: [
        BiginDataTypes.text,
        BiginDataTypes.email,
        BiginDataTypes.website,
        BiginDataTypes.autonumber,
        BiginDataTypes.phone,
        BiginDataTypes.long_str,
        BiginDataTypes.textarea,
        BiginDataTypes.profileimage,
        BiginDataTypes.lookup,
        BiginDataTypes.ownerlookup,
        BiginDataTypes.userlookup,
    ],
    number: [
        BiginDataTypes.integer,
        BiginDataTypes.bigint,
        BiginDataTypes.currency,
        BiginDataTypes.double_str,
        BiginDataTypes.decimal,
        BiginDataTypes.percent,
    ],

    boolean: [
        BiginDataTypes.boolean,
    ],
    dateTime: [
        BiginDataTypes.date,
        BiginDataTypes.datetime,
    ],
    options: [
        BiginDataTypes.picklist,
		BiginDataTypes.multiselectpicklist
    ],
	array: [

	]
};

function mapBiginType(biginType: BiginDataTypes): FieldType {
	let mappedType: FieldType = 'string';

	for (const t of Object.keys(fieldTypeMapping)) {
		const biginTypes = fieldTypeMapping[t as FieldType];
		if (biginTypes?.includes(biginType)) {
			mappedType = t as FieldType;
		}
	}
	return mappedType;
}

export const isBiginDataType = (value: unknown): value is BiginDataTypes => {
	return Object.values(BiginDataTypes).includes(value as BiginDataTypes);
};

export const getMappingColumns = async function(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const resource = this.getNodeParameter('resource') as Resource;
	const operation = this.getNodeParameter('operation') as Operation;
	const fieldMetadata = await getFieldsMetadata.call(this, resource);
	let Inputmode = ''
	switch(operation){
		case Operation.Create:
			Inputmode = InputModes.Single
			break
		case Operation.Upsert:
		case Operation.Update:
		case Operation.Patch:
			Inputmode = this.getNodeParameter('Inputmode') as string;
			break;
	}

	this.logger.debug(`Inputmode: ${Inputmode}`)
	const fields = await Promise.all(
		fieldMetadata
			.filter((col) => isBiginDataType(col.data_type) && col.api_name != PipelineFields.Stage && col.api_name != PipelineFields.Pipeline && col.api_name !==PipelineFields.Sub_Pipeline)//handled manually and can't update a deal out of its Pipeline
			.map(async (col) => {
				const options =
					(col.data_type === BiginDataTypes.picklist || col.data_type === BiginDataTypes.multiselectpicklist)
						? await getPicklistValues.call(this, resource, col.api_name) : []
			
				const required = Inputmode === InputModes.Single && col.system_mandatory && (operation !== Operation.Patch || col.api_name === 'id');

				const field: ResourceMapperField = {
					id: col.api_name,
					displayName: col.field_label,
					defaultMatch: false,
					display: true,
					type: mapBiginType(col.data_type),
					canBeUsedToMatch: true,
					required: required ?? false,
				};
				this.logger.debug(`field: ${field.id + ' ' +field.required}`)

				if (options?.length) {
					field.options = options;
				}

				return field;
			}),
	);

	return { fields };
};



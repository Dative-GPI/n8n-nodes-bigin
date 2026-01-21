import type {  Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

const AdminScope = 'ZohoBigin.notifications.ALL,ZohoBigin.modules.Pipelines.READ,ZohoBigin.settings.ALL,ZohoBigin.org.ALL,ZohoBigin.settings.roles.ALL,ZohoBigin.settings.profiles.ALL,ZohoBigin.users.ALL,ZohoBigin.modules.ALL,ZohoBigin.modules.attachments.ALL,ZohoBigin.modules.Pipelines.ALL,ZohoBigin.modules.Contacts.ALL,ZohoBigin.modules.Accounts.ALL,ZohoBigin.modules.Products.ALL,ZohoBigin.modules.Tasks.ALL,ZohoBigin.modules.Events.ALL,ZohoBigin.modules.Calls.ALL,ZohoBigin.coql.READ';

export class BiginOAuth2Api implements ICredentialType {
	name = 'biginOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Bigin OAuth2 API';
	documentationUrl = 'https://github.com/org/-bigin?tab=readme-ov-file#credentials';
	icon: Icon = 'file:../nodes/Bigin/bigin.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'options',
			options: [
				{
					name: 'https://accounts.zoho.com/oauth/v2/auth',
					value: 'https://accounts.zoho.com/oauth/v2/auth',
					description: 'For the EU, AU, and IN domains',
				},
				{
					name: 'https://accounts.zoho.com.cn/oauth/v2/auth',
					value: 'https://accounts.zoho.com.cn/oauth/v2/auth',
					description: 'For the CN domain',
				},
			],
			default: 'https://accounts.zoho.com/oauth/v2/auth',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'options',
			options: [
				{
					name: 'AU - https://accounts.zoho.com.au/oauth/v2/token',
					value: 'https://accounts.zoho.com.au/oauth/v2/token',
				},
				{
					name: 'CN - https://accounts.zoho.com.cn/oauth/v2/token',
					value: 'https://accounts.zoho.com.cn/oauth/v2/token',
				},
				{
					name: 'EU - https://accounts.zoho.eu/oauth/v2/token',
					value: 'https://accounts.zoho.eu/oauth/v2/token',
				},
				{
					name: 'IN - https://accounts.zoho.in/oauth/v2/token',
					value: 'https://accounts.zoho.in/oauth/v2/token',
				},
				{
					name: 'US - https://accounts.zoho.com/oauth/v2/token',
					value: 'https://accounts.zoho.com/oauth/v2/token',
				},
			],
			default: 'https://accounts.zoho.com/oauth/v2/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: AdminScope
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'access_type=offline',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}

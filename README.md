# n8n-nodes-bigin

This is an n8n community node. It lets you use **Zoho Bigin** in your n8n workflows.

Zoho Bigin is a lightweight CRM built for small businesses, designed to help manage sales pipelines, contacts, companies, and deals in a simple and intuitive way.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

- **Count** – Count records for a selected module
- **Create** – Create a new record
- **Delete** – Delete an existing record
- **Get** – Retrieve a single record by ID
- **Get All** – Retrieve all records from a module
- **Get Many** – Retrieve multiple records matching filters
- **Get Fields** – Retrieve field metadata for a module
- **Get Module Deals** – Retrieve deals related to a specific module
- **Get Module Calls** – Retrieve calls related to a specific module
- **Get Picklist Values** – Retrieve available picklist values for a field
- **Get Pipelines** – Retrieve pipelines
- **Get Stages** – Retrieve stages for a sub-pipeline
- **Get Sub-Pipelines** – Retrieve sub-pipelines
- **Update** – Update all fields of an existing record
- **Patch** – Update specific fields update an existing record
- **Upsert** – Create or update a record based on a unique field

Some write operations support two input modes:

- **Single Record** – Create, update, or upsert one record at a time
- **Multi Record (Batch)** – Create, update, or upsert multiple records in a single operation

## Credentials

To use this node, you need to configure OAuth2 authentication with Zoho.

1. Log in to the [Zoho API Console](https://api-console.zoho.com/).
2. Click **Add Client** and choose **Server-based Applications**.
3. Enter the following details:
    - **Client Name**: A name for your integration (e.g., "n8n Bigin Integration").
    - **Homepage URL**: Your n8n instance URL (e.g., `https://n8n.example.com`).
    - **Authorized Redirect URIs**: Copy the "OAuth Redirect URL" provided in the n8n credential configuration window and paste it here.
4. Click **Create**.
5. Zoho will generate a **Client ID** and **Client Secret**.
6. In n8n, create a new **Bigin OAuth2 API** credential:
    - **Client ID**: Paste the Client ID from Zoho.
    - **Client Secret**: Paste the Client Secret from Zoho.
    - **Authorization URL**: Select the URL corresponding to your data center location (e.g., `.com` for by default, `.com.cn` for the CN domain).
    - **Access Token URL**: Select the matching URL for your region.
7. Click **Connect my account** to authorize n8n to access your Bigin data.

**Scopes:**
The node automatically requests the following scopes. These are set by default to ensure all operations function correctly and **cannot be changed**:

`ZohoBigin.notifications.ALL, ZohoBigin.modules.Pipelines.READ, ZohoBigin.settings.ALL, ZohoBigin.org.ALL, ZohoBigin.settings.roles.ALL, ZohoBigin.settings.profiles.ALL, ZohoBigin.users.ALL, ZohoBigin.modules.ALL, ZohoBigin.modules.attachments.ALL, ZohoBigin.modules.Pipelines.ALL, ZohoBigin.modules.Contacts.ALL, ZohoBigin.modules.Accounts.ALL, ZohoBigin.modules.Products.ALL, ZohoBigin.modules.Tasks.ALL, ZohoBigin.modules.Events.ALL, ZohoBigin.modules.Calls.ALL, ZohoBigin.coql.READ`

## Compatibility

- **Minimum tested n8n version:** 1.112.4  
- **Stable with n8n version:** 1.122.5  
- **Zoho Bigin API version:** v2  

This node is designed to work with Zoho Bigin API v2. No known version incompatibilities have been observed, but using older n8n versions than 1.112.4 may lead to unexpected behaviour and security issues with n8n.

## Usage

Supports all core modules (**Contacts**, **Companies**,**Pipelines**, **Calls**, **Products**, **Events**,**Tasks**)

### Filtering Records (Get Many)

The **Get Many** operation uses Zoho's COQL (Composite Query Language) under the hood.

- You can add multiple **Conditions** in the "Filter (WHERE)" section.
- Supports logic operators (`AND`, `OR`) and field operators (`equals`, `like`, `in`, `starts with`, `between`, etc.).
- **Sort**: You can specify multiple fields to sort by (Ascending or Descending).

### Creating and Updating Records

When using **Create**, **Update**, **Patch**, or **Upsert**:

1. **Columns**: The node automatically fetches available fields from your Bigin account. They handle custom fields dynamically too and show when they are required.

2. **Input Mode**:

    - **Single Record**: Use the mappers to set values for one record.
    - **Multi Record**: Toggle this if you want to process a batch of records. You will need to provide a **Records List (JSON)** array containing the data. The values selected in Columns will be applied to every item of the batch.
3. **Multi Select Fields**: For fields like Multi-Select Picklists, use the "Multi Select Fields" collection to explicitly define values.

### Locating Records (Get, Update, Delete)

When an operation requires a **Record ID** (e.g., Get, Delete, Update), you can provide:

- **ID**: The specific Bigin Record ID (e.g., `1234567890`).
- **URL**: You can paste the full URL of the record from your browser (e.g., `https://bigin.zoho.eu/bigin/org.../contacts/123...`). The node will extract the ID automatically.
- **List**: Use the search dropdown to find a record by name dynamically.

### Working with Pipelines

When creating Deals (Pipelines resource):

- You may need to select a **Sub Pipeline**.
- The **Stage** field is dependent on the selected Sub Pipeline. Ensure the Stage you map matches the allowed stages for that specific sub pipeline configuration. All the stages will be available and the correct ones will be shown after execution.

### Limitations

Due to n8n limitations there are some limitations on loading values dynamically from Zoho Bigin.

- **Multi Select Picklist**: In the Create, Upsert,Patch and Update operations you will have the possibility of adding multiple values for a single field. It is not available in the "Columns" mapper, only Picklist.
- **Loading Values based on a previous Picklist Value**: Only create elements of a list one at a time in **Get Many filter** and **Multi Select Picklist**. The values loaded are based on the last field in the list.


## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Zoho Bigin api documentation](https://www.bigin.com/developer/docs/apis/v2/)

## Version history

- **0.1.0**: Initial Release using Zoho Bigin API v2. Supports all core modules and COQL filtering.

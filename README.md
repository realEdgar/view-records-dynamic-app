# Salesforce DX Project:
## Retrieve Salesforce Records Dynamically from the Salesforce UI

### Build 1
- Build UI structure and define where will be used:
    - Create an LWC: **retrieveRecordsApp**
        - build two sides:
            - left for the form to build the query
            - right for to show the results
        - The component might be in a lightning tab.
- Create a lightning component tab.
    - Name: Query Application.
    - Include **retrieveRecordsApp** component.
    - Tab can be included in any application. (App not included in the commit)

### Build 2
- Add a `<form>` with 4 inputs and a submit button
    - inputs have the following names:
        - `fields` - lightning-textarea
        - `SObjectApiName` - lightning-input
        - `filters` - lightning-input
        - `noRecords` - lightning-input
    - Add the same names as fields on the JS file.
    - Add a method that manage changes on the input: `handleChange`.
        - store input changes on respective fields.
    - Add a submit button.
    - Add a method that manage submit on the `<form>`
        - prevent default behavior on submit event.
        - get the current field values and store in the `params` variable.

### Build 3
- Build the Apex Class:
    - Add a method to retrieve the records requested from the built query from the UI.
        - params:
            - String: `fields`
            - String: `SObjectApiName`
            - String: `filters`
            - Integer: `noRecords`
        - it does not need to validate `fields` or `SObjectApiName` because they are required from the UI.
        - build a dynamic query with the parameters passed
        - return:
            - a serialized list of records
            - if there is an error, return the error message
        - Test this functionalities by creating a test class:
            - positive scenarios
            - negative scenarios:
                - Error
                - Empty
- Update the LWC that uses the apex method.
    - add a new method that manage the response from the database.

### Build 4
- Display the error from the server
    - in the UI user should be able to see the error from the server which specifies the error in the query
    - if there is an error, and the user try again with the proper query, the error should be gone.
- Apply best practices:
    - Store possible statuses from server in a const out of the component

### Build 5
- Create a method that setup the configuration of the data request (string stored in the `fields` property):
    - Scenarios to cover:
        - fields from the main objects
        - subqueries
    - considere that all data will be displayed on tables:
        - main table, for the fields associated with the main object
        - ona table per requested related table.
    - Object example:
        `
            {
                fields: [], <string>
                subqueries: [], <object>:
                    { object, fields, whereClause, limitClause }
                objectName: '', string
            }
        `

### Build 6
- When Page is loaded show a message in the right side:
    - Message: "There are no data requested, please build a query to request some data."
- Display data from main object requested.
    - use lightning-datatable
        - use data retrieved from server
        - build columns from `configObject.fields`
            - build a method to process the fields, so then it can be used for subqueries fields.
        - Display conditions:
            - if there is data: display datatable
            - if there is no data show the following message: "There is no data from object `<Object Name>`"
    - include a header that show the main object Api Name and the records retrieved:
        - examples: "Account (2)" | "Custom_Object__c (5)"
TBD
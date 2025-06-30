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

TBD
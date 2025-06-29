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
        - `SObjectApiName` - lightning-textarea
        - `filters` - lightning-textarea
        - `noRecords` - lightning-textarea
    - Add the same names as fields on the JS file.
    - Add a method that manage changes on the input: `handleChange`.
        - store input changes on respective fields.
    - Add a submit button.
    - Add a method that manage submit on the `<form>`
        - prevent default behavior on submit event.
        - get the current field values and store in the `params` variable.
TBD
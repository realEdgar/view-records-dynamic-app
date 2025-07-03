import { LightningElement } from 'lwc';
import retrieveRecords from '@salesforce/apex/RetrieveRecordsAppController.retrieveRecords';

const SUCCESS_STATUS = 'SUCCESS';
const ERROR_STATUS = 'ERROR'

export default class RetrieveRecordsApp extends LightningElement {
    fields;
    SObjectApiName;
    filters;
    noRecords;
    isError = false;
    errorMessage;

    handleChange(event){
        const fieldName = event.target.name;
        this[fieldName] = event.detail.value;
    }

    handleQuerySubmit(event){
        event.preventDefault();
        const params = {
            fields: this.fields,
            SObjectApiName: this.SObjectApiName,
            filters: this.filters,
            noRecords: this.noRecords,
        }
        this.responseManager(params);
    }
    async responseManager(params){
        const response = await retrieveRecords(params);
        const result = JSON.parse(response);

        if(result.status === SUCCESS_STATUS){
            this.isError = false;
            this.errorMessage = '';
            console.log(JSON.stringify(result.data));
            // TBD: Manage success result
        } else if(result.status === ERROR_STATUS){
            this.isError = true;
            this.errorMessage = result.errorMessage;
        }
    }
}
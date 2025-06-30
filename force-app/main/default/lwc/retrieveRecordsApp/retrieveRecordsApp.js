import { LightningElement } from 'lwc';
import retrieveRecords from '@salesforce/apex/RetrieveRecordsAppController.retrieveRecords';

export default class RetrieveRecordsApp extends LightningElement {
    fields;
    SObjectApiName;
    filters;
    noRecords;

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

        if(result.status === 'SUCCESS'){
            const test = result.data[0];
            for(const key in test){
                console.log(key, test[key]);
            }
            // TBD: Manage success result
        } else if(result.status === 'ERROR'){
            console.log(result.errorMessage);
            // TBD: Manage error result
        }
    }
}
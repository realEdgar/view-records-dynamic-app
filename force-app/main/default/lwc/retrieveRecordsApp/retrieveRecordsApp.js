import { LightningElement } from 'lwc';

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
        // TBD - Submit query
    }
}
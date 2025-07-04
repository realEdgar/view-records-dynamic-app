import { LightningElement, track } from 'lwc';
import retrieveRecords from '@salesforce/apex/RetrieveRecordsAppController.retrieveRecords';
import { NavigationMixin } from 'lightning/navigation';

const SUCCESS_STATUS = 'SUCCESS';
const ERROR_STATUS = 'ERROR'

const ACTIONS = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];

export default class RetrieveRecordsApp extends NavigationMixin(LightningElement) {
    fields;
    SObjectApiName;
    filters;
    noRecords;
    isError = false;
    errorMessage;
    dataRequested;

    @track configObject;
    @track mainData = [];

    get mainDataCols(){
        return this.mapFields(this.configObject?.fields || []);
    }

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
        this.dataRequested = true;

        if(result.status === SUCCESS_STATUS){
            this.isError = false;
            this.errorMessage = '';
            this.configObject = this.buildConfigObject();
            this.mainData = result.data;
        } else if(result.status === ERROR_STATUS){
            this.isError = true;
            this.errorMessage = result.errorMessage;
            this.mainData = [];
            this.dataRequested = false;
        }
    }
    buildConfigObject(){
        const configObject = {
            fields: [],
            subqueries: [],
            objectName: ''
        }

        const cleanedQuery = this.fields.replace(/\s+/g, ' ').trim();

        const subqueryRegex = /\(\s*SELECT\s+([^)]+)\s+FROM\s+(\w+)\s*(?:WHERE\s+([^)]+?))?(?:\s*LIMIT\s+(\d+))?\s*\)/gi;

        let match;
        while((match = subqueryRegex.exec(cleanedQuery)) !== null){
            const subqueryFields = match[1].split(',').map(field => field.trim());
            const subqueryObject = match[2];
            const whereClause = match[3] ? match[3].trim() : null;
            const limitClause = match[4] ? parseInt(match[4], 10) : null;

            configObject.subqueries.push({
                object: subqueryObject,
                fields: subqueryFields,
                whereClause: whereClause,
                limit: limitClause
            });
        }

        let mainFieldsString = cleanedQuery;
        subqueryRegex.lastIndex = 0;
        mainFieldsString = mainFieldsString.replace(subqueryRegex, '').replace(/\s+/g, ' ').trim();

        const mainFields = mainFieldsString.split(',').map(field => field.trim());
        for(let field of mainFields){
            if(field) configObject.fields.push(field);
        }
        configObject.objectName = this.SObjectApiName;

        return configObject;
    }
    mapFields(fields){
        const actionsCol = { type: 'action', typeAttributes: { rowActions: ACTIONS, menuAlignment: 'auto' } }
        const tableCols = fields.map(field => {
            return {
                label: field,
                fieldName: field,
                wrapText: true
            }
        });
        return [...tableCols, actionsCol];
    }
    handleRowAction(event){
        const actionName = event.detail.action.name;
        const recordId = event.detail.row.Id;
        this.navigateToRecord(recordId, actionName);
    }
    navigateToRecord(recordId, actionName){
        const pageReference = {
            type: 'standard__recordPage',
            attributes: {
                recordId,
                actionName
            }
        }
        this[NavigationMixin.Navigate](pageReference);
    }
}
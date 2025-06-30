public with sharing class RetrieveRecordsAppController {
    @AuraEnabled
    public static String retrieveRecords(
        String fields,
        String SObjectApiName,
        String filters,
        Integer noRecords
    ){
        String result;
        String query = 'SELECT ' + fields + ' FROM ' + SObjectApiName;
        if(!String.isBlank(filters)) query += ' WHERE ' + filters;
        if(noRecords != null) query += ' LIMIT ' + noRecords;
        
        try {
            String data = JSON.serialize(Database.query(query));
            result = '{ "status": "SUCCESS", "data": ' + data + '}';
        } catch(Exception ex) {
            result =  '{ "status": "ERROR", "errorMessage": "' + ex.getMessage() + '"}';
        }
        return result;
    }
}
@IsTest
public with sharing class RetrieveRecordsAppControllerTest {
    @TestSetup
    static void generateData(){
        List<Account> accs = new List<Account>();
        List<Contact> cts = new List<Contact>();

        for(Integer i = 0; i < 5; i++){
            Account acc = new Account();
            acc.Name = 'Test' + i;
            acc.Type = 'New Prospect';
            acc.Website = 'https://www.test-' + i + '.com';
            accs.add(acc);
        }
        insert accs;

        for(Account acc : accs){
            for(Integer j = 0; j < 5; j++){
                Contact ct = new Contact(
                    AccountId = acc.Id,
                    FirstName = j + 'Test',
                    LastName = 'Test' + j,
                    Email = acc.Name + j + '@test-example.com',
                    Phone = '123456978' + j
                );
                cts.add(ct);
            }
        }

        insert cts;
    }
    @IsTest
    static void getRecordsPositiveTest(){
        // Simple Query
        String fields1 = 'ID, Name, Type';
        String sObj1 = 'Account';
        Map<String, Object> res1 = (Map<String, Object>) JSON.deserializeUntyped(RetrieveRecordsAppController.retrieveRecords(fields1, sObj1, null, null));
        List<Object> result1 = (List<Object>) res1.get('data');

        // query with filters and limits | parent reference
        String fields2 = 'ID, FirstName, LastName, Email, Phone, Account.Name, Account.Type';
        String sObj2 = 'Contact';
        String filters2 = 'Email != null';
        Integer noRecords2 = 10;
        Map<String, Object> res2 = (Map<String, Object>) JSON.deserializeUntyped(RetrieveRecordsAppController.retrieveRecords(fields2, sObj2, filters2, noRecords2));
        List<Object> result2 = (List<Object>) res2.get('data');
        
        // query related records
        String fields3 = 'ID, Name, Type, (SELECT Id, Name, Email, Phone FROM Contacts)';
        String sObj3 = 'Account';
        Map<String, Object> res3 = (Map<String, Object>) JSON.deserializeUntyped(RetrieveRecordsAppController.retrieveRecords(fields3, sObj3, null, null));
        List<Object> result3 = (List<Object>) res3.get('data');

        Assert.areEqual(5, result1.size());
        Assert.areEqual(10, result2.size());
        Assert.areEqual(5, result3.size());
    }
    @IsTest
    static void getRecordsNegativeTestErrors(){
        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(RetrieveRecordsAppController.retrieveRecords('Test,', 'Account', null, null));
        Assert.areEqual('ERROR', (String) result.get('status'));
    }
    @IsTest
    static void getRecordsNegativeTestNoRecords(){
        String res = RetrieveRecordsAppController.retrieveRecords('Name', 'Account', 'Type = null', null);
        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res);
        List<Object> resList = (List<Object>) result.get('data');
        Assert.areEqual(0, resList.size());
    }
}
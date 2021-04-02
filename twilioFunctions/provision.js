//This function will iterate through Airtable records to determine a total record count. 
//Airtable does not provide a metadata API that provides a total record count of the table. 
//The record count will be used to divide the customers into studio flow executions. 
//After the count is complete the readExecute2 function will be called to begin studio flow execution. 


exports.handler = function (context, event, callback) {
    const airtable = require("airtable");
    const twilio = require("twilio");
    var client = context.getTwilioClient();
    //Creating initial index value to iterate through airtable. 
    var indexValue = 0;
    
    //Creating new airtable object. 
    const base = new airtable({
       apiKey: context.AIR_TABLE_API_KEY,
     }).base(context.AIRTABLE_BASE_ID);
    var got = require('got');
    
    
    //Record selection will begin from Airtable. 
    base('Customers').select({
        view: "Grid view",
        
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
           // counting each record. 
            indexValue += 1;
        });
        //Iterates through the next "Page" of results. 
        fetchNextPage();
        
    }, function done(err) {
        //Once completed, the total num ber of records is written to the "count" environment variable. 
         client.serverless.services('ZS6e2703a423143cd37b62fe11150d749d')
                     .environments('ZE3d5ac3e3fe0b73c218d17241832d911b')
                     .variables('ZV5309023363e548c1fa0fd01d2ef87c54')
                     .update({value: String(indexValue)})
                     .then(variable => { 
                      console.log('done');
                      //ReadExecute2 is called to begin studio flow executions. 
                        got.post('https://buildchallengeplaceholder-6271.twil.io/readExecute2?indexValue=0')
                       .then(function(response) {
                          console.log(response.body);
                          //Complete function once response is received. 
                          callback(null, response.body);
    
    });})}); };
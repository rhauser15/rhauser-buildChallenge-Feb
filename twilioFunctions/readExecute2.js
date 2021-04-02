//This function begins the execution of studio flows. 
//For testing purposes, 1 studio flow will be executed per Function Execution. 
//This can be modified for up to 100 for larger databases. This puts us close to the API concurrency limit of 100. 
//This function will call itself again for each iteration until the entire database has been completed. 
//Users with a "false" for "customerCompleted" will not be included in a studio flow execution. This indicates they have already completed the survey. 

exports.handler = function (context, event, callback) {
    //Same variable/constant initiation as provision. 
    const airtable = require("airtable");
    const twilio = require("twilio");
    var client = context.getTwilioClient()
    var indexValue = parseInt(event.indexValue);
    
    const base = new airtable({
       apiKey: context.AIR_TABLE_API_KEY,
     }).base(context.AIRTABLE_BASE_ID);
    var got = require('got');
    //Introduces a formula to filter through records on the airtable side. Airtable does not natively allow for sequential retrieval of records. 
    var formulaAirtable = "{rowNum} > " + indexValue;
    //This ensures that function does not execute if the indexValue is larger than the total database size. 
    if (indexValue > context.count) {
      callback();
    }
     
    base('Customers').select({
        view: "Grid view",
        //Amount of studio executions per function should be adjusted by both values below: 
        maxRecords: 1,
        pageSize: 1,
        //filter out customers already counted in previous iterations. 
        filterByFormula: formulaAirtable
        
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
         records.forEach(function(record) {
           //For each record, a studio flow is initiated with database information. 
            console.log('Retrieved', record.get('firstName'));
            //Customers who have already completed the survey will not warrant an additional studio execution. 
           // if (record.get('customerCompleted')==false){
            client.studio.v1.flows('FW602957d7d5347e4477f15800641ea775')
                    .executions
                    .create({parameters: {
                        name: record.get('firstName'),
                        id: record.id, 
                     }, to: record.get('Phone'), from: '+12093261525'})
                    .then(execution => {console.log(execution.sid);
                    fetchNextPage();
                    }).catch(function(error) {
      callback(error);
    });//}
    
    //fetchNextPage(); Uncomment if moving forward on the "customerCompleted" check. 
        });
          
    
       
      
    
    }, function done(err) {
      //This calls the function again, but increases the index. This could in theory handle an unlimited amount of    
      //customer data entries. This value will need to be increased to same value of maxRecords and pageSize. (Limit should be around 100)
        indexValue += 1;
        if (indexValue <= context.count){
        got.post('https://buildchallengeplaceholder-6271.twil.io/readExecute2?indexValue=' + String(indexValue))
        .then(function(response) {
         callback();
    }).catch(function(error) {
      callback();
    });
        }
      else {  console.log(indexValue);
        console.log('done');
        callback();}
    });};
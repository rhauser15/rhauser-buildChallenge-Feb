//This function writes the data gathered from studio back to airtable. 

const airtable = require("airtable");
const twilio = require("twilio");

exports.handler = function (context, event, callback) {
 const base = new airtable({
   apiKey: context.AIR_TABLE_API_KEY,
 }).base(context.AIRTABLE_BASE_ID);
 var value = event.value;
 const columnName = event.columnName;
 console.log(columnName);
 const id = event.id;
 
 //Setting to integer for appropriate columns
 if (columnName == "q1_overallExperience" || columnName == "q3_agentExperience") {
   value = parseInt(value, 10);
}


//Link data in airtable to the Aggregated Table. This will allow for Airtable to add completed survey data to the averages. 
if (columnName == "customerCompleted") {
  console.log('activated');
  var base2 = new airtable({
   apiKey: context.AIR_TABLE_API_KEY,
 }).base(context.AGGREGATED_BASE_ID);
 var updatedRecords
                
  base2('Aggregated Data').find('recXSwb73H3MjwOwc', function(err, record) {
      if (err) { console.log(err); return; }
      console.log('Retrieved', record.get('customer_Records'));
      updatedRecords = record.get('customer_Records');
      updatedRecords.push(id);
      console.log('updated records', updatedRecords);
      
      //Push previous recoreds with addition of new record
      
      base2('Aggregated Data').update([
    {
      "id": "recXSwb73H3MjwOwc",
      "fields": {
        "customer_Records": updatedRecords
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      console.log('success', record.get('customer_Records'));
    });
  });
  })


}

 
 console.log(event.id)
 console.log(id)
 
 //Updating customer database
 base('Customers').update([
  {
    "id": id,
    "fields": {
      [columnName] : value,
    }
  }

],
   function (error, records) {
     if (error) {
       console.error(error);
       callback(error);
       return;
     } else {
       callback(null, "Success!");
     }
   }
 );
};

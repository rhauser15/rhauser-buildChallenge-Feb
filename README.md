# Beyond Inc Growth Challenge

### You can view a currently deployed demo version here: https://BeyondInc.tk ###

Build Challenge Use Case: https://docs.google.com/document/d/1nH5MG0Smflswb2iWD_wbc0StpTcakgtWMXylB-u2sDA/edit

General workflow centered around a bulk-SMS survey sent to Beyond Inc's customers on a regular basis. 

##### Table of Contents  
[Overview](#overview)  
[Emphasis](#emphasis)  



This is a React Application hosted entirely on Twilio through the use of Twilio Serverless Service and integrating variety of other products including: Twilio Studio, Google Apps Script and Airtable. 

**You can view a currently deployed demo version here**: https://BeyondInc.tk

Please feel free to add your own number to the database for testing. 

**Video Demo**: xxx

## User Workflow

Beyond Inc users have the ability to access the React Frontend to:

    *Examine an overview of all operations including aggregated customer feedback. (Overview)
    *Verify customer data through linked Airtable database. (Customer Outreach -> Customer Data)
    *Manually add a customer to the database. (Customer Outreach -> Add Customer)
    *Manually Trigger Studio flow to execute customer survey (Customer Outreach -> Trigger Survey)

While users can manually add data, the idea is that the customer database will likely be populated by another service. (When customer completes transaction etc.)

The Studio flow is also scheduled to run at 12PM MST daily via Google Apps Script, but a manual run can also be triggered above. 

Once completed, survey data will automatically be populated into the airtable database and the aggreagated data overview will be updated. 


## Execution flow

   1. When the flow is executed manually or via a separate service, the /provision function will be activated. 
   2. The /provision function will then count the total number of records in the database. 
   3. Once finished /provision will call /readExecute2. This function will execute studio flows in batches. (Adjustable from 1 - 100 studio flows at a time). 
   4. /readExecute2 will continue calling itself until the entire database of users has been surveyed. Users that have not completed a survey should be skipped. 
   5. The studio flows will ask the users a combination of Free Form/numerically rated questions. Questions 2 and 4 will change slighly based on results given by initial responses.
   6. Response data will be written by calling the /write function when a user responds. If the entire survey is completed, the "customerCompleted" attribute of the database will be set to "true". 


**Limits**: Twilio currently limits the API to 100 concurrent inbound calls. This is why the readExecute2 function is not recommended to be set past 100 records/executions. 

The Airtable API is also limited to 100 results per API call. This is why the provision function will only receive a "page" of 100 records at a time. 





## Asset Inventory

**React Application**: This is a single page react application from a modified a template which is referenced below. Functionality includes a consolidated survey results dashboard, visibility into complete customer database, ability to manually add new customers and also the ability to manually trigger the survey flow. 

**Studio Flow**: Twilio Studio provides the backend functionality of the SMS survey. (Folder: twilioStudio)

**Twilio Functions**: The functions incuded are responsible for executing the studio flows and also writing the survey results back to the customer data. (Folder: twilioFunctions)

**Google Apps Script**: Google Apps Script provides an automated trigger to execute the survey flow around at a time specified by the Admin. (Folder: googleAppsScript)

**Airtable**: Airtable serves as the backend database. You will need to use your own Airtable account for a custom implementation. 


## Prerequisites to Deploy

There is a real-timem video application twilio-cli plugin which I used to deploy the react portion of this application. Your application will likely deploy with a title along the lines of "Video-app-xx" in twilio functions, but this should not be a cause for concern. The application will still function correctly. The instructions below focus on the initial deployment of the React Application. 

1. You must have the following installed in order to deploy the application:

* [Node.js v12+](https://nodejs.org/en/download/)
* NPM v6+ (comes installed with newer Node versions)

2. A twilio account
3. An Airtable Account


## Install Dependencies

Run `npm install` to install all dependencies from NPM.

If you want to use `yarn` to install dependencies, first run the [yarn import](https://classic.yarnpkg.com/en/docs/cli/import/) command. This will ensure that yarn installs the package versions that are specified in `package-lock.json`.

## Install Twilio CLI

The app is deployed to Twilio using the Twilio CLI. Install twilio-cli with:

    $ npm install -g twilio-cli

Login to the Twilio CLI. You will be prompted for your Account SID and Auth Token, both of which you can find on the dashboard of your [Twilio console](https://twilio.com/console).

    $ twilio login

This app requires an additional plugin. Install the CLI plugin with:

    $ twilio plugins:install @twilio-labs/plugin-rtc

## Deploy the app to Twilio
Again, this plugin is originally intended to deploy a video application, but will work fine for our purposes. There may be an additional token/recording function in your deployment, but these will not affect the application's functionality. 

Before deploying the app, make sure you are using the correct account on the Twilio CLI (using the command `twilio profiles:list` to check). 
The app is deployed to Twilio with a single command:

    $ npm run deploy:twilio-cli

This performs the following steps:

* Builds the React app in the `src` directory
* Deploys the React app as a Twilio Serverless service.
* Prints the URL for the app.

Overrwrite existing deployment: 

    $ npm run deploy:twilio-cli -- --override


## A note on configuration

When this application is deployed, it will automatically populate with my own test customer database and reference my publicly available Twilio Functions. The only aspect a user may truly need to implement on their own is the Studio Flow. 


## Airtable configuration

The Airtable configuration is fairly simple on the React end. Only the iframe references in $src/pages/tables/Bootstrap.js need to be modified. Please see the following to receive your own iframe link:

https://support.airtable.com/hc/en-us/articles/217846478-Embedding-a-view-or-base

A customized form will also need to be created and shared for the "Add Customer" functionality:

https://support.airtable.com/hc/en-us/articles/206058268-How-to-use-Airtable-forms

You can modify this path in $src/pages/tables/addCustomer.js. 

## Studio Flow

Please see this guide for importing flows into Studio: https://www.twilio.com/docs/studio/user-guide#importing-and-exporting-flows


## Functions

Now that the React application has completed the initial deployment, we need to implement some additional functions surrounding read/execution/write. Please ensure the Provision function is public on Twilio Functions. 

Each of the included files should be copy/pasted into a twilio functions service:
    *twilioFunctions/write.js
    *twilioFunctions/readExecute2.js
    *twilioFunctions/provision.js

Once implemented in Functions, you will need to change the URL references in:
    *provision.js --> Point towards new URL for readExecute2
    *readExecute2.js --> point towards new URL for readExecute2
    *src/pages/triggerFunction --> point form submission link towards URL for Provision hosted in twilio. 


## Google Apps Script

Implementing the Google Apps Script Trigger is fairly simple and the instructions are included in the $googleAppsScript/googleAppsScriptTrigger file. 


## Sources

I read/borrowed from the following  sources/repos for this idea:

Free React Template: https://themesberg.com/product/dashboard/volt-react

Build Single-Page Apps with React and Twilio functions: https://www.twilio.com/blog/single-page-apps-react-twilio-functions

Twilio video React App Repo: https://github.com/twilio/twilio-video-app-react

Build a custom video chat app with React.js and Twilio: https://www.twilio.com/blog/build-a-custom-video-chat-app-with-react-and-twilio-programmable-video


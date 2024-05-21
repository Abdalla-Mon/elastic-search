# Elastic Search Application Modification Guide

This guide will walk you through the steps to modify the Elastic Search application in your project.

## Step 1: Create an Index (If you don't have one)

Before you can modify the Elastic Search application, you need to create an index unless u already have an index. This can be done either through backend integration or using the Elasticsearch dashboard.

### Using the Dashboard

1. Go to your Elasticsearch dashboard.
2. Navigate to `Search > Search Applications`.
3. Click on `Create`.
4. Select the Elasticsearch indices you want to use for your search application.
5. Name your search application.
6. Click on `Create`.

You have now created your index.

## Step 2: Modify the Project

After creating the index, navigate to the project folder and open the `filterFields.js` file located in `src/app`. This file contains several fields that you can modify as per your requirements.

### indexName

This is where you specify the name of the index you created in Step 1.

### FILTER_FIELDS

This array contains the filters that are shown in the UI. Each object in the array has two properties: `uiName` and `filterId`.

- `uiName`: This is the name that will be displayed in the UI. You can name it as per your preference.
- `filterId`: This should correspond to the key in your document. You can find this in the index mapping of your index. For example, if the field key is `application` and its type is `keyword`, you would write `application.keyword`.

### queryFields

This array contains the fields that the search operation will be performed on.

### titleFields and descriptionField

These fields should be the same as the `queryFields`. They are associated with what will be shown in the UI.

### displayFields

This array contains objects that specify what data to display in your card. Each object has three properties: `uiName`, `arrayOfData`, and `extra`.

- `uiName`: This is the name that will be displayed in the UI.
- `arrayOfData`: This should be the key of the data you want to display. The data must be an array.
- `extra`: This is optional. If you want to add extra text, you can specify it here.

For example, if you have `arrayOfData: "organisation_name"` and `extra: "country"`, the UI will display something like this:

```
Organizations University of California System, University of California, Los Angeles (UCLA) - country
```

That's it! You have now modified the Elastic Search application in your project.
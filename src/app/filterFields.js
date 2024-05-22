export const indexName = "search-sample-test-data";
export const FILTER_FIELDS = [
  {
    uiName: "Class C1",
    filterId: "class_C1.keyword",
  },
  {
    uiName: "Class C2",
    filterId: "class_C2.keyword",
  },
  {
    uiName: "types",
    filterId: "type.keyword",
  },
  {
    uiName: "organizations",
    filterId: "organisation_name.keyword",
  },
  {
    uiName: "countries",
    filterId: "country.keyword",
  },
  {
    uiName: "dates",
    filterId: "filter_date",
  },
];

export const queryFields = ["title", "text"];

export const titleFields = queryFields[0];
export const descriptionField = queryFields[1];
export const displayFields = [
  {
    arrayOfData: "organisation_name",
    extra: "country",
    uiName: "Organizations",
  },
  {
    arrayOfData: "class_C1",
    uiName: "Class C1",
  },
  {
    arrayOfData: "class_C2",
    uiName: "Class C2",
  },
];

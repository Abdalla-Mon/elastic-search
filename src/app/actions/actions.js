"use server";
import { Client } from "@elastic/elasticsearch";
import { FILTER_FIELDS, indexName, queryFields } from "@/app/filterFields";

const client = new Client({
  node: process.env.ELASTIC_NODE_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
});

function createTermsObject(fieldName, values) {
  return values.length ? [{ terms: { [fieldName]: values } }] : [];
}

function createRangeObject(fieldName, values) {
  if (values.length) {
    const years = values.map((value) => new Date(value).getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return [
      {
        range: {
          [fieldName]: {
            gte: `${minYear}-01-01`,
            lte: `${maxYear}-12-31`,
          },
        },
      },
    ];
  } else {
    return [];
  }
}

export async function handleSearch(q, page = 1, size = 2, ...selectedFilters) {
  const mustQuery = [
    q === ""
      ? { match_all: {} }
      : {
          multi_match: {
            query: q,
            type: "best_fields",
            fields: queryFields,
            operator: "or",
            // fuzziness: "AUTO"
          },
        },
  ];

  const filterMust = FILTER_FIELDS.flatMap((field, index) =>
    field.uiName === "dates"
      ? createRangeObject(field.filterId, selectedFilters[index])
      : createTermsObject(field.filterId, selectedFilters[index]),
  );

  const aggs = FILTER_FIELDS.reduce((acc, field) => {
    acc[`unique_${field.uiName}`] =
      field.uiName === "dates"
        ? {
            date_histogram: {
              field: field.filterId,
              calendar_interval: "year",
              format: "yyyy",
            },
          }
        : {
            terms: {
              field: field.filterId,
            },
          };
    return acc;
  }, {});

  const elasticSearchParams = {
    index: indexName,
    size: size,
    from: page,
    body: {
      query: {
        bool: {
          must: mustQuery,
          filter: {
            bool: {
              must: filterMust,
            },
          },
        },
      },
      aggs: aggs,
    },
  };

  const response = await client.search(elasticSearchParams);
  const data = response;
  const documents = data.hits.hits.map((hit) => hit._source);
  const total = data.hits.total;
  const uniqueFilters = FILTER_FIELDS.reduce((acc, field) => {
    acc[
      `unique${field.uiName.charAt(0).toUpperCase() + field.uiName.slice(1)}`
    ] = data.aggregations[`unique_${field.uiName}`].buckets.map((bucket) => {
      if (field.uiName === "dates") {
        // Convert Unix timestamp to date
        return new Date(bucket.key).toISOString().split("T")[0];
      } else {
        return bucket.key;
      }
    });
    return acc;
  }, {});
  return {
    documents,
    total: total.value,
    ...uniqueFilters,
  };
}

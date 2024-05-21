"use server";
import { Client } from "@elastic/elasticsearch";
import { FILTER_FIELDS, indexName, queryFields } from "@/app/filterFields";
import {createRangeObject, createTermsObject} from "@/app/function/function";



const client = new Client({
    node: process.env.ELASTIC_NODE_URL,
    auth: {
        apiKey: process.env.ELASTIC_API_KEY,
    },
});


export async function handleFilterFetch(uiName,filterId, search,selectedFilters) {
    try {
        const mustQuery = [
            search === ""
                  ? { match_all: {} }
                  : {
                      multi_match: {
                          query: search,
                          type: "best_fields",
                          fields: queryFields,
                          operator: "or",
                      },
                  },
        ];


        const filterMust =FILTER_FIELDS.flatMap((field, index) =>
              field.uiName === "dates"
                    ? createRangeObject(field.filterId,selectedFilters[index])
                    : createTermsObject(field.filterId, field.filterId===filterId?[]: selectedFilters[index]),
        );

        const aggs = {
            [`unique_${uiName}`]: uiName === "dates"
                  ? {
                      date_histogram: {
                          field: filterId,
                          calendar_interval: "year",
                          format: "yyyy",
                      },
                  }
                  : {
                      terms: {
                          field: filterId,
                      },
                  },
        };

        let boolQuery = {
            must: mustQuery,
        };
        if (filterMust && filterMust.length > 0) {
            boolQuery.filter = {
                bool: {
                    must: filterMust,
                },
            };
        }

        const elasticSearchParams = {
            index: indexName,
            size: 0, // We don't need the documents, only the aggregations
            body: {
                query: {
                    bool: boolQuery,
                },
                aggs: aggs,
            },
        };

        const response = await client.search(elasticSearchParams);
        const data = response;
        if(!data){
            return [];
        }
        const uniqueFilter = data.aggregations[`unique_${uiName}`].buckets.map((bucket) => {
            if (uiName === "dates") {
                // Convert Unix timestamp to date
                return new Date(bucket.key).toISOString().split("T")[0];
            } else {
                return bucket.key;
            }
        });

        return uniqueFilter;
    } catch (error) {
        console.error(`Error fetching filter: ${error.message}`);
        throw error; // re-throw the error if you want it to propagate
    }
}
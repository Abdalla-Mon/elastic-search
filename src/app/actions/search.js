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
export async function handleSearch(q, page = 1, size = 2, selectedFilters) {
    const mustQuery = [
        q === ""
              ? { match_all: {} }
              : {
                  multi_match: {
                      query: q,
                      type: "best_fields",
                      fields: queryFields,
                      operator: "or",
                  },
              },
    ];
      selectedFilters= FILTER_FIELDS.map(
          (field) => selectedFilters[field.uiName],
    );

    const filterMust = FILTER_FIELDS.flatMap((field, index) =>
          field.uiName === "dates"
                ? createRangeObject(field.filterId, selectedFilters[index])
                : createTermsObject(field.filterId, selectedFilters[index]),
    );

    const aggs = {
        unique_organizations: {
            terms: {
                field: "organisation_name.keyword",
            },
        },
    };

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
    const uniqueOrganizations = data.aggregations.unique_organizations.buckets.map(
          (bucket) => bucket.key,
    );
    return {
        documents,
        total: total.value,
        uniqueOrganizations,
    };
}
"use server";
import { Client } from "@elastic/elasticsearch";
import {descriptionField, FILTER_FIELDS, indexName, queryFields} from "@/app/filterFields";
import {createRangeObject, createTermsObject} from "@/app/functions/functions";

const client = new Client({
    node: process.env.ELASTIC_NODE_URL,
    auth: {
        apiKey: process.env.ELASTIC_API_KEY,
    },
});
export async  function handleSearch(q, page = 1, size = 2, selectedFilters) {
    const mustQuery = [
        q === ""
              ? { match_all: {} }
              : {
                  multi_match: {
                      query: q,
                      type: "phrase_prefix",
                      fields: queryFields,
                      operator: "or"
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
                size: 100,
            },

        },

    };
    const elasticSearchParams = {
        index: indexName,
        size: size,
        from: (page - 1) * size,
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
            highlight: { // Add this block to your existing code
                fields: {
                    [descriptionField]: {
                        "number_of_fragments": 0 
                    }                },
                pre_tags: ["<span class='highlighted_text'>"], // The tags to use for the highlighted text.
                post_tags: ["</span>"]
            }

        },
    };

    const response = await client.search(elasticSearchParams);
    const data = response;

    const documents = data.hits.hits.map((hit) => {

        const text = hit.highlight && hit.highlight.text
              ? hit.highlight.text.join(' ')
              : hit._source.text;
        return {
            ...hit._source,
            text,
        };
    });
    const total = data.hits.total;
    const uniqueOrganizations = data.aggregations.unique_organizations.buckets.map(
          (bucket) => bucket.key,
    );
    return {
        documents,
        total: total.value,
        uniqueOrganizations,
        uniques:data.hits.hits
    };
}
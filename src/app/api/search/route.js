import { Client } from "@elastic/elasticsearch";

import {handleSearch} from "@/app/services/search";

const client = new Client({
  node: process.env.ELASTIC_NODE_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
});
export async function GET(request, { params }) {
  const nextParams= request.nextUrl.searchParams;
  const q=nextParams.get("q");
    const page=nextParams.get("page");
    const size=nextParams.get("size");
    const jsonFilters=nextParams.get("selectedFilters");
  const selectedFilters = JSON.parse(jsonFilters);
    const data = await handleSearch(q, page, size, selectedFilters);

  return Response.json(data);
}

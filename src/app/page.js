import {ElasticSearchProvider} from "@/app/contexts/ElasticSearchProvider";
import ElasticSearch from "@/app/components/ElasticSearch/ElasticSearch";


export default async function Home() {
    return(
          <ElasticSearchProvider>
              <ElasticSearch />
          </ElasticSearchProvider>
    )
}
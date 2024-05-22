import {Skeleton} from "@mui/material";
import {useContext, useState} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {ElasticCard} from "@/app/components/ElasticSearch/ElasticContent/ElasticCard";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ElasticContainer(){

    let {data, loading} = useContext(ElasticSearchContext)
        const [endIndex, setEndIndex] = useState(2);

    if(loading){
        return (
              [1,2,3,4].map((item, index) => (
                    <Skeleton key={index} variant="rectangular"  height={600}  className={"max-w-full mx-auto my-5"} />
              ))
        )
    }

    if(!data||data.length==0){
        return <p>No data</p>
    }
    if(data.documents.length === 0){
        return <p>No data matched the result</p>
    }
    data = data.documents;
    const loadMoreItems = () => {
        setEndIndex((prevEndIndex) => prevEndIndex + 2); // Load 2
    };
    return (
          <InfiniteScroll
                dataLength={endIndex}
                next={loadMoreItems}
                hasMore={endIndex < data?.length}
                loader={<h4>Loading...</h4>}
          >
              <div  className={" py-5 flex flex-col gap-5"}>
                  {data?.slice(0, endIndex).map((item, index) => {
                      return (
                            <ElasticCard data={item} key={index} />
                      );
                  })}
              </div>
          </InfiniteScroll>
    )
}
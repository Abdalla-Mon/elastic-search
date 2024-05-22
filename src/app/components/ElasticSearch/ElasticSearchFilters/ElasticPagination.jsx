import {Pagination} from "@mui/material";
import {useContext, useEffect} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";

export default function ElasticPagination(){
    const { page, setPage, size,data}=useContext(ElasticSearchContext)
    useEffect(()=>{
        if(data?.documents?.length===0&&data?.total){
            setPage(1)
        }
    },[data?.documents?.length,data?.total])
    if(!data){
        return null;
    }
    const handleChange = (event, value) => {
        setPage(value)
    };
    const {total}=data
    const count = Math.ceil(total/size)
    if(!count){
        return null
    }
    return <Pagination count={count} color="primary" page={+page} onChange={handleChange} className={"mx-auto w-fit my-5"} />
}

import {Pagination} from "@mui/material";
import {useContext} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";

export default function ElasticPagination(){
    const { page, setPage, size,data}=useContext(ElasticSearchContext)
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

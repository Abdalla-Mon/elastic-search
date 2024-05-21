import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {useContext} from "react";

export default function ElasticSizeOfItemsPerPage(){
    const {size,setSize}=useContext(ElasticSearchContext);

    function handleChange(e){
        setSize(e.target.value)
    }
    return(
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} className={"ml-auto flex w-fit"}>
              <InputLabel id="demo-simple-select-standard-label">Items per page</InputLabel>
              <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={size}
                    onChange={handleChange}
                    label="Item per page"
              >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>30</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
              </Select>
          </FormControl>
    )
}

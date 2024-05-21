import {useContext, useEffect, useRef, useState} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {Autocomplete, Chip, TextField} from "@mui/material";
import {handleFilterFetch} from "@/app/actions/filter";
import {FILTER_FIELDS} from "@/app/filterFields";
import {handleFilterFetch2} from "@/app/actions/filterArrgsAlso";


export function AutoCompleteInput({field,id="autocomplete",label}){
    const {selectedFilters,setSelectedFilters,search}=useContext(ElasticSearchContext)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef=useRef()
    const [currentData,setCurrentData]=useState([])
    useEffect(()=>{
        const isNewFilter = JSON.stringify(selectedFilters[field.uiName]) !== JSON.stringify(currentData);
        if(isNewFilter) {
            window.setTimeout(() => {
            setSelectedFilters((prevFilters) => ({
                ...prevFilters,
                [field.uiName]: currentData,
            }));
            }, 150);
        }

    },[currentData])
   async function getData(){
        setLoading(true)
       const filterArgs = FILTER_FIELDS.map(
             (field) => selectedFilters[field.uiName],
       );
        const fetchedData=await handleFilterFetch2(field.uiName,field.filterId,search,filterArgs)
        setData(fetchedData)
        setLoading(false)
    }
    async function handleChange(event,value){
        if(value.length===0){
            setCurrentData([])
            window.setTimeout(() => {
                inputRef.current.blur();
            }, 50);

        }else{
        setCurrentData(value)
        }
    }


    return(
          <Autocomplete
                onChange={(event, value) => handleChange(event, value)}
                multiple={id !== "filter_date"}
                id={id}
                value={currentData}
                options={data}
                loading={loading}
                onFocus={getData}
                blurOnSelect={true}
                renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                          const { key, ...otherProps } = getTagProps({ index });
                          return (
                                <Chip
                                      key={key}
                                      variant="contained"
                                      label={option}
                                      {...otherProps}
                                />
                          );
                      })
                }
                renderInput={(params) => (
                      <TextField
                            {...params}
                            inputRef={inputRef}
                            label={label}
                            variant="filled"
                            className="w-full"
                      />
                )}
          />
    );
}
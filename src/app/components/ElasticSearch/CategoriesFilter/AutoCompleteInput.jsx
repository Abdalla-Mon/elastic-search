import {useContext, useEffect, useRef, useState} from "react";
import {ElasticSearchContext} from "@/app/contexts/ElasticSearchContext";
import {Autocomplete, Chip, TextField} from "@mui/material";
import {FILTER_FIELDS} from "@/app/filterFields";
import {getFiltersFilteredByArrgs} from "@/app/services/getFiltersFilteredByArrgs";


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
    useEffect(()=>{
        const newData=currentData.filter((item)=>data.includes(item))
        if(newData.length!==currentData.length){
            setCurrentData(newData)
        }
    },[data])
   async function getData(){
        setLoading(true)
       const filterArgs = FILTER_FIELDS.map(
             (field) => selectedFilters[field.uiName],
       );
        const fetchedData=await getFiltersFilteredByArrgs(field.uiName,field.filterId,search,filterArgs)
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
                value={currentData.filter((item)=>data.includes(item))}
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
import { useState, useContext, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Chip } from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { handleSearch } from "@/app/actions/actions";
import { FILTER_FIELDS } from "@/app/filterFields";
import {AutoCompleteInput} from "@/app/components/ElasticSearch/CategoriesFilter/NewCategoriesFilter";

export function CategoriesFilter() {

  return (
    <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
      {FILTER_FIELDS.map((field)=>{
        return(
              <AutoCompleteInput  key={`${field.uiName}-select`}  label={field.uiName.charAt(0).toUpperCase() + field.uiName.slice(1)} field={field}  id={`${field.uiName}-select`}/>
        )
      })}
    </div>
  );
}

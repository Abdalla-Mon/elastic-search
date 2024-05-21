import { useState, useContext, useEffect } from "react";

import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { FILTER_FIELDS } from "@/app/filterFields";
import {AutoCompleteInput} from "@/app/components/ElasticSearch/CategoriesFilter/NewCategoriesFilter";
import {initialFilterState} from "@/app/contexts/ElasticSearchProvider";

export function CategoriesFilter() {

  return (
    <div className=" w-full flex flex-col gap-5 pt-8   border-r border-[#2f528f] p-5 ">
      {FILTER_FIELDS.map((field)=>{
        return(
              <AutoCompleteInput  key={`${field.uiName}-select`}  label={field.uiName.charAt(0).toUpperCase() + field.uiName.slice(1)} field={field}  id={`${field.uiName}-select`}/>
        )
      })}
<ClearAllFilters/>
    </div>
  );
}
function ClearAllFilters(){
  const {setSelectedFilters}=useContext(ElasticSearchContext);

function resetFilters(){
    setSelectedFilters(initialFilterState)
  const clearIcons=document.querySelectorAll("[data-testid=CloseIcon]")
  window.setTimeout(()=>{
    clearIcons.forEach((icon)=>{
        icon.parentElement.click()
    })
  },50)
}
  return(
    <div className="flex justify-center">
      <button onClick={()=>resetFilters()} className="bg-[#2f528f] text-white p-2 rounded-lg">Clear All Filters</button>
    </div>
  )
}
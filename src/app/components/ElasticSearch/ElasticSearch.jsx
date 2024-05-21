"use client";
import { useContext, useEffect, useState } from "react";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";

import ElasticSearchField from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticSearchField";
import ElasticSizeOfItemsPerPage from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticSizeOfItemsPerPage";
import ElasticContainer from "@/app/components/ElasticSearch/ElasticContent/ElasticContainer";
import ElasticPagination from "@/app/components/ElasticSearch/ElasticSearchFilters/ElasticPagination";
import { CategoriesFilter } from "@/app/components/ElasticSearch/CategoriesFilter/CategoriesFilter";
import {Box} from "@mui/material";

export default function ElasticSearch() {
  const { search, page, size, error, fetchData, selectedFilters, data } =
    useContext(ElasticSearchContext);


  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchData();
  }, [search, page, size, selectedFilters]);
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className={"bg-[#f5f5f5] min-h-screen"}>
      <div className={"container mx-auto px-5"}>
        <img className="pb-5" src="/logo.png" width="180"/>
        <div className={"searchBar py-3"}>
          <ElasticSearchField />
          <div
            className={
              "flex gap-5 flex-col sm:flex-row py-3 justify-between  p-2"
            }
          >
            <div className={"flex flex-col gap-5"}>
              <div className={"my-auto"}>
                <span className={"font-bold"}>Total items :</span>{" "}
                {data ? data.total : 0}
              </div>
              <div className={"my-auto"}>
                <span className={"font-bold"}>Organisation Count :</span>{" "}
                {data && data.uniqueOrganizations
                  ? data.uniqueOrganizations.length
                  : 0}
              </div>
            </div>
            <div className={"flex gap-5 justify-between"}>
              <div
                className="flex items-center gap-3 cursor-pointer p-5 w-fit md:hidden bg-gray-200 text-gray-700 rounded-2xl shadow transition-colors duration-200 hover:bg-gray-700 hover:text-gray-200"
                onClick={() => setShow(!show)}
              >
                Filters
              </div>
              <ElasticSizeOfItemsPerPage />
            </div>
          </div>

          <Box className={"md:hidden overflow-hidden"}
           sx={{
                transition: "height 0.5s",
                height: show ? "auto" : 0,
           }}
          >
            <CategoriesFilter />
          </Box>
          <div className={"flex gap-5"}>
            <div className={"max-w-[24%] w-full hidden md:block"}>
              <CategoriesFilter />
            </div>
            <div className={"flex-1"}>
              <ElasticContainer />
              <ElasticPagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

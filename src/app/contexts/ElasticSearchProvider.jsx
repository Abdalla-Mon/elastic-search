"use client"
import { useState } from "react";
import { ElasticSearchContext } from "./ElasticSearchContext";
import { handleSearch } from "@/app/actions/search";
import { FILTER_FIELDS } from "@/app/filterFields";

const initialFilterState = FILTER_FIELDS.reduce((acc, field) => {
    acc[field.uiName] = [];
    return acc;
}, {});

export const ElasticSearchProvider = ({ children }) => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(initialFilterState);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
const res=await fetch(`/api/search?q=${search}&page=${page}&size=${size}&selectedFilters=${JSON.stringify(selectedFilters)}`)
const data=await res.json()
            setData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
          <ElasticSearchContext.Provider
                value={{
                    search,
                    setSearch,
                    data,
                    setData,
                    loading,
                    setLoading,
                    page,
                    setPage,
                    size,
                    setSize,
                    error,
                    setError,
                    fetchData,
                    selectedFilters,
                    setSelectedFilters,
                }}
          >
              {children}
          </ElasticSearchContext.Provider>
    );
};
"use client"
import { useState } from "react";
import { ElasticSearchContext } from "./ElasticSearchContext";
import { FILTER_FIELDS } from "@/app/filterFields";

export const initialFilterState = FILTER_FIELDS.reduce((acc, field) => {
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
    const [endIndex, setEndIndex] = useState(2);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
const res=await fetch(`/api/search?q=${search}&page=${page}&size=${size}&selectedFilters=${JSON.stringify(selectedFilters)}`)
const data=await res.json()
            setEndIndex(2)
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
                    endIndex, setEndIndex
                }}
          >
              {children}
          </ElasticSearchContext.Provider>
    );
};
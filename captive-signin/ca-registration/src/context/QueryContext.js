import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const location = useLocation();
    const [queryParams, setQueryParams] = useState(() => {
        return {};
    });

    useEffect(() => {
        if (Object.keys(queryParams).length === 0) { 
            const searchParams = new URLSearchParams(location.search);
            const params = Object.fromEntries(searchParams.entries());
            if (Object.keys(params).length > 0) {
                setQueryParams(params);
            }
        }
    }, [location.search, queryParams]);

    return (
        <QueryContext.Provider value={queryParams}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQueryParams = () => useContext(QueryContext);
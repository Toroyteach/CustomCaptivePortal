import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const location = useLocation();
    const [queryParams, setQueryParams] = useState(() => {
        const storedParams = Cookies.get("queryParams");
        return storedParams ? JSON.parse(storedParams) : {};
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const params = Object.fromEntries(searchParams.entries());

        if (Object.keys(params).length > 0) {
            setQueryParams(params);
            Cookies.set("queryParams", JSON.stringify(params), { expires: 1 / 288 }); // 5 min expiry
        }
    }, [location.search]);

    return (
        <QueryContext.Provider value={queryParams}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQueryParams = () => useContext(QueryContext);
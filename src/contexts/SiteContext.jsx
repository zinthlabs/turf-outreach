import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SiteContext = createContext();

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error("useSiteContext must be used within a SiteProvider");
    }
    return context;
};

export const SiteProvider = ({ children }) => {
    const location = useLocation();
    const [siteName, setSiteName] = useState(() => {
        // Try to get from localStorage first
        const stored = localStorage.getItem("siteName");
        if (stored) return stored;

        // Otherwise use default
        return "Strikers Yard";
    });

    useEffect(() => {
        // Parse query parameters on mount
        const searchParams = new URLSearchParams(window.location.search);
        const nameFromQuery = searchParams.get("siteName");

        if (nameFromQuery) {
            setSiteName(nameFromQuery);
            localStorage.setItem("siteName", nameFromQuery);
        }
    }, []);

    useEffect(() => {
        // Update document title whenever siteName changes
        document.title = siteName;
    }, [siteName]);

    return (
        <SiteContext.Provider value={{ siteName, setSiteName }}>
            {children}
        </SiteContext.Provider>
    );
};

import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false); 

    return (
        <FilterContext.Provider value={{ isFilterOpen, setIsFilterOpen }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters debe ser usado dentro de un FilterProvider');
    }
    return context;
};
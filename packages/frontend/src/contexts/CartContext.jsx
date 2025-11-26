import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({children}) => {
    const [productosMap, setProductosMap] = useState(new Map());

    const productos = useMemo(() => {
        return Array.from(productosMap.values());
    }, [productosMap]);

    const vendedorCarrito = useMemo(() => {
        if (productos.length === 0) return null;
        return productos[0].vendedor;
    }, [productos]);


    const limpiarCarrito = () => setProductosMap(new Map());

    const aumentarCantidadProducto = (producto, cantidad = 1) => {
        adjustCantidadProducto(producto, cantidad);
    };

    const agregarProducto = aumentarCantidadProducto;

    const reducirCantidadProducto = (producto, cantidad = 1) => {
        adjustCantidadProducto(producto, -cantidad);
    }


    const eliminarProducto = (productoId) => {
        const productoMinimalista = { _id: productoId };
        setProductosMap(prevMap => updateMapEntry(prevMap, productoMinimalista, 0));
    };

    
    const setCantidadProducto = (producto, cantidad) => {
        setProductosMap(prevMap => updateMapEntry(prevMap, producto, cantidad));
    };


    const adjustCantidadProducto = (producto, variacion) => {
        setProductosMap(prevMap => {
            const entry = prevMap.get(producto._id);
            const cantidadActual = entry ? entry.cantidad : 0;
            const cantidadNueva = cantidadActual + variacion;

            return updateMapEntry(prevMap, producto, cantidadNueva);
        });
    }

    const value = {
        productos,
        vendedorCarrito,
        agregarProducto,
        aumentarCantidadProducto,
        reducirCantidadProducto,
        eliminarProducto,
        setCantidadProducto,
        limpiarCarrito
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}



const updateMapEntry = (prevMap, producto, cantidad) => {
    if (cantidad < 1) {
        const newMap = new Map(prevMap);
        newMap.delete(producto._id);
        return newMap;
    }

    const newMap = new Map(prevMap);
    const entry = newMap.get(producto._id);

    const newEntry = {
        ...(entry || producto),
        cantidad: cantidad
    };

    newMap.set(producto._id, newEntry);
    return newMap;
}
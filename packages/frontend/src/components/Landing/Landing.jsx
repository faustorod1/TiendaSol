import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../service/productoService';
import MainPicture from '../mainPage/MainPicture';
import ProductCarrousel from '../mainPage/ProductCarrousel';
import Shortcuts from '../mainPage/Shortcuts';

export default function Landing() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const searchParams = new URLSearchParams();
                searchParams.set('page', '1');
                searchParams.set('limit', '5');
                const result = await fetchProducts(searchParams);
                setProductos(result.data);
            } catch (err) {
                console.error("Error al traer productos:", err.message);
                setError(err.message);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    let carrouselContent;

    if (loading) {
        carrouselContent = <p>Cargando productos destacados...</p>;
    } else if (error) {
        carrouselContent = <p style={{ color: 'red' }}>Error al cargar productos: {error}</p>;
    } else if (productos.length === 0) {
         carrouselContent = <p>No hay productos disponibles.</p>;
    } else {
        carrouselContent = (
            <ProductCarrousel products={productos} autoPlay={true} autoPlayDelay={6000} />
        );
    }

    return (
        <div>
            <MainPicture />
            {carrouselContent}
            <Shortcuts />
        </div>
    )
}
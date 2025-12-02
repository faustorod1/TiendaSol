import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../service/productoService';
import { updateStock } from '../../service/productoService';
import ProductCard from '../AllProducts/ProductCard';
import './MyProducts.css';

const MyProducts = () => {
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [editingStock, setEditingStock] = useState({});
    const [tempStock, setTempStock] = useState({});

    const PRODUCTS_PER_PAGE = 12;

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('No se pudo obtener la información del usuario');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadMyProducts = async () => {
            if (!userId) return;

            setLoading(true);
            setError(null);

            try {
                const queryParams = new URLSearchParams(searchParams);
                queryParams.set('vendedor', userId);
                
                if (!queryParams.get('page')) {
                    queryParams.set('page', '1');
                }

                const result = await fetchProducts(queryParams);

                if (result && result.data) {
                    const productosData = result.data.productos || result.data || [];
                    const total = result.data.total || result.data.totalProductos || result.totalProducts || 0;
                    const pages = result.totalPages || Math.ceil(total / PRODUCTS_PER_PAGE) || 1;
                    const page = result.page || parseInt(queryParams.get('page')) || 1;

                    setProductos(productosData);
                    setTotalProducts(total);
                    setTotalPages(pages);
                    setCurrentPage(page);

                } else {
                    console.error('Error al cargar productos:', result?.error);
                    setError(result?.error || 'Error al cargar los productos');
                    setProductos([]);
                }
            } catch (err) {
                console.error('Error inesperado:', err);
                setError('Error inesperado al cargar los productos');
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        loadMyProducts();
    }, [searchParams, userId]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', newPage.toString());
        
        if (userId) {
            newSearchParams.set('vendedor', userId);
        }

        setSearchParams(newSearchParams);
    };

    const resetToFirstPage = () => {
        const newSearchParams = new URLSearchParams();
        newSearchParams.set('page', '1');
        if (userId) {
            newSearchParams.set('vendedor', userId);
        }
        setSearchParams(newSearchParams);
    };

    const handleEditStock = (productId, currentStock) => {
        setEditingStock(prev => ({ ...prev, [productId]: true }));
        setTempStock(prev => ({ ...prev, [productId]: currentStock }));
    };

    const handleCancelEdit = (productId) => {
        setEditingStock(prev => ({ ...prev, [productId]: false }));
        setTempStock(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
        });
    };

    const handleSaveStock = async (productId) => {
        const newStock = tempStock[productId];
        
        if (newStock === undefined || newStock === null) {
            alert('Por favor ingresa un valor válido');
            return;
        }
        
        const parsedStock = parseInt(newStock);
        
        if (isNaN(parsedStock) || parsedStock < 0) {
            alert('Por favor ingresa un número válido mayor o igual a 0');
            return;
        }
        
        await updateProductStock(productId, parsedStock);
        
        setEditingStock(prev => ({ ...prev, [productId]: false }));
        setTempStock(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
        });
    };

    const handleStockInputChange = (productId, value) => {
        setTempStock(prev => ({ ...prev, [productId]: value }));
    };

    const updateProductStock = async (productId, newStock) => {
        try {
            const result = await updateStock(productId, newStock);
            
            if (result.success) {
                setProductos(prevProductos => 
                    prevProductos.map(producto => 
                        (producto._id || producto.id) === productId 
                            ? { ...producto, stock: newStock }
                            : producto
                    )
                );
            } else {
                alert(`Error al actualizar stock: ${result.error}`);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            alert('Error inesperado al actualizar el stock');
        }
    };

    if (loading) {
        return (
            <div className="my-products-container">
                <div className="loading-section">
                    <p>Cargando tus productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-products-container">
                <div className="error-section">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-button"
                        onClick={resetToFirstPage}
                    >
                        Intentar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-products-container">
            <div className="my-products-header">
                <div className="title-and-create">
                    <h1>Mis Productos</h1>
                    <button className="create-product-button" onClick={() => navigate('/misProductos/crear-producto')}>
                        Cargar Nuevo Producto
                    </button>
                </div>
                <div className="products-count">
                    {productos.length === 0 
                        ? 'No tienes productos publicados' 
                        : totalProducts > 0
                            ? `Página ${currentPage} de ${totalPages} - ${totalProducts} producto${totalProducts === 1 ? '' : 's'} en total`
                            : `${productos.length} producto${productos.length === 1 ? '' : 's'} publicado${productos.length === 1 ? '' : 's'}`
                    }
                </div>
            </div>

            {productos.length === 0 ? (
                <div className="empty-products">
                    <h3>Aún no has publicado productos</h3>
                </div>
            ) : (
                <>
                    <div className="my-products-grid">
                        {productos.map(producto => (
                            <div key={producto._id || producto.id} className="product-card-wrapper">
                                <ProductCard 
                                    product={producto}
                                    showVendorInfo={false}
                                    disabled={false}
                                    parentComponent="misProductos"
                                />
                                <div className="product-sales-info">
                                    <span className="sales-count">
                                        Unidades vendidas: {producto.cantidadVendida || 0}
                                    </span>
                                    
                                    <div className="stock-management">
                                        {editingStock[producto._id || producto.id] ? (
                                            <div className="stock-edit-inline">
                                                <label className="stock-edit-label">Nuevo stock:</label>
                                                <div className="stock-edit-controls">
                                                    <input
                                                        type="number"
                                                        className="stock-edit-input"
                                                        value={tempStock[producto._id || producto.id] || ''}
                                                        onChange={(e) => handleStockInputChange(producto._id || producto.id, e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleSaveStock(producto._id || producto.id);
                                                            } else if (e.key === 'Escape') {
                                                                handleCancelEdit(producto._id || producto.id);
                                                            }
                                                        }}
                                                        min="0"
                                                        step="1"
                                                        autoFocus
                                                        placeholder="0"
                                                    />
                                                    <div className="stock-edit-buttons">
                                                        <button 
                                                            className="stock-save-button"
                                                            onClick={() => handleSaveStock(producto._id || producto.id)}
                                                            title="Guardar (Enter)"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button 
                                                            className="stock-cancel-button"
                                                            onClick={() => handleCancelEdit(producto._id || producto.id)}
                                                            title="Cancelar (Escape)"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className={`current-stock ${
                                                    producto.stock === 0 ? 'out-of-stock' : 
                                                    producto.stock < 5 ? 'low-stock' : ''
                                                }`}>
                                                    Stock: {producto.stock === 0 ? 'Agotado' : producto.stock}
                                                </span>
                                                <button 
                                                    className="edit-stock-button"
                                                    onClick={() => handleEditStock(producto._id || producto.id, producto.stock)}
                                                    title="Editar stock"
                                                >
                                                    Actualizar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && !error && totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Anterior
                            </button>
                            
                            <div className="pagination-info">
                                <span>Página {currentPage} de {totalPages}</span>
                                <small>({totalProducts} productos en total)</small>
                            </div>
                            
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyProducts;
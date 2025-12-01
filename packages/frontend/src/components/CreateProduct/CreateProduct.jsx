import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../service/productoService';
import { fetchCategorias } from '../../service/categoriaService';
import './CreateProduct.css';

const CreateProduct = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        moneda: 'PESO_ARG',
        stock: '',
        activo: true,
        fotos: [null, null, null], // Máximo 3 fotos
        categorias: [] // Sin límite de categorías
    });
    
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadCategorias = async () => {
          try {
            const result = await fetchCategorias();
            console.log(result);
            
            setCategoriasDisponibles(result.data);
            setLoadingCategorias(false);
            console.log('categorias cargadas');
          } catch (error) {
            
          }
        };
        loadCategorias();
      }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFotoChange = (index, value) => {
        setFormData(prev => {
            const newFotos = [...prev.fotos];
            newFotos[index] = value;
            return { ...prev, fotos: newFotos };
        });
    };

    const handleCategoriaToggle = (categoria) => {
        setFormData(prev => {
            const isSelected = prev.categorias.some(cat => cat._id === categoria._id);
            
            if (isSelected) {
                // Remover categoría
                return {
                    ...prev,
                    categorias: prev.categorias.filter(cat => cat._id !== categoria._id)
                };
            } else {
                return {
                    ...prev,
                    categorias: [...prev.categorias, categoria]
                };
            }
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        setFormData(prev => {
            const newFotos = [...prev.fotos];
            newFotos[index] = file || null;
            return { ...prev, fotos: newFotos };
        });
    };

    const validateForm = () => {
        if (!formData.titulo.trim()) {
            setError('El título es obligatorio');
            return false;
        }
        if (!formData.descripcion.trim()) {
            setError('La descripción es obligatoria');
            return false;
        }
        if (!formData.precio || parseFloat(formData.precio) <= 0) {
            setError('El precio debe ser mayor a 0');
            return false;
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            setError('El stock debe ser mayor o igual a 0');
            return false;
        }
        if (formData.categorias.length === 0) {
            setError('Debe seleccionar al menos una categoría');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            const data = new FormData();

            data.append('titulo', formData.titulo.trim());
            data.append('descripcion', formData.descripcion.trim());
            data.append('precio', formData.precio);
            data.append('moneda', formData.moneda);
            data.append('stock', formData.stock);
            data.append('activo', formData.activo);
            data.append('categorias', JSON.stringify(formData.categorias));

            formData.fotos.forEach((file) => {
                if (file) {
                    data.append('fotos', file); 
                }
            });

            const result = await createProduct(data);

            if (result.success) {
                setSuccess('¡Producto creado exitosamente!');
                setTimeout(() => { navigate('/misProductos'); }, 2000);
            } else {
                setError(result.error || 'Error al crear el producto');
            }
        } catch (error) {
            console.error(error);
            setError('Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategorias) {
        return (
            <div className="create-product-container">
                <div className="loading-section">
                    <p>Cargando formulario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-product-container">
            <div className="create-product-header">
                <h1>Cargar Nuevo Producto</h1>
            </div>

            <form className="create-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titulo">Título del Producto *</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        maxLength={200}
                        placeholder="Ingrese titulo del producto"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción *</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        maxLength={1000}
                        rows={4}
                        placeholder="Describe las características y beneficios del producto..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="precio">Precio *</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="moneda">Moneda *</label>
                        <select
                            id="moneda"
                            name="moneda"
                            value={formData.moneda}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="PESO_ARG">Peso Argentino</option>
                            <option value="DOLAR_USA">Dólar USA</option>
                            <option value="REAL">Real Brasileño</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="stock">Stock *</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="activo">Estado del Producto</label>
                        <select
                            id="activo"
                            name="activo"
                            value={formData.activo}
                            onChange={handleInputChange}
                        >
                            <option value={true}>Activo</option>
                            <option value={false}>Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Categorías *</label>
                    <div className="category-filter-create">
                        <div className="category-filter-list-create">
                            {categoriasDisponibles.length > 0 ? (
                                categoriasDisponibles.map(categoria => (
                                    <div
                                        key={categoria._id}
                                        className={`checkbox-item-create ${
                                            formData.categorias.some(cat => cat._id === categoria._id) 
                                                ? 'selected' : ''
                                        }`}
                                        onClick={() => handleCategoriaToggle(categoria)}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`cat-${categoria._id}`}
                                            checked={formData.categorias.some(cat => cat._id === categoria._id)}
                                            onChange={() => handleCategoriaToggle(categoria)}
                                        />
                                        <label htmlFor={`cat-${categoria._id}`}>
                                            {categoria.nombre}
                                        </label>
                                        {formData.categorias.some(cat => cat._id === categoria._id) && (
                                            <span className="check-icon">✓</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Cargando categorías...</p>
                            )}
                        </div>
                    </div>
                    <small className="help-text">
                        Seleccionadas: {formData.categorias.length}
                        {formData.categorias.length > 0 && (
                            <span className="selected-count">categoría{formData.categorias.length !== 1 ? 's' : ''}</span>
                        )}
                    </small>
                </div>

                <div className="form-group">
                    <label>Fotos del Producto (máximo 3)</label>
                    {formData.fotos.map((foto, index) => (
                        <div key={index} className="foto-input-group">
                            <label htmlFor={`foto-${index}`}>Foto {index + 1}</label>
                            <input
                                type="file"
                                    id={`foto-${index}`}
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(index, e)}
                            />
                            {foto && (
                                    <small className="file-name">
                                        Seleccionado: {foto.name}
                                    </small>
                            )}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="message error-message">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="message success-message">
                        {success}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/misProductos')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="button-spinner"></div>
                                Creando...
                            </>
                        ) : (
                            'Crear Producto'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
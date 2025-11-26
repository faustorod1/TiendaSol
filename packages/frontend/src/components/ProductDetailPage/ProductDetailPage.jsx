import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from '../../service/productoService.js';
import { getUserProfile } from '../../service/usuarioService.js';
import "./ProductDetailPage.css"
import { useCartContext } from '../../contexts/CartContext.jsx';

const ProductDetailPage = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [vendedor, setVendedor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { aumentarCantidadProducto, productos, vendedorCarrito } = useCartContext();

  // Obtener la cantidad del producto actual en el carrito
  const productInCart = productos.find(p => p._id === id);
  const cantidadEnCarrito = productInCart ? productInCart.cantidad : 0;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        const vendedorData = await getUserProfile(data.vendedor);
        setProduct(data);
        setVendedor(vendedorData.data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const disabled = vendedorCarrito && vendedorCarrito !== product.vendedor;

  // Función para comprar directamente
  const handleComprarAhora = () => {
    // Agregar el producto al carrito
    aumentarCantidadProducto(product);
    // Redirigir al checkout
    //navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-header">
          <h1>Cargando...</h1>
        </div>
      </div>
    );
  }

  if (!product||!vendedor) {
    return (
      <div className="product-detail-container">
        <div className="product-header">
          <h1>Producto no encontrado</h1>
          <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="product-detail-container">
        <div className="product-header">
        <h1 className="product-titulo">{product.titulo}</h1>
        <div className="product-categoria">
            {product.categorias?.map(cat => cat.nombre).join(" / ")}
        </div>
    </div>

        <div className="product-content">
        <div className="product-image-section">
            <img
            src={product.fotos[0]}
            alt={product.titulo}
            className="product-imagen"
            />
        </div>

        <div className="product-info-section">
            <div className="product-description">
            {product.descripcion}
            </div>

            <div className="product-price-section">
            <div className="product-precio">
                {product.moneda} ${product.precio?.toLocaleString()}
            </div>
            <div className="product-details">
                Stock disponible: {product.stock}
            </div>
            </div>

            <div className="product-vendedor-section">
            <div className="product-vendedor">
                Vendido por: {vendedor?.nombre ? `${vendedor.nombre}${vendedor.apellido ? ` ${vendedor.apellido}` : ''}` : vendedor.email}
            </div>
            <div className="product-email">
                Contacto: {vendedor.email}
            </div>
            </div>
        </div>
        </div>

        <div className="comprar-container">
          <div className="feedback-carrito">
            { disabled
                ? 'No puedes agregar al carrito este producto porque ya tienes uno de otro vendedor.'
                : cantidadEnCarrito > 0 
                  ? `Tienes ${cantidadEnCarrito} ejemplar${cantidadEnCarrito > 1 ? 'es' : ''} de este producto en tu carrito`
                  : 'Este producto no está en tu carrito'
            }
          </div>
          <button 
            className="agregar-carrito" 
            onClick={() => aumentarCantidadProducto(product)}
            disabled={ disabled }
          >
            Agregar a Carrito
          </button>
        </div>
    </div>
    );
}

export default ProductDetailPage

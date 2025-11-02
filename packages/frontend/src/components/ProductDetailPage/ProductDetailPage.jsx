import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import {Productos} from "../mockData/Productos.js";
import "./ProductDetailPage.css"

const ProductDetailPage = (props) => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  //const product = Productos.find(p => p.id === id);

  useEffect(() => {
    fetch(`http://localhost:8000/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener producto");
        return res.json();
      })
      .then(data => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-header">
          <h1>Cargando...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
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
                Vendido por: {product.vendedor.nombre}
            </div>
            <div className="product-email">
                Contacto: {product.vendedor.email}
            </div>
            </div>
        </div>
        </div>

        <div className="comprar-container">
        <button className="comprar">Comprar</button>
        </div>
    </div>
    );
}

export default ProductDetailPage

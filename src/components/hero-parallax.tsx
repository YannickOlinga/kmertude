"use client";
import type { Product } from "./types.js";
import "./hero-parallax.css";

export function HeroParallax({ products }: { products: Product[] }) {
  return (
    <div className="hero-parallax">
      <div className="hero-content">
        <h1 className="hero-title">Featured Products</h1>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img 
                src={product.thumbnail} 
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-title">{product.title}</h3>
              <a href={product.link} className="product-link" target="_blank" rel="noopener noreferrer">
                View Product
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

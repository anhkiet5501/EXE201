import React from 'react';
import useFetch from '../hooks/useFetch';
import { API_BASE_URL } from '../config/api';

const ProductList = () => {
  // Simulate fetching products by using /posts from jsonplaceholder
  const { data: products, loading, error } = useFetch(`${API_BASE_URL}/posts`);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Oops! Có lỗi xảy ra.</h3>
        <p>{error}</p>
      </div>
    );
  }

  // To not clutter the screen, slice first 9 items
  const displayProducts = products ? products.slice(0, 9) : [];

  return (
    <div className="product-list-container">
      <h2 className="title">Danh sách Sản phẩm (Demo)</h2>
      <div className="product-grid">
        {displayProducts.map((product) => (
          <div key={product.id} className="product-card glass-panel">
            <div className="product-image-placeholder">
              <span className="image-text">Image {product.id}</span>
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title.substring(0, 20)}...</h3>
              <p className="product-desc">{product.body.substring(0, 60)}...</p>
              <button className="btn-primary">Xem chi tiết</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

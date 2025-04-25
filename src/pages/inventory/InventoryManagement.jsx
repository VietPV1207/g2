import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [database, setDatabase] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9999/products')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const cleanedData = data.map(p => ({
          ...p,
          hasError: false,
          quantity: p.quantity ?? 0,
        }));

        fetch('http://localhost:9999/categories')
          .then((res2) => res2.json())
          .then((catData) => {
            const fullData = {
              products: cleanedData,
              categories: catData,
            };
            setDatabase(fullData);
            setProducts(cleanedData);
          });
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, []);

  if (error) return <div className="text-red-600 font-semibold p-4">Error: {error}</div>;
  if (!database) return <div className="text-gray-600 p-4">Loading products...</div>;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === '') {
      setProducts(products.map(product =>
        product.id === productId ? { ...product, quantity: '' } : product
      ));
      return;
    }

    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity >= 0) {
      setProducts(products.map(product =>
        product.id === productId ? { ...product, quantity } : product
      ));
    }
  };

  const handleSave = (product) => {
    if (product.quantity === '' || product.quantity === undefined || product.quantity === null) {
      alert(`Please enter quantity for "${product.title}"`);
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, hasError: true } : p
      ));
      return;
    }

    const quantity = parseInt(product.quantity);
    if (isNaN(quantity) || quantity < 0) {
      alert(`Invalid quantity for "${product.title}"`);
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, hasError: true } : p
      ));
      return;
    }

    const updatedProduct = {
      ...product,
      quantity: quantity,
    };

    fetch(`http://localhost:9999/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save');
        setProducts(products.map(p =>
          p.id === product.id ? { ...updatedProduct, hasError: false } : p
        ));
        alert(`Updated quantity for ${product.title} to ${updatedProduct.quantity}`);
      })
      .catch((err) => {
        console.error(err);
        alert('Error saving product');
      });
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`http://localhost:9999/products/${productId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to delete');
          setProducts(products.filter((p) => p.id !== productId));
        })
        .catch((err) => {
          console.error(err);
          alert('Error deleting product');
        });
    }
  };

  const filteredProducts = products.filter((product) =>
    product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      

      <h2 style={styles.title}>📦 Inventory Management</h2>

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {products.length === 0 ? (
        <p style={styles.noProduct}>No products available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Product ID', 'Title', 'Category', 'Price', 'Quantity', 'Actions'].map((th) => (
                  <th key={th} style={styles.th}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={styles.td}>{product.id}</td>
                  <td style={styles.td}>{product.title || 'N/A'}</td>
                  <td style={styles.td}>
                    {
                      database.categories?.find(
                        (cat) => cat.id.toString() === product.categoryId?.toString()
                      )?.name || 'No Category'
                    }
                  </td>
                  <td style={styles.td}>${(product.price ? product.price / 100 : 0).toFixed(2)}</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      style={{
                        ...styles.inputNumber,
                        borderColor: product.hasError ? '#ef4444' : '#d1d5db',
                      }}
                    />
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleSave(product)} style={styles.saveBtn}>
                      💾 Save
                    </button>
                    <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  backBtn: {
    marginBottom: '16px',
    backgroundColor: '#d1d5db',
    color: '#111827',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#111827',
  },
  searchInput: {
    padding: '10px',
    width: '300px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    marginBottom: '20px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  noProduct: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #e5e7eb',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  inputNumber: {
    width: '70px',
    padding: '6px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    textAlign: 'center',
    transition: 'border-color 0.3s ease',
  },
  saveBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    marginRight: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default InventoryManagement;

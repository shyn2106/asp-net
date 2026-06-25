import React, { useContext } from 'react';
import ProductCard from '../../components/ProductCard';
import { AppContext } from '../../context/AppContext';

function ProductList({ products }) {
    const { handleAddToCart } = useContext(AppContext);

    return (
        <div className="row g-4">
            {products.map(product => (
                <ProductCard 
                    key={product.id} 
                    item={product} 
                    isHot={false} 
                    onAddToCart={handleAddToCart} 
                />
            ))}
        </div>
    );
}

export default ProductList;

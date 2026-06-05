import React, { useEffect, useState } from "react";
import productService from "../services/productService";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Đang tải sản phẩm...</p>;
    }

    return (
        <div className="row">
            {products.map((item) => (
                <div className="col-md-6 mb-4" key={item.id}>
                    <div className="card h-100 shadow-sm">

                        <img
                            src={
                                item.imageUrl ||
                                "https://via.placeholder.com/400x250"
                            }
                            className="card-img-top"
                            alt={item.name}
                            style={{
                                height: "220px",
                                objectFit: "cover"
                            }}
                        />

                        <div className="card-body">
                            <h5 className="card-title">
                                {item.name}
                            </h5>

                            <p className="text-danger fw-bold">
                                {new Intl.NumberFormat(
                                    "vi-VN",
                                    {
                                        style: "currency",
                                        currency: "VND"
                                    }
                                ).format(item.price)}
                            </p>

                            <p className="text-muted">
                                Tồn kho: {item.stockQuantity}
                            </p>

                            <p className="small">
                                {item.description}
                            </p>
                        </div>

                        <div className="card-footer bg-white">
                            <button className="btn btn-primary w-100">
                                Xem chi tiết
                            </button>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
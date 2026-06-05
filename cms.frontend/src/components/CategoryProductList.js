import React, { useEffect, useState } from "react";
import categoryProductService from "../services/categoryProductService";

function CategoryProductList() {

    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const data =
                    await categoryProductService.getAllCategoryProducts();

                setCategoryProducts(data);

            } catch (error) {

                console.error(
                    "Lỗi tải danh mục:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, []);

    if (loading) {
        return (
            <div className="text-center">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="card shadow-sm">

            <div className="card-header">
                <h5>
                    <i className="fa-solid fa-list mr-2"></i>
                    Danh mục sản phẩm
                </h5>
            </div>

            <div className="list-group list-group-flush">

                {
                    categoryProducts.map(item => (

                        <div
                            key={item.id}
                            className="list-group-item"
                        >
                            <strong>{item.name}</strong>

                            <br />

                            <small>
                                {item.description}
                            </small>
                        </div>

                    ))
                }

            </div>

        </div>
    );
}

export default CategoryProductList;
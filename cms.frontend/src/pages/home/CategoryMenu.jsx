import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryMenu() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            setLoading(true);
            try {
                // Tương lai sẽ gọi categoryProductService.getAllCategoryProducts()
                setCategories([
                    { id: 1, name: "Laptop Gaming" },
                    { id: 2, name: "Điện thoại Flagship" },
                    { id: 3, name: "Tai nghe & Phụ kiện" }
                ]);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id) => {
        if (id !== null) {
            navigate(`/shop?categoryId=${id}`);
        } else {
            navigate('/shop');
        }
    };

    if (loading) {
        return (
            <div className="container my-3 text-center">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ms-2 text-white-50" style={{ fontSize: '14px' }}>Đang nạp danh mục...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="mb-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#151b2d', border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                <div className="card-body p-2 bg-transparent">
                    <ul className="nav nav-pills nav-fill flex-column flex-sm-row">
                        <li className="nav-item m-1">
                            <button
                                className="nav-link w-100 font-monospace fw-bold border-0 text-uppercase py-3 text-white-50 bg-transparent"
                                style={{
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    transition: '0.3s'
                                }}
                                onClick={() => handleCategoryClick(null)}
                            >
                                <i className="bi bi-grid-fill me-2"></i> Tất cả sản phẩm
                            </button>
                        </li>

                        {categories.map((cat) => (
                            <li className="nav-item m-1" key={cat.id}>
                                <button
                                    className="nav-link w-100 font-monospace fw-bold border-0 text-uppercase py-3 text-white-50 bg-transparent"
                                    style={{
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        transition: '0.3s'
                                    }}
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;

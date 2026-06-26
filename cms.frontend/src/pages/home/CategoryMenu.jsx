import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            setLoading(true);
            try {
                const response = await categoryProductService.getAllCategoryProducts();
                const data = response.data || response;
                // Lọc ra các danh mục hợp lệ
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data && Array.isArray(data.items)) {
                    setCategories(data.items);
                } else if (data && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    // Fallback nếu API lỗi
                    setCategories([
                        { id: 1, name: "Laptop Gaming" },
                        { id: 2, name: "Điện thoại Flagship" },
                        { id: 3, name: "Tai nghe & Phụ kiện" }
                    ]);
                }
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
                // Fallback tạm thời
                setCategories([
                    { id: 1, name: "Laptop Gaming" },
                    { id: 2, name: "Điện thoại Flagship" },
                    { id: 3, name: "Tai nghe & Phụ kiện" }
                ]);
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

    // Hàm ánh xạ hình ảnh dựa theo tên danh mục (Tech Store)
    const getCategoryImage = (name = "") => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("laptop") || lowerName.includes("máy tính")) {
            return "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300&auto=format&fit=crop";
        }
        if (lowerName.includes("điện thoại") || lowerName.includes("phone")) {
            return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop";
        }
        if (lowerName.includes("tai nghe") || lowerName.includes("audio")) {
            return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop";
        }
        if (lowerName.includes("chuột") || lowerName.includes("mouse")) {
            return "https://images.unsplash.com/photo-1527814050087-379381547969?q=80&w=300&auto=format&fit=crop";
        }
        if (lowerName.includes("bàn phím") || lowerName.includes("keyboard")) {
            return "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=300&auto=format&fit=crop";
        }
        if (lowerName.includes("màn hình") || lowerName.includes("monitor")) {
            return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop";
        }
        // Hình mặc định chung chung (linh kiện)
        return "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop";
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
            <div className="d-flex align-items-center mb-4">
                <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <span className="text-warning me-2">⚡</span> KHÁM PHÁ DANH MỤC
                </h3>
                <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(245, 158, 11, 0.5), transparent)" }}></div>
            </div>

            <div className="row g-4 justify-content-center">
                {/* Khối Tất cả sản phẩm */}
                <div className="col-6 col-md-3 col-lg-2">
                    <div 
                        className="card h-100 border-0 bg-transparent text-center" 
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handleCategoryClick(null)}
                        onMouseOver={(e) => {
                            e.currentTarget.querySelector('.cat-img-wrapper').style.transform = 'scale(1.05)';
                            e.currentTarget.querySelector('.cat-img-wrapper').style.boxShadow = '0 10px 20px rgba(6, 182, 212, 0.4)';
                            e.currentTarget.querySelector('h6').style.color = '#06b6d4';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.querySelector('.cat-img-wrapper').style.transform = 'scale(1)';
                            e.currentTarget.querySelector('.cat-img-wrapper').style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                            e.currentTarget.querySelector('h6').style.color = '#fff';
                        }}
                    >
                        <div 
                            className="cat-img-wrapper rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                            style={{ 
                                width: '100px', 
                                height: '100px', 
                                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            <i className="bi bi-grid-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="fw-bold text-white mb-0" style={{ transition: 'color 0.3s ease' }}>Tất Cả SP</h6>
                    </div>
                </div>

                {/* Các danh mục thực tế */}
                {categories.map((cat) => (
                    <div className="col-6 col-md-3 col-lg-2" key={cat.id}>
                        <div 
                            className="card h-100 border-0 bg-transparent text-center" 
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                            onClick={() => handleCategoryClick(cat.id)}
                            onMouseOver={(e) => {
                                e.currentTarget.querySelector('.cat-img-wrapper').style.transform = 'scale(1.05)';
                                e.currentTarget.querySelector('.cat-img-wrapper').style.boxShadow = '0 10px 20px rgba(168, 85, 247, 0.4)';
                                e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                                e.currentTarget.querySelector('h6').style.color = '#a855f7';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.querySelector('.cat-img-wrapper').style.transform = 'scale(1)';
                                e.currentTarget.querySelector('.cat-img-wrapper').style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                                e.currentTarget.querySelector('h6').style.color = '#fff';
                            }}
                        >
                            <div 
                                className="cat-img-wrapper rounded-circle mx-auto mb-3 overflow-hidden position-relative" 
                                style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    border: '3px solid rgba(168, 85, 247, 0.5)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}
                            >
                                <img 
                                    src={getCategoryImage(cat.name)} 
                                    alt={cat.name} 
                                    className="w-100 h-100 object-fit-cover"
                                    style={{ transition: 'transform 0.5s ease' }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(10, 15, 29, 0.2)' }}></div>
                            </div>
                            <h6 className="fw-bold text-white mb-0 text-truncate px-2" style={{ transition: 'color 0.3s ease' }} title={cat.name}>
                                {cat.name}
                            </h6>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategoryMenu;

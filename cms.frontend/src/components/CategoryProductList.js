import React, { useEffect, useState } from "react";
import categoryProductService from "../services/categoryProductService";

function CategoryProductList({ selectedCategoryId, onSelectCategory }) {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await categoryProductService.getAllCategoryProducts();
                if (data && data.items) {
                    data = data.items;
                } else if (!Array.isArray(data)) {
                    data = [];
                }
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ms-2 font-monospace text-muted small">SYSTEM CHECKING...</span>
            </div>
        );
    }

    return (
        <div className="card shadow-lg border-0 text-white" style={{ backgroundColor: "#151b2d", borderRadius: "18px" }}>
            <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0 text-white">
                    <i className="bi bi-grid-fill me-2 text-info"></i>
                    Danh Mục Sản Phẩm
                </h5>
                <hr className="border-secondary border-opacity-25 my-3" />
            </div>

            <div className="card-body px-3 pt-0 pb-4">
                <div className="d-flex flex-column gap-2">
                    {/* All Categories Option */}
                    <button
                        onClick={() => onSelectCategory(null)}
                        className="btn text-start w-100 px-3 py-2 border-0 d-flex justify-content-between align-items-center"
                        style={{
                            borderRadius: "10px",
                            backgroundColor: selectedCategoryId === null ? "rgba(6, 182, 212, 0.15)" : "transparent",
                            color: selectedCategoryId === null ? "#06b6d4" : "#cbd5e1",
                            fontWeight: selectedCategoryId === null ? "700" : "500",
                            transition: "all 0.2s ease-in-out"
                        }}
                        onMouseOver={(e) => {
                            if (selectedCategoryId !== null) {
                                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                                e.currentTarget.style.color = "#white";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedCategoryId !== null) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#cbd5e1";
                            }
                        }}
                    >
                        <span><i className="bi bi-box-seam me-2"></i>Tất Cả Sản Phẩm</span>
                        <i className={`bi bi-chevron-right small ${selectedCategoryId === null ? "visible" : "invisible"}`}></i>
                    </button>

                    {/* API Fetched Categories */}
                    {categoryProducts.map((item) => {
                        const isSelected = selectedCategoryId === item.id;
                        
                        // Map category name to icon
                        const getCategoryIcon = (name = "") => {
                            const n = name.toLowerCase();
                            if (n.includes("laptop")) return "bi-laptop";
                            if (n.includes("phone") || n.includes("thoại")) return "bi-phone";
                            return "bi-tag";
                        };

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelectCategory(item.id)}
                                className="btn text-start w-100 px-3 py-2 border-0 d-flex justify-content-between align-items-center"
                                style={{
                                    borderRadius: "10px",
                                    backgroundColor: isSelected ? "rgba(6, 182, 212, 0.15)" : "transparent",
                                    color: isSelected ? "#06b6d4" : "#cbd5e1",
                                    fontWeight: isSelected ? "700" : "500",
                                    transition: "all 0.2s ease-in-out"
                                }}
                                onMouseOver={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                                        e.currentTarget.style.color = "#white";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#cbd5e1";
                                    }
                                }}
                            >
                                <div>
                                    <i className={`bi ${getCategoryIcon(item.name)} me-2`}></i>
                                    <span>{item.name}</span>
                                    <div className="text-muted font-monospace" style={{ fontSize: "0.65rem", paddingLeft: "1.25rem" }}>
                                        {item.description}
                                    </div>
                                </div>
                                <i className={`bi bi-chevron-right small ${isSelected ? "visible" : "invisible"}`}></i>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CategoryProductList;
import React, { useState, useEffect } from "react";

function AdminFormModal({ type, item, categoriesList, onClose, onSave }) {
    const [formData, setFormData] = useState({});

    // Sync state when item changes
    useEffect(() => {
        if (item) {
            setFormData({ ...item });
        } else {
            // Initialize empty form fields based on type
            if (type === "product") {
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    stockQuantity: 10,
                    imageUrl: "",
                    categoryProductId: categoriesList.length > 0 ? categoriesList[0].id : ""
                });
            } else if (type === "category") {
                setFormData({
                    name: "",
                    description: ""
                });
            } else if (type === "post") {
                setFormData({
                    title: "",
                    content: "",
                    imageUrl: "",
                    categoryId: 1
                });
            } else if (type === "customer") {
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    password: ""
                });
            }
        }
    }, [item, type, categoriesList]);

    const handleChange = (e) => {
        const { name, value, type: inputType } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === "number" ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const getTitle = () => {
        const action = item ? "Cập Nhật" : "Thêm Mới";
        if (type === "product") return `${action} Sản Phẩm`;
        if (type === "category") return `${action} Danh Mục Sản Phẩm`;
        if (type === "post") return `${action} Bài Viết`;
        if (type === "customer") return `${action} Khách Hàng`;
        return `${action} Dữ Liệu`;
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(6px)", zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "18px" }}>
                    
                    <div className="modal-header border-0 pb-0 p-4 d-flex justify-content-between align-items-center">
                        <h5 className="modal-title fw-bold text-info">{getTitle()}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            
                            {/* PRODUCT FORM */}
                            {type === "product" && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Tên sản phẩm *</label>
                                        <input type="text" name="name" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.name || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Danh mục sản phẩm *</label>
                                        <select name="categoryProductId" className="form-select bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.categoryProductId || ""} onChange={handleChange}>
                                            {categoriesList.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted small">Giá bán (VND) *</label>
                                            <input type="number" name="price" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" min="0" required value={formData.price || 0} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted small">Số lượng kho *</label>
                                            <input type="number" name="stockQuantity" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" min="0" required value={formData.stockQuantity || 0} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Đường dẫn hình ảnh (URL)</label>
                                        <input type="text" name="imageUrl" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" placeholder="https://..." value={formData.imageUrl || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Mô tả sản phẩm</label>
                                        <textarea name="description" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" rows="3" value={formData.description || ""} onChange={handleChange}></textarea>
                                    </div>
                                </>
                            )}

                            {/* CATEGORY FORM */}
                            {type === "category" && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Tên danh mục *</label>
                                        <input type="text" name="name" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.name || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Mô tả danh mục</label>
                                        <textarea name="description" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" rows="3" value={formData.description || ""} onChange={handleChange}></textarea>
                                    </div>
                                </>
                            )}

                            {/* POST FORM */}
                            {type === "post" && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Tiêu đề bài viết *</label>
                                        <input type="text" name="title" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.title || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Mã danh mục bài viết (Số nguyên) *</label>
                                        <input type="number" name="categoryId" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.categoryId || 1} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Đường dẫn hình ảnh (URL)</label>
                                        <input type="text" name="imageUrl" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" placeholder="https://..." value={formData.imageUrl || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Nội dung chi tiết *</label>
                                        <textarea name="content" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" rows="4" required value={formData.content || ""} onChange={handleChange}></textarea>
                                    </div>
                                </>
                            )}

                            {/* CUSTOMER FORM */}
                            {type === "customer" && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Họ và tên khách hàng *</label>
                                        <input type="text" name="fullName" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.fullName || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Email *</label>
                                        <input type="email" name="email" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.email || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Số điện thoại *</label>
                                        <input type="tel" name="phone" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.phone || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Địa chỉ *</label>
                                        <input type="text" name="address" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.address || ""} onChange={handleChange} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Mật khẩu *</label>
                                        <input type="text" name="password" className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border" required value={formData.password || ""} onChange={handleChange} />
                                    </div>
                                </>
                            )}

                        </div>

                        <div className="modal-footer border-0 p-4 pt-0">
                            <button type="button" className="btn btn-outline-secondary px-4 rounded-pill text-white" onClick={onClose}>
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-cyber px-4 rounded-pill text-dark fw-bold">
                                Lưu lại
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default AdminFormModal;

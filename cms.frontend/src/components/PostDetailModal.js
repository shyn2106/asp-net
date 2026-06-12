import React from "react";

const PostDetailModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.9)", backdropFilter: "blur(8px)", zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "20px" }}>
                    
                    <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center p-4">
                        <button 
                            className="btn btn-outline-info rounded-pill px-4 font-monospace btn-sm" 
                            onClick={onClose}
                        >
                            <i className="bi bi-arrow-left me-2"></i> Đóng bài viết
                        </button>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-0">
                        <div className="position-relative">
                            <img
                                src={post.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"}
                                className="w-100"
                                alt={post.title}
                                style={{ height: "450px", objectFit: "cover" }}
                            />
                            {/* Gradient Overlay for better text readability if we wanted, but we put text below */}
                        </div>

                        <div className="p-5">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="badge bg-primary px-3 py-2 rounded-pill font-monospace">
                                    {post.categoryName || "G-ZONE NEWS"}
                                </span>
                                <span className="text-white-50 small">
                                    <i className="bi bi-calendar3 me-2"></i>
                                    {new Date(post.createdDate).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            
                            <h2 className="fw-black mb-4 text-neon-cyan" style={{ fontFamily: "Outfit, sans-serif" }}>
                                {post.title}
                            </h2>

                            <div 
                                className="fs-5 text-light article-content" 
                                style={{ lineHeight: "1.8" }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            ></div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;

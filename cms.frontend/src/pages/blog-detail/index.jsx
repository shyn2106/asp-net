import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Here we call blogService.getPostById(id)
                const data = await blogService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return (
        <div className="container py-5 text-center text-white">
            <div className="spinner-border text-info" role="status"></div>
            <p className="mt-3 font-monospace">Đang tải nội dung bài viết...</p>
        </div>
    );

    if (!post) return (
        <div className="container py-5 text-center text-white">
            <h2 className="text-danger">Không tìm thấy bài viết!</h2>
            <button className="btn btn-outline-info mt-3" onClick={() => navigate('/blog')}>Quay lại danh sách tin tức</button>
        </div>
    );

    return (
        <div className="container py-5">
            <button className="btn btn-link text-white-50 text-decoration-none mb-4" onClick={() => navigate('/blog')}>
                <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách
            </button>
            <div className="bg-dark rounded-4 shadow-lg border border-secondary border-opacity-10 overflow-hidden" style={{ backgroundColor: "#151b2d" }}>
                <div className="position-relative">
                    <img
                        src={post.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"}
                        className="w-100"
                        alt={post.title}
                        style={{ height: "450px", objectFit: "cover" }}
                    />
                </div>

                <div className="p-5 text-white">
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
    );
};

export default BlogDetail;

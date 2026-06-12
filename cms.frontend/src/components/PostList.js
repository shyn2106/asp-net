import React, { useEffect, useState } from "react";
import blogService from "../services/blogService";

function PostList() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {

            const data = await blogService.getAllPosts();

            setPosts(data);

        } catch (error) {

            console.error("Lỗi tải bài viết:", error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 text-white">
                <div className="spinner-border text-info mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="font-monospace text-info">LOADING NEWS...</p>
            </div>
        );
    }

    if (selectedPost) {
        return (
            <div className="mt-2 text-white pb-5">
                <button 
                    className="btn btn-outline-info rounded-pill px-4 mb-4 font-monospace" 
                    onClick={() => setSelectedPost(null)}
                >
                    <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
                </button>

                <div className="card border-0 shadow-lg" style={{ backgroundColor: "#151b2d", borderRadius: "18px", overflow: "hidden" }}>
                    <img
                        src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"}
                        className="card-img-top"
                        alt={selectedPost.title}
                        style={{ height: "400px", objectFit: "cover" }}
                    />
                    <div className="card-body p-5">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span className="badge bg-primary px-3 py-2 rounded-pill font-monospace">
                                {selectedPost.categoryName || "G-ZONE NEWS"}
                            </span>
                            <span className="text-white-50 small">
                                <i className="bi bi-calendar3 me-2"></i>
                                {new Date(selectedPost.createdDate).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                        
                        <h2 className="fw-black mb-4 text-neon-cyan" style={{ fontFamily: "Outfit, sans-serif" }}>
                            {selectedPost.title}
                        </h2>

                        <div 
                            className="fs-5 text-light" 
                            style={{ lineHeight: "1.8" }}
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        >
                            {/* If the content is purely text without HTML, using dangerouslySetInnerHTML is okay, but if it's text we can also just render it. Assuming it could have HTML from a rich text editor */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2">
            <div className="row g-4">
                {posts.map((post) => (
                    <div className="col-md-6 col-lg-4" key={post.id}>
                        <div 
                            className="card shadow-lg h-100 border-0 card-hover-effect text-white cursor-pointer"
                            style={{ backgroundColor: "#151b2d", borderRadius: "18px", overflow: "hidden", cursor: "pointer" }}
                            onClick={() => setSelectedPost(post)}
                        >
                            <img
                                src={post.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"}
                                className="card-img-top"
                                alt={post.title}
                                style={{ height: "220px", objectFit: "cover", transition: "transform 0.5s ease" }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                            />

                            <div className="card-body d-flex flex-column p-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-dark text-info border border-info border-opacity-25 font-monospace">
                                        {post.categoryName || "G-ZONE NEWS"}
                                    </span>
                                </div>

                                <h5 className="fw-bold mb-3 text-truncate-2" style={{ lineHeight: "1.4" }}>
                                    {post.title}
                                </h5>

                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                    <small className="text-white-50 font-monospace">
                                        <i className="bi bi-clock me-1"></i>
                                        {new Date(post.createdDate).toLocaleDateString("vi-VN")}
                                    </small>
                                    <button className="btn btn-sm btn-link text-info text-decoration-none p-0 fw-bold">
                                        Đọc tiếp <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    return (
        <div className="col-md-4">
            <div 
                className="card shadow-lg h-100 border-0 card-hover-effect text-white cursor-pointer"
                style={{ backgroundColor: "#151b2d", borderRadius: "18px", overflow: "hidden", cursor: "pointer" }}
                onClick={() => navigate(`/blog/${post.id}`)}
            >
                <img
                    src={post.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                />
                <div className="card-body d-flex flex-column p-4">
                    <div className="mb-2">
                        <span className="badge bg-dark text-warning border border-warning border-opacity-25 font-monospace">
                            {post.categoryName || "Tin Công Nghệ"}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;

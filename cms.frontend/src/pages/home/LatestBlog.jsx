import React, { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await blogService.getAllPosts();
                const data = response.data || response;
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading || posts.length === 0) return null;

    return (
        <section id="latest-blog-section" className="mb-5">
            <div className="d-flex align-items-center mb-4">
                <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <span className="text-warning me-2">📰</span> TIN TỨC CÔNG NGHỆ MỚI
                </h3>
                <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(234, 179, 8, 0.5), transparent)" }}></div>
            </div>
            <div className="row g-4">
                {posts.slice(0, 3).map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}

export default LatestBlog;

import React from 'react';
import PostList from '../../components/PostList';

const Blog = () => {
    return (
        <div className="container py-4 pb-5">
            <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: "#151b2d" }}>
                <h2 className="fw-bold text-white mb-2"><i className="bi bi-newspaper me-2 text-info"></i>Tin Tức Công Nghệ & Review</h2>
                <p className="text-white-50 mb-0">Cập nhật tin tức hot nhất về phần cứng, điện thoại, mẹo sử dụng và tin tức từ hãng.</p>
            </div>
            <PostList />
        </div>
    );
};

export default Blog;

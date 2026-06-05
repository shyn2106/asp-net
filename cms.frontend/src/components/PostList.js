import React, { useEffect, useState } from "react";
import blogService from "../services/blogService";

function PostList() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <div className="text-center p-5">
                Đang tải bài viết...
            </div>
        );
    }

    return (
        <div className="mt-5">

            <h3 className="fw-bold mb-4">
                📰 Tin tức & Blog
            </h3>

            <div className="row">

                {posts.map((post) => (

                    <div
                        className="col-md-6 mb-4"
                        key={post.id}
                    >
                        <div className="card shadow-sm h-100 border-0">

                            <img
                                src={
                                    post.imageUrl ||
                                    "https://via.placeholder.com/600x300"
                                }
                                className="card-img-top"
                                alt={post.title}
                                style={{
                                    height: "220px",
                                    objectFit: "cover"
                                }}
                            />

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    {post.title}
                                </h5>

                                <p className="text-muted">
                                    Danh mục:
                                    {" "}
                                    {post.categoryName}
                                </p>

                                <small className="text-secondary">

                                    📅{" "}
                                    {new Date(
                                        post.createdDate
                                    ).toLocaleDateString(
                                        "vi-VN"
                                    )}

                                </small>

                            </div>

                        </div>
                    </div>

                ))}

            </div>

        </div>
    );
}

export default PostList;
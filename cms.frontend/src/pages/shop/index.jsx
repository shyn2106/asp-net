import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    const [searchParams] = useSearchParams();
    const initialCategoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")) : null;
    const initialKeyword = searchParams.get("keyword") || '';

    // State 1: Lưu trữ mảng danh sách sản phẩm đổ ra giao diện
    const [products, setProducts] = useState([]);

    // State phân trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // State 2: Quản lý trạng thái chờ mạng (UX hiệu ứng xoay)
    const [isLoading, setIsLoading] = useState(true);

    // State 3: Khối quản lý tập trung toàn bộ tiêu chí lọc từ database
    const [filters, setFilters] = useState({
        categoryProductId: initialCategoryId,
        minPrice: '',
        maxPrice: '',
        keyword: initialKeyword
    });

    // Theo dõi thay đổi của URL Params (ví dụ khi gõ tìm kiếm từ Header)
    useEffect(() => {
        const catId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")) : null;
        const kw = searchParams.get("keyword") || '';
        
        setFilters(prev => {
            // Chỉ cập nhật nếu thực sự có sự thay đổi từ URL để tránh render loop
            if (prev.categoryProductId !== catId || prev.keyword !== kw) {
                return {
                    ...prev,
                    categoryProductId: catId !== null ? catId : prev.categoryProductId,
                    keyword: kw
                };
            }
            return prev;
        });
    }, [searchParams]);

    // useEffect theo dõi biến [filters, page]. Cứ khi nào 1 trong các ô lọc thay đổi hoặc trang đổi -> API tự gọi ngầm
    useEffect(() => {
        const fetchFilterProducts = async () => {
            try {
                setIsLoading(true);
                // Tạo một object lọc sạch (bỏ các giá trị rỗng để URL params của axios gọn hơn)
                const activeFilters = {};
                if (filters.categoryProductId) activeFilters.categoryProductId = filters.categoryProductId;
                if (filters.minPrice) activeFilters.minPrice = filters.minPrice;
                if (filters.maxPrice) activeFilters.maxPrice = filters.maxPrice;
                if (filters.keyword) activeFilters.keyword = filters.keyword;

                const response = await productService.getAllProducts(activeFilters, page, 6);
                setProducts(response.data || []);
                setTotalPages(response.totalPages || 1);
                setTotalItems(response.totalItems || 0);
            } catch (error) {
                console.error("Lỗi gọi API lọc sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFilterProducts();
    }, [filters, page]);

    // Hàm CallBack truyền xuống cho các con kích hoạt khi người dùng thao tác
    const handleFilterUpdate = (newFields) => {
        setFilters(prev => ({
            ...prev,
            ...newFields
        }));
        setPage(1); // Reset lại trang 1 khi lọc
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container py-4">
            <div className="row">
                {/* CỘT TRÁI (3/12): Khu vực chứa bộ lọc dọc */}
                <aside className="col-lg-3 mb-4">
                    <ShopSidebar
                        activeCategory={filters.categoryProductId}
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onFilterChange={handleFilterUpdate}
                    />
                </aside>

                {/* CỘT PHẢI (9/12): Khu vực chứa thanh Search và Lưới hàng hóa */}
                <main className="col-lg-9">
                    <ShopHeader
                        total={totalItems}
                        keyword={filters.keyword}
                        onSearchChange={handleFilterUpdate}
                    />

                    {/* Kiểm soát UX qua LoadingOrEmpty trước khi render danh sách */}
                    <LoadingOrEmpty isLoading={isLoading} totalItems={totalItems}>
                         <ProductList products={products} /> 
                    </LoadingOrEmpty>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page - 1)}>Trang trước</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>Trang sau</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Shop;

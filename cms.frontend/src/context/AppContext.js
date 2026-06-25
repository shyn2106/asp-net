import React, { createContext, useState, useEffect, useMemo } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("gzone_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [loggedInCustomer, setLoggedInCustomer] = useState(() => {
        const saved = localStorage.getItem("customer");
        return saved ? JSON.parse(saved) : null;
    });

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authTab, setAuthTab] = useState("login");

    useEffect(() => {
        localStorage.setItem("gzone_cart", JSON.stringify(cart));
    }, [cart]);

    const handleLogout = () => {
        setLoggedInCustomer(null);
        localStorage.removeItem("customer");
    };

    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

    const handleAddToCart = (product, qty = 1) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex].quantity += qty;
                return updated;
            } else {
                return [...prevCart, { ...product, quantity: qty }];
            }
        });
    };

    const handleUpdateQuantity = (productId, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    return (
        <AppContext.Provider value={{
            cart, setCart, cartCount, cartTotal, handleAddToCart, handleUpdateQuantity, handleRemoveFromCart,
            loggedInCustomer, setLoggedInCustomer, showAuthModal, setShowAuthModal, authTab, setAuthTab, handleLogout
        }}>
            {children}
        </AppContext.Provider>
    );
};

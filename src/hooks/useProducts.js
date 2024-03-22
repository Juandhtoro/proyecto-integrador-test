import { useContext } from "react";
import useLocalStorage from "./useLocalStorage";
import ShoppingCartContext from "../contexts/ShoppingCartContext.jsx";
import axios from "axios";

const useProducts = () => {
    const { items, setItem } = useLocalStorage({ products: [] });
    const { removeCartProduct } = useContext(ShoppingCartContext);

    const searchProducts = async (params) => {
        try {
            const queryParams = new URLSearchParams(params);
            const response = await axios.get(`"https://mitienda-juan.onrender.com/api/products?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    };

    const createProduct = async (values) => {
        try {
            const response = await axios.post("https://mitienda-juan.onrender.com/api/products", values);
            setItem("products", [ ...items.products, response.data.data ]);
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    };

    const updateProduct = async (values) => {
        try {
            const response = await axios.put(`https://mitienda-juan.onrender.com/api/products/${values.id}`, values);
            const updatedProducts = items.products.map((product) =>
                product.id === values.id ? response.data.data : product,
            );
            setItem("products", updatedProducts);
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    const removeProduct = async (id) => {
        try {
            await axios.delete(`https://mitienda-juan.onrender.com/api/products/${id}`);
            const productsWithoutThisProduct = items.products.filter((item) => item.id !== id);
            setItem("products", productsWithoutThisProduct);
            removeCartProduct(id);
        } catch (error) {
            console.error("Error removing product:", error);
            throw error;
        }
    };

    return {
        products: items.products,
        searchProducts,
        createProduct,
        updateProduct,
        removeProduct,
    };
};

export default useProducts;
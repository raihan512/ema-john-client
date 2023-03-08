import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  addToDb,
  deleteShoppingCart,
  getStoredCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);

  // const { products, count } = useLoaderData();
  const [cart, setCart] = useState([]);

  const [size, setSize] = useState(9);
  const [currentPage, setCurrentPage] = useState(0);
  console.log(currentPage);

  const totalPages = Math.ceil(count / size);

  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${currentPage}&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setProducts(data.products);
      });
  }, [currentPage, size]);
  /*
Pagination Requirement
count: loaded,
perpage: (size) ex-10
pages: count/perpage
currentpage: (page)
*/

  const clearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  useEffect(() => {
    const storedCart = getStoredCart();
    const savedCart = [];
    for (const id in storedCart) {
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        savedCart.push(addedProduct);
      }
    }
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (selectedProduct) => {
    console.log(selectedProduct);
    let newCart = [];
    const exists = cart.find((product) => product._id === selectedProduct._id);
    if (!exists) {
      selectedProduct.quantity = 1;
      newCart = [...cart, selectedProduct];
    } else {
      const rest = cart.filter(
        (product) => product._id !== selectedProduct._id
      );
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, exists];
    }

    setCart(newCart);
    addToDb(selectedProduct._id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart clearCart={clearCart} cart={cart}>
          <Link to="/orders">
            <button>Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>You are seing data from page {currentPage + 1}</p>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`${pageNumber === currentPage} && "selected"`}
          >
            {pageNumber + 1}
          </button>
        ))}
        <select onChange={(event) => setSize(event.target.value)}>
          <option value="6">6</option>
          <option value="12" defaultValue>
            12
          </option>
          <option value="18">18</option>
          <option value="21">21</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;

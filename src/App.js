import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Fetch products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Add to cart
  const addToCart = product => {
    setCart([...cart, product]);
  };

  // Remove from cart
  const removeFromCart = index => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <header className="header">
        <h1>🛒 Neocart </h1>
        <p>Cart: {cart.length}</p>
      </header>

      {/* 🔍 Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </select>
      </div>

      {/* Products */}
      <div className="products">
        {filteredProducts.map(product => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>₹{Math.round(product.price * 80)}</p>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="cart">
        <h2>🛍 Cart</h2>
        {cart.length === 0 && <p>No items in cart</p>}

        {cart.map((item, index) => (
          <p key={index}>
            {item.title}
            <button onClick={() => removeFromCart(index)}>❌</button>
          </p>
        ))}

        <h3>Total: ₹{Math.round(total * 80)}</h3>
      </div>
    </div>
  );
}

export default App;

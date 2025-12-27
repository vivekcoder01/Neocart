import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  // STATES
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [panel, setPanel] = useState("user"); // user | admin
  const [isAdmin, setIsAdmin] = useState(false); // security flag

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // ADD TO CART
  const addToCart = product => {
    setCart([...cart, product]);
  };

  // REMOVE FROM CART
  const removeFromCart = index => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // ADMIN LOGIN HANDLER
  const openAdminPanel = () => {
    const password = prompt("Enter Admin Password");

    if (password === "admin123") {
      setIsAdmin(true);
      setPanel("admin");
    } else {
      alert("❌ Wrong password. Access denied.");
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h1>🛒 Neocart</h1>
        <p>Cart: {cart.length}</p>

        {/* PANEL BUTTONS */}
        <div>
          <button onClick={() => setPanel("user")}>User Panel</button>
          <button onClick={openAdminPanel}>Admin Panel</button>
        </div>
      </header>

      {/* ================= ADMIN PANEL ================= */}
      {panel === "admin" && isAdmin && (
        <Dashboard products={products} cart={cart} />
      )}

      {/* ================= USER PANEL ================= */}
      {panel === "user" && (
        <>
          {/* SEARCH & FILTER */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>

          {/* PRODUCTS */}
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

          {/* CART */}
          <div className="cart">
            <h2>🛍 Cart</h2>
            {cart.length === 0 && <p>No items</p>}

            {cart.map((item, i) => (
              <div className="cart-item" key={i}>
                <span>{item.title}</span>
                <button onClick={() => removeFromCart(i)}>❌</button>
              </div>
            ))}

            <h3>Total: ₹{Math.round(total * 80)}</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

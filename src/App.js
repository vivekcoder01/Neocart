import { useEffect, useState } from "react";
import "./App.css";

import Dashboard from "./Dashboard";
import Chat from "./Chat";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  /* ===================== STATE ===================== */
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [panel, setPanel] = useState("user"); // user | admin
  const [isAdmin, setIsAdmin] = useState(false);

  /* ===================== FETCH PRODUCTS ===================== */
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  /* ===================== CART FUNCTIONS ===================== */
  const addToCart = product => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = index => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  /* ===================== ADMIN LOGIN ===================== */
  const openAdminPanel = async () => {
    const email = prompt("Admin Email");
    const password = prompt("Admin Password");

    if (!email || !password) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user.email === "admin@neocart.com") {
        setIsAdmin(true);
        setPanel("admin");
      } else {
        alert("❌ You are not an admin");
      }
    } catch (error) {
      alert("❌ Login failed: " + error.message);
    }
  };

  /* ===================== ADMIN LOGOUT ===================== */
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setPanel("user");
  };

  /* ===================== FILTER PRODUCTS ===================== */
  const filteredProducts = products.filter(product => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || product.category === category;

    return matchSearch && matchCategory;
  });

  /* ===================== TOTAL ===================== */
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  /* ===================== UI ===================== */
  return (
    <div className="container">
      {/* ---------- HEADER ---------- */}
      <header className="header">
        <h1>🛒 Neocart</h1>
        <p>Cart: {cart.length}</p>

        <div>
          <button onClick={() => setPanel("user")}>User Panel</button>
          <button onClick={openAdminPanel}>Admin Panel</button>
        </div>
      </header>

      {/* ---------- ADMIN PANEL ---------- */}
      {panel === "admin" && isAdmin && (
        <Dashboard
          products={products}
          cart={cart}
          onLogout={handleAdminLogout}
        />
      )}

      {/* ---------- USER PANEL ---------- */}
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

            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <span>{item.title}</span>
                <button onClick={() => removeFromCart(index)}>❌</button>
              </div>
            ))}

            <h3>Total: ₹{Math.round(total * 80)}</h3>
          </div>

          {/* CHAT */}
          <Chat />
        </>
      )}
    </div>
  );
}

export default App;

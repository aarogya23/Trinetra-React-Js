import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './assets/css/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Calculate total price of all items in cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
        if (item.price === "Free" || item.price === "Free to Play") {
            return total;
          }
      // Remove currency symbol and convert to number
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(savedCart);
      } catch (error) {
        console.error("Error loading cart data:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Update cart item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Navigate to game details page
  const viewGameDetails = (gameName) => {
    navigate(`/game/${gameName}`);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    // You can implement checkout logic here
    // For now, we'll just alert and navigate to a hypothetical checkout page
    alert('Proceeding to checkout...');
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page-container">
      <Navbar />
      
      <div className="cart-content" style={{marginTop: "80px"}}>
        <h1 className="cart-title">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="cart-icon">🛒</i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any games to your cart yet.</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-details">
            <div className="cart-items">
              <div className="cart-header">
                <div className="cart-header-item product-col">Product</div>
                <div className="cart-header-item price-col">Price</div>
                <div className="cart-header-item quantity-col">Quantity</div>
                <div className="cart-header-item subtotal-col">Subtotal</div>
                <div className="cart-header-item action-col">Action</div>
              </div>
              
              {cartItems.map((item, index) => {
                // Extract numeric price value
                const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                const subtotal = (priceValue * item.quantity).toFixed(2);
                const currencySymbol = item.price.replace(/[0-9.-]+/g, "").trim();
                
                return (
                  <div key={index} className="cart-item">
                    <div className="product-col">
                      <div className="cart-item-details">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="cart-item-image"
                          onClick={() => viewGameDetails(item.name)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80x120?text=Game";
                          }}
                        />
                        <div className="cart-item-info">
                          <div 
                            className="cart-item-name"
                            onClick={() => viewGameDetails(item.name)}
                          >
                            {item.name}
                          </div>
                          <div className="cart-item-developer">{item.developer}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="price-col">
                      <div className="cart-item-price">{item.price}</div>
                    </div>
                    
                    <div className="quantity-col">
                      <div className="cart-quantity-selector">
                        <button 
                          className="cart-quantity-btn"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="cart-quantity-value">{item.quantity}</span>
                        <button 
                          className="cart-quantity-btn"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="subtotal-col">
                      <div className="cart-item-subtotal">{currencySymbol}{subtotal}</div>
                    </div>
                    
                    <div className="action-col">
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span className="summary-label">Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                <span className="summary-value">Rs {calculateTotal()}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value">Free</span>
              </div>
              
              <div className="summary-row total-row">
                <span className="summary-label">Total:</span>
                <span className="summary-value">Rs {calculateTotal()}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-btn"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
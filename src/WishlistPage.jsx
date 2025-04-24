import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './assets/css/WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist items from localStorage
    const loadWishlist = () => {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(savedWishlist);
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (item) => {
    const updatedWishlist = wishlistItems.filter(game => game.id !== item.id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const addToCart = (item) => {
    // Create cart item with quantity 1
    const cartItem = {
      ...item,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(cartGame => cartGame.id === item.id);

    if (existingItemIndex >= 0) {
      // Item already in cart, increment quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`Added ${item.name} to your cart!`);
  };

  const navigateToGame = (gameName) => {
    navigate(`/game/${gameName}`);
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      setWishlistItems([]);
      localStorage.setItem('wishlist', JSON.stringify([]));
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <Navbar />
        <div className="wishlist-content" style={{ marginTop: "80px" }}>
          <h1>Loading wishlist...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <Navbar />
      
      <div className="wishlist-content" style={{ marginTop: "80px" }}>
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button className="clear-wishlist-btn" onClick={clearWishlist}>
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-message">
              <h2>Your wishlist is empty</h2>
              <p>Add games to your wishlist to keep track of titles you're interested in</p>
              <button className="browse-games-btn" onClick={() => navigate('/')}>
                Browse Games
              </button>
            </div>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-image" onClick={() => navigateToGame(item.name)}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x300?text=Game+Cover";
                    }}
                  />
                </div>
                <div className="wishlist-item-details">
                  <h3 className="wishlist-item-name" onClick={() => navigateToGame(item.name)}>
                    {item.name}
                  </h3>
                  <p className="wishlist-item-developer">{item.developer}</p>
                  <p className="wishlist-item-price">{item.price}</p>
                  
                  <div className="wishlist-item-actions">
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromWishlist(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
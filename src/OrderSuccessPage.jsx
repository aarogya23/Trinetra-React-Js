import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, total, paymentMethod, items } = location.state || {};

  // Redirect to home if there's no order data
  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    } else {
      // Save purchased games to library
      saveGamesToLibrary(items);
      // Save order to order history
      saveOrderToHistory(orderNumber, total, paymentMethod, items);
    }
  }, [orderNumber, navigate, items, total, paymentMethod]);

  // Function to save order to history
  const saveOrderToHistory = (orderNum, totalAmount, payment, purchasedItems) => {
    if (!orderNum) return;

    try {
      // Get existing order history
      const existingOrdersJSON = localStorage.getItem('orderHistory');
      let orderHistory = existingOrdersJSON ? JSON.parse(existingOrdersJSON) : [];

      // Create new order entry
      const newOrder = {
        orderNumber: orderNum,
        total: totalAmount,
        paymentMethod: payment,
        purchaseDate: new Date().toISOString(),
        items: purchasedItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Add new order to history (avoiding duplicates)
      const updatedHistory = orderHistory.find(order => order.orderNumber === orderNum) 
        ? orderHistory.map(order => order.orderNumber === orderNum ? newOrder : order)
        : [...orderHistory, newOrder];

      // Save updated history to localStorage
      localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      
      console.log('Order saved to history:', newOrder);
    } catch (error) {
      console.error('Error saving order to history:', error);
    }
  };

  // Function to save games to library
  const saveGamesToLibrary = (purchasedItems) => {
    if (!purchasedItems || !purchasedItems.length) return;

    try {
      // Get existing library games
      const existingGamesJSON = localStorage.getItem('libraryGames');
      let libraryGames = existingGamesJSON ? JSON.parse(existingGamesJSON) : [];

      // Process purchased items and add to library
      const newLibraryGames = purchasedItems.map(item => {
        // Generate a random game key (in a real app, this would come from your backend)
        const gameKey = generateGameKey();
        
        return {
          id: item.id || `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          image: item.image,
          key: gameKey,
          purchaseDate: new Date().toISOString(),
          orderNumber: orderNumber
        };
      });

      // Add new games to library and remove duplicates
      const updatedLibrary = [...libraryGames, ...newLibraryGames].reduce((acc, game) => {
        if (!acc.some(g => g.id === game.id)) {
          acc.push(game);
        }
        return acc;
      }, []);

      // Save updated library to localStorage
      localStorage.setItem('libraryGames', JSON.stringify(updatedLibrary));
      
      console.log('Games added to library:', newLibraryGames);
    } catch (error) {
      console.error('Error saving games to library:', error);
    }
  };

  // Generate a random game key
  const generateGameKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      if (i < 4) result += '-';
    }
    return result;
  };

  // Get current date formatted as string
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to capitalize payment method
  const formatPaymentMethod = (method) => {
    if (method === 'esewa') return 'eSewa';
    if (method === 'khalti') return 'Khalti';
    if (method === 'ebanking') return 'E-Banking';
    return method;
  };

  if (!orderNumber) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="order-success-container">
      <Navbar />
      
      <div className="order-success-content">
        <div className="order-success-card">
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h1>Thank You for Your Purchase!</h1>
            <p>Your game keys will be sent to your email shortly</p>
          </div>
          
          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderNumber}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{getCurrentDate()}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{formatPaymentMethod(paymentMethod)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">Rs {total ? (parseFloat(total) * 1.12).toFixed(2) : '0.00'}</span>
            </div>
          </div>
          
          <div className="purchased-games">
            <h2>Games Purchased</h2>
            <div className="games-list">
              {items && items.map((item, index) => (
                <div key={index} className="game-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/60x80?text=Game";
                    }}
                  />
                  <div className="game-details">
                    <div className="game-name">{item.name}</div>
                    <div className="game-quantity">Quantity: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="success-actions">
            <button
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button
              className="view-library-btn"
              onClick={() => navigate('/library')}
            >
              View My Library
            </button>
            <button
              className="view-history-btn"
              onClick={() => navigate('/order-history')}
            >
              Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
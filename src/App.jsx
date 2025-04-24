import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrinetraGamePage from './TrinetraGamePage';
import GameDetailsPage from './GameDetailsPage';
import CartPage from './CartPage';
import './App.css';
import games from './gameData.js';
import CheckoutPage from './CheckoutPage';
import OrderSuccessPage from './OrderSuccessPage';
import LibraryPage from './LibraryPage';
import AskAi from './AskAi';
import OrderHistoryPage from './OrderHistoryPage.jsx';
import AnalyticsPage from './AnalyticsPage.jsx';
import WishlistPage from './WishlistPage';
import ProfilePage from './ProfilePage.jsx';

const App = () => {
  // Combine all game arrays into one
  const allGames = [
    ...games.spotlight,
    ...games.free,
    ...games.fifa
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TrinetraGamePage />} />
        <Route path="/game/:gameName" element={<GameDetailsPage allGames={allGames} />} />
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/ask-ai" element={<AskAi />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/order/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
      </Routes>
    </Router>
  );
};

export default App;

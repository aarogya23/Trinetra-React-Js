import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './App';
import logo from "./assets/image/trinetra.png";
import "./assets/css/Navbar.css";
import profile from './assets/image/profile.jpg';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  useEffect(() => {
    // Update cart count and wishlist count from localStorage
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      // Calculate total items in cart
      const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCartItems);
      
      // Count items in wishlist
      setWishlistCount(wishlist.length);
    };

    // Call immediately
    updateCounts();

    // Set up event listener for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Custom event to update counts without page refresh
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);

    // Close the profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-container')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    // Typically you would clear tokens, user data, etc.
    setProfileDropdownOpen(false);
  };
  
  return (
    <header className="header">
      <div className="header-main">
      
        <img src={logo} alt="Trinetra Games" className="logo" />
        
        {/* Desktop Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/" className="nav-link">AskAi</Link>
          <Link to="/library" className="nav-link">Library</Link>
          <Link to="/order-history" className="nav-link">History</Link>
          <Link to="/wishlist" className="nav-link">
            Wishlist
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="nav-link">
            Add to Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </nav>
        
        {/* Desktop Search Box */}
        <div className="search-box desktop-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        
        {/* Profile with Dropdown - for Desktop */}
        <div className="profile-container" onClick={toggleProfileDropdown}>
          <img src={profile} alt="Profile" className="profile-icon" />
          
          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
        
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          <div className={`humburger-icon ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Includes Search when opened) */}
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        

        <Link to="/" className="nav-link">Home</Link>
        <Link to="/ask-ai" className="nav-link">AskAi</Link>
        <Link to="/library" className="nav-link">Library</Link>
        <Link to="/order-history" className="nav-link">History</Link>
        <Link to="/wishlist" className="nav-link">
          Wishlist
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </Link>
        <Link to="/cart" className="nav-link">
          Add to Cart
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>

        {/* Mobile Profile Section at the top of mobile menu */}
        <div className="mobile-profile-section">
          <div className="mobile-profile-container" onClick={toggleProfileDropdown}>
            <img src={profile} alt="Profile" className="mobile-profile-icon" />
            <div className="mobile-profile-info">
              <div className="mobile-profile-name">User Profile</div>
              
              {/* Mobile Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="mobile-profile-dropdown">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search Box (Only appears when menu is opened) */}
        {mobileMenuOpen && (
          <div className="search-box mobile-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
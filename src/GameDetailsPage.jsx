import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './assets/css/GameDetailsPage.css'; 

const GameDetailsPage = ({ allGames }) => {
  const { gameName } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Find the game by name (URL parameter)
    if (allGames && allGames.length > 0) {
      const foundGame = allGames.find(
        g => g.name.toLowerCase() === gameName.toLowerCase()
      );
      
      if (foundGame) {
        setGame(foundGame);
        // Add mock data for demonstration
        foundGame.description = "Experience the ultimate gaming adventure with stunning graphics and immersive gameplay. Challenge friends or compete globally in this action-packed title.";

        foundGame.genre = ["Action", "Adventure"];
        foundGame.rating = 4.7;
        foundGame.reviews = 1243;
        foundGame.systemRequirements = {
          minimum: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5-6600K / AMD Ryzen 5 1600",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 970 / AMD Radeon RX 570",
            storage: "50 GB available space"
          },
          recommended: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i7-8700K / AMD Ryzen 7 2700X",
            memory: "16 GB RAM",
            graphics: "NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700",
            storage: "50 GB SSD available space"
          }
        };

        // Check if game is in wishlist
        checkWishlistStatus(foundGame);
      }
    }
    setLoading(false);
  }, [gameName, allGames]);

  const checkWishlistStatus = (gameData) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || "[]");
    const isInWishlist = wishlist.some(item => item.name === gameData.name);
    setIsInWishlist(isInWishlist);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // create cart item object
  const addToCart = () => {
    const cartItem = {
      id: game.id || Math.random().toString(36).substring(2,9),
      name: game.name,
      price: game.price,
      image: game.image,
      quantity: quantity,
      developer: game.developer
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || "[]");

    const existingItemIndex = existingCart.findIndex(item => item.name === game.name);
    if(existingItemIndex >= 0){
      existingCart[existingItemIndex].quantity += quantity;
    }
    else{
      existingCart.push(cartItem);
    }

    // SAVE THE DATA TO lOCALSTORAGE
    localStorage.setItem('cart', JSON.stringify(existingCart));

    alert(`Added ${quantity} copies of ${game.name} to cart!`);
    navigate('/cart');
  };

  const toggleWishlist = () => {
    const wishlistItem = {
      id: game.id || Math.random().toString(36).substring(2,9),
      name: game.name,
      price: game.price,
      image: game.image,
      developer: game.developer
    };

    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || "[]");

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = existingWishlist.filter(item => item.name !== game.name);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      alert(`Removed ${game.name} from your wishlist!`);
    } else {
      // Add to wishlist
      const existingItemIndex = existingWishlist.findIndex(item => item.name === game.name);
      if (existingItemIndex < 0) {
        existingWishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
        setIsInWishlist(true);
        alert(`Added ${game.name} to your wishlist!`);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading game details...</div>;
  }

  if (!game) {
    return (
      <div className="game-not-found">
        <Navbar />
        <div className="not-found-content">
          <h2>Game Not Found</h2>
          <p>Sorry, we couldn't find the game you're looking for.</p>
          <button className="btn-primary" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      <Navbar />
      
      <div className="game-details-content" style={{marginTop: "80px"}}>
        <div className="game-hero">
          <div className="game-hero-left">
            <img 
              src={game.image} 
              alt={game.name} 
              className="game-cover-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x400?text=Game+Cover";
              }}
            />
          </div>
          
          <div className="game-hero-right">
            <h1 className="game-title">{game.name}</h1>
            
            <div className="game-meta">
              <span className="game-developer">{game.developer}</span>
              <span className="game-release">Released: {game.releaseDate}</span>
              <div className="game-rating">
                <span className="stars">{'★'.repeat(Math.floor(game.rating))}{game.rating % 1 >= 0.5 ? '½' : ''}</span>
                <span className="rating-value">{game.rating}/5</span>
                <span className="review-count">({game.reviews} reviews)</span>
              </div>
              <div className="game-genres">
                {game.genre && game.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>
            
            <div className="game-purchase">
              <div className="game-price">{game.price}</div>
              
              <div className="quantity-selector">
                <button onClick={decrementQuantity} className="quantity-btn">-</button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={incrementQuantity} className="quantity-btn">+</button>
              </div>
              
              <div className="purchase-buttons">
                <button onClick={addToCart} className="add-to-cart-btn">Add to Cart</button>
                <button 
                  onClick={toggleWishlist} 
                  className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                >
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="game-tabs">
          <button 
            className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setSelectedTab('requirements')}
          >
            System Requirements
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setSelectedTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div className="overview-tab">
              <h3>About this Game</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-screenshots">
                <h3>Screenshots</h3>
                <div className="screenshots-grid">
                  <div className="screenshot">
                    <img 
                      src={game.screenshot1 || game.image} 
                      alt={`${game.name} screenshot 1`} 
                      className="screenshot-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/640x360?text=Game+Screenshot";
                      }}
                    />
                  </div>
                  <div className="screenshot">
                    <img 
                      src={game.screenshot2 || game.image} 
                      alt={`${game.name} screenshot 2`} 
                      className="screenshot-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/640x360?text=Game+Screenshot";
                      }}
                    />
                  </div>
                  <div className="screenshot">
                    <img 
                      src={game.screenshot3 || game.image} 
                      alt={`${game.name} screenshot 3`} 
                      className="screenshot-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/640x360?text=Game+Screenshot";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'requirements' && (
            <div className="requirements-tab">
              <h3>System Requirements</h3>
              
              <div className="requirements-grid">
                <div className="req-column">
                  <h4>Minimum Requirements</h4>
                  <ul className="req-list">
                    <li><span className="req-label">OS:</span> {game.systemRequirements.minimum.os}</li>
                    <li><span className="req-label">Processor:</span> {game.systemRequirements.minimum.processor}</li>
                    <li><span className="req-label">Memory:</span> {game.systemRequirements.minimum.memory}</li>
                    <li><span className="req-label">Graphics:</span> {game.systemRequirements.minimum.graphics}</li>
                    <li><span className="req-label">Storage:</span> {game.systemRequirements.minimum.storage}</li>
                  </ul>
                </div>
                
                <div className="req-column">
                  <h4>Recommended Requirements</h4>
                  <ul className="req-list">
                    <li><span className="req-label">OS:</span> {game.systemRequirements.recommended.os}</li>
                    <li><span className="req-label">Processor:</span> {game.systemRequirements.recommended.processor}</li>
                    <li><span className="req-label">Memory:</span> {game.systemRequirements.recommended.memory}</li>
                    <li><span className="req-label">Graphics:</span> {game.systemRequirements.recommended.graphics}</li>
                    <li><span className="req-label">Storage:</span> {game.systemRequirements.recommended.storage}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'reviews' && (
            <div className="reviews-tab">
              <h3>Player Reviews</h3>
              
              <div className="review-summary">
                <div className="rating-summary">
                  <div className="big-rating">{game.rating}</div>
                  <div className="big-stars">{'★'.repeat(Math.floor(game.rating))}{game.rating % 1 >= 0.5 ? '½' : ''}</div>
                  <div className="total-reviews">Based on {game.reviews} reviews</div>
                </div>
                
                <div className="rating-distribution">
                  {/* Rating distribution bars */}
                  <div className="rating-bar">
                    <span className="rating-label">5 ★</span>
                    <div className="rating-bar-outer">
                      <div className="rating-bar-inner" style={{width: '70%'}}></div>
                    </div>
                    <span className="rating-count">70%</span>
                  </div>
                  <div className="rating-bar">
                    <span className="rating-label">4 ★</span>
                    <div className="rating-bar-outer">
                      <div className="rating-bar-inner" style={{width: '20%'}}></div>
                    </div>
                    <span className="rating-count">20%</span>
                  </div>
                  <div className="rating-bar">
                    <span className="rating-label">3 ★</span>
                    <div className="rating-bar-outer">
                      <div className="rating-bar-inner" style={{width: '5%'}}></div>
                    </div>
                    <span className="rating-count">5%</span>
                  </div>
                  <div className="rating-bar">
                    <span className="rating-label">2 ★</span>
                    <div className="rating-bar-outer">
                      <div className="rating-bar-inner" style={{width: '3%'}}></div>
                    </div>
                    <span className="rating-count">3%</span>
                  </div>
                  <div className="rating-bar">
                    <span className="rating-label">1 ★</span>
                    <div className="rating-bar-outer">
                      <div className="rating-bar-inner" style={{width: '2%'}}></div>
                    </div>
                    <span className="rating-count">2%</span>
                  </div>
                </div>
              </div>
              
              <div className="user-reviews">
                {/* Sample reviews */}
                <div className="review-item">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar"></div>
                    <div className="reviewer-name">GameLover123</div>
                  </div>
                  <div className="review-content">
                    <div className="review-rating">★★★★★</div>
                    <div className="review-date">March 15, 2025</div>
                    <p className="review-text">This game is absolutely amazing! The graphics are stunning and the gameplay is super engaging. Would definitely recommend!</p>
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar"></div>
                    <div className="reviewer-name">ProGamer45</div>
                  </div>
                  <div className="review-content">
                    <div className="review-rating">★★★★</div>
                    <div className="review-date">March 10, 2025</div>
                    <p className="review-text">Great game overall, but there are some performance issues on older hardware. Otherwise, the story and gameplay are fantastic.</p>
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar"></div>
                    <div className="reviewer-name">GameExplorer</div>
                  </div>
                  <div className="review-content">
                    <div className="review-rating">★★★★★</div>
                    <div className="review-date">March 5, 2025</div>
                    <p className="review-text">One of the best games I've played this year! The attention to detail is remarkable and the multiplayer mode is super fun.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="related-games">
          <h3>You Might Also Like</h3>
          <div className="related-games-grid">
            {/* Show 4 random games from allGames array */}
            {allGames && 
              allGames
              .filter(relatedGame => relatedGame.name !== game.name) // Don't show current game
              .slice(0, 4) // Take only 4 games
              .map((relatedGame, index) => (
                <div 
                  key={index} 
                  className="related-game-card" 
                  onClick={() => navigate(`/game/${relatedGame.name}`)}
                >
                  <img 
                    src={relatedGame.image} 
                    alt={relatedGame.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x300?text=Game+Cover";
                    }}
                  />
                  <div className="related-game-info">
                    <div className="related-game-name">{relatedGame.name}</div>
                    <div className="related-game-price">{relatedGame.price}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./assets/css/styles.css";
import Navbar from "./Navbar";
import callofDuty from './assets/image/short.jpg';
import eafc from './assets/image/standard.jpg';
import far from './assets/image/farfromhere.jpg';
import eafc1 from './assets/image/eafc.png';
import callofduty from './assets/image/modern1234.png';
import gta5 from './assets/image/gta5.png';
import pubg from './assets/image/pubg.png';
import apex from './assets/image/apex.png';
import vdd from './assets/image/vdd.png';
import warzone from './assets/image/warzone.png';
import couterstrike from './assets/image/cs2.jpg';
import fifa14 from './assets/image/fifa 14.png';
import fifa15 from './assets/image/fifa15.jpg';
import fifa16 from './assets/image/fifa16.jpg';
import fifa18 from './assets/image/fifa 18.png';
import fifa17 from './assets/image/fifa17.png';
import ChatBot from './ChatBot';
import deltaforce from './assets/image/deltaforce.jpg';
import dota2 from './assets/image/dota2.jpg';
// Main Component
export default function TrinetraGamePage() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clickedGame, setClickedGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Existing game data
  const games = {
    spotlight: [
      { name: "EA FC 24", price: "Rs2400", image: eafc1 },
      { name: "Call of Duty MW3", price: "Rs1999", image: callofduty },
      { name: "Grand Theft Auto", price: "Rs1000", image: gta5 },
    ],
    free: [
      { name: "PUBG BATTLEGROUNDS", image: pubg, price: "Free" },
      { name: "Apex Legends", image: apex, price: "Free" },
      { name: "Valorant", image: vdd, price: "Free" },
      { name: "War Zone", image: warzone, price: "Free" },
      { name: "Counter Strike", image: couterstrike, price: "Free" },
      { name: "Delta Force", price: "Free", image: deltaforce },
      { name: "Dota 2", price: "Free", image: dota2 },
      ,
    ],
    fifa: [
      { name: "FIFA 14", price: "Rs1500", image: fifa14 },
      { name: "FIFA 15", price: "Rs1500", image: fifa15 },
      { name: "FIFA 16", price: "Rs1500", image: fifa16 },
      { name: "FIFA 17", price: "Rs1300", image: fifa17 },
      { name: "FIFA 18", price: "Rs1300", image: fifa18 },
    ],
  };

  // Combine all games into a single array for search
  const allGames = [
    ...games.spotlight,
    ...games.free,
    ...games.fifa
  ];

  const carouselImages = [callofDuty, eafc, far];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  // Modified handleGameClick to navigate to game details page
  const handleGameClick = (game) => {
    setClickedGame(game);
    
    // Add animation effect before navigation
    setTimeout(() => {
      setClickedGame(null); // Reset after animation
      // Navigate to game details page
      navigate(`/game/${encodeURIComponent(game.name)}`);
    }, 300); // Match with animation duration
  };

  // Handle search from Navbar
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setShowSearchResults(false);
      return;
    }

    const results = allGames.filter(game => 
      game.name.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Clear search results
  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const scrollLeft = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollBy({
      left: -200, // Scroll left by 200px
      behavior: 'smooth',
    });
  };
  
  const scrollRight = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollBy({
      left: 200, // Scroll right by 200px
      behavior: 'smooth',
    });
  };
  
  return (
    <div className="container">
      {/* Use the Navbar component */}
      <Navbar onSearch={handleSearch} />

      {/* Search Results Section */}
      {showSearchResults && (
        <section className="section search-results">
          <div className="search-header">
            <h2>Search Results for "{searchTerm}"</h2>
            <button onClick={clearSearch} className="clear-search">Clear Search</button>
          </div>
          {searchResults.length > 0 ? (
            <div className="game-list">
              {searchResults.map((game, index) => (
                <div
                  key={`search-${index}`}
                  className={`game-card ${clickedGame === game ? 'clicked' : ''}`}
                  onClick={() => handleGameClick(game)}
                >
                  <img src={game.image} alt={game.name} />
                  <p>{game.name}</p>
                  <p className="price">{game.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No games found matching "{searchTerm}". Try a different search term.</p>
            </div>
          )}
        </section>
      )}

      {/* Only show regular content when not displaying search results */}
      {!showSearchResults && (
        <>
          {/* Carousel Section */}
          <div className="carousel">
            <button className="prev" onClick={prevSlide}>&#10094;</button>
            <img src={carouselImages[currentSlide]} alt="Carousel Slide" />
            <button className="next" onClick={nextSlide}>&#10095;</button>
          </div>

          <div className="game-images-section">
            <section className="section spotlight-section">
              <h2>Spring Sale Spotlight</h2>
              <div className="game-list-container">
                <button className="scroll-arrow prev" onClick={() => scrollLeft('spotlight-section')}>&#10094;</button>
                <div className="game-list" id="spotlight-section">
                  {games.spotlight.map((game, index) => (
                    <div
                      key={index}
                      className={`game-card ${clickedGame === game ? 'clicked' : ''}`}
                      onClick={() => handleGameClick(game)}
                    >
                      <img src={game.image} alt={game.name} />
                      <p>{game.name}</p>
                      <p className="price">{game.price}</p>
                    </div>
                  ))}
                </div>
                <button className="scroll-arrow next" onClick={() => scrollRight('spotlight-section')}>&#10095;</button>
              </div>
            </section>

            <section className="section free-games-section">
              <h2>Free Games</h2>
              <div className="game-list-container">
                <button className="scroll-arrow prev" onClick={() => scrollLeft('free-games-section')}>&#10094;</button>
                <div className="game-list" id="free-games-section">
                  {games.free.map((game, index) => (
                    <div
                      key={index}
                      className={`game-card ${clickedGame === game ? 'clicked' : ''}`}
                      onClick={() => handleGameClick(game)}
                    >
                      <img src={game.image} alt={game.name} />
                      <p>{game.name}</p>
                      <p className="price">{game.price}</p>
                    </div>
                  ))}
                </div>
                <button className="scroll-arrow next" onClick={() => scrollRight('free-games-section')}>&#10095;</button>
              </div>
            </section>

            <section className="section fifa-section">
              <h2>Old FIFA Memory</h2>
              <div className="game-list-container">
                <button className="scroll-arrow prev" onClick={() => scrollLeft('fifa-section')}>&#10094;</button>
                <div className="game-list" id="fifa-section">
                  {games.fifa.map((game, index) => (
                    <div
                      key={index}
                      className={`game-card ${clickedGame === game ? 'clicked' : ''}`}
                      onClick={() => handleGameClick(game)}
                    >
                      <img src={game.image} alt={game.name} />
                      <p>{game.name}</p>
                      <p className="price">{game.price}</p>
                    </div>
                  ))}
                </div>
                <button className="scroll-arrow next" onClick={() => scrollRight('fifa-section')}>&#10095;</button>
              </div>
            </section>
          </div>
        </>
      )}

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './assets/css/LibraryPage.css';

const LibraryPage = () => {
  const [libraryGames, setLibraryGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [downloadingGames, setDownloadingGames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch library games from localStorage
    const fetchLibraryGames = () => {
      try {
        setIsLoading(true);
        // Get games from localStorage
        const savedGames = localStorage.getItem('libraryGames');
        if (savedGames) {
          setLibraryGames(JSON.parse(savedGames));
        }
      } catch (error) {
        console.error('Error loading library games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryGames();
  }, []);

  // Generate game info text content
  const generateGameInfoText = (game) => {
    return `GAME INFORMATION
===============================
Game Name: ${game.name}
Game ID: ${game.id}
Purchase Date: ${formatDate(game.purchaseDate)}
License Key: ${game.key}
===============================

INSTALLATION INSTRUCTIONS
===============================
1. Copy the license key above
2. Launch the game installer
3. When prompted, paste your license key
4. Follow on-screen instructions to complete installation
===============================

SYSTEM REQUIREMENTS
===============================
OS: Windows 10/11 or macOS 12+
Processor: Intel Core i5 or AMD Ryzen 5
Memory: 8GB RAM
Graphics: NVIDIA GTX 1060 or AMD RX 580
Storage: 50GB available space
===============================

TECHNICAL SUPPORT
===============================
For technical support, please contact:
Email: support@gamestudio.com
Web: www.gamestudio.com/support
Phone: 1-800-GAME-HELP
===============================

Thank you for your purchase!
`;
  };

  // Handle game download - create and download a real text file
  const handleDownload = (gameId) => {
    const game = libraryGames.find(g => g.id === gameId);
    if (!game) return;

    // Set initial download state
    setDownloadingGames(prev => ({
      ...prev,
      [gameId]: {
        isDownloading: true,
        progress: 0,
        status: 'Starting download...'
      }
    }));

    // Generate text file content
    const gameInfoText = generateGameInfoText(game);
    
    // Simulate some processing time
    setTimeout(() => {
      setDownloadingGames(prev => ({
        ...prev,
        [gameId]: {
          ...prev[gameId],
          progress: 30,
          status: 'Preparing game information...'
        }
      }));
      
      setTimeout(() => {
        setDownloadingGames(prev => ({
          ...prev,
          [gameId]: {
            ...prev[gameId],
            progress: 70,
            status: 'Generating download file...'
          }
        }));
        
        setTimeout(() => {
          // Create a blob with the text content
          const blob = new Blob([gameInfoText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = `${game.name.replace(/\s+/g, '_')}_info.txt`;
          document.body.appendChild(link);
          
          setDownloadingGames(prev => ({
            ...prev,
            [gameId]: {
              ...prev[gameId],
              progress: 90,
              status: 'Starting download...'
            }
          }));
          
          // Trigger the download
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          // Update download state to complete
          setDownloadingGames(prev => ({
            ...prev,
            [gameId]: {
              ...prev[gameId],
              progress: 100,
              status: 'Download complete!',
              isComplete: true
            }
          }));
          
          // Reset after showing "complete" for 2 seconds
          setTimeout(() => {
            setDownloadingGames(prev => {
              const newState = { ...prev };
              delete newState[gameId];
              return newState;
            });
          }, 2000);
          
        }, 800); // Time before actual download starts
      }, 700); // Time for generating download
    }, 500); // Initial preparation time
  };

  // Handle game removal
  const handleRemove = (gameId) => {
    // Remove game from libraryGames state
    const updatedLibrary = libraryGames.filter(game => game.id !== gameId);
    setLibraryGames(updatedLibrary);
    
    // Update localStorage
    localStorage.setItem('libraryGames', JSON.stringify(updatedLibrary));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter games
  const filteredGames = libraryGames.filter(game => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(game.purchaseDate) >= oneWeekAgo;
    }
    return false;
  });

  if (isLoading) {
    return (
      <div className="library-container">
        <Navbar />
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Loading your game library...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-container">
      <Navbar />
      
      <div className="library-content" style={{marginTop: '5rem'}}>
        <div className="library-header">
          <h1>My Game Library</h1>
          
          <div className="library-filters">
            <button 
              className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Games
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'recent' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('recent')}
            >
              Recently Added
            </button>
          </div>
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="empty-library">
            <div className="empty-icon">📚</div>
            <p>Your library is empty.</p>
            <p className="empty-subtext">Purchase games to add them to your library.</p>
            <button 
              className="shop-now-btn"
              onClick={() => navigate('/')}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="game-count">
              Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </div>
            <div className="library-grid">
              {filteredGames.map((game) => (
                <div key={game.id} className="library-game-card">
                  <div className="game-image-container">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/200x300?text=Game";
                      }}
                    />
                    {downloadingGames[game.id] && (
                      <div className="download-overlay">
                        <div className="download-progress-container">
                          <div 
                            className="download-progress-bar" 
                            style={{ width: `${downloadingGames[game.id].progress}%` }}
                          ></div>
                        </div>
                        <div className="download-status">
                          {downloadingGames[game.id].status}
                        </div>
                        <div className="download-percentage">
                          {Math.round(downloadingGames[game.id].progress)}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    <div className="game-meta">
                      <span className="game-date">Added: {formatDate(game.purchaseDate)}</span>
                    </div>
                    <p className="game-key">
                      <span className="key-label">Key:</span> {game.key}
                    </p>
                    <div className="game-actions">
                      <button 
                        className={`action-btn download-btn ${downloadingGames[game.id] ? 'downloading' : ''}`}
                        onClick={() => handleDownload(game.id)}
                        disabled={downloadingGames[game.id]}
                      >
                        {downloadingGames[game.id] ? 
                          (downloadingGames[game.id].isComplete ? 'Complete' : 'Downloading...') : 
                          'Download Info'}
                      </button>
                      <button 
                        className="action-btn remove-btn"
                        onClick={() => handleRemove(game.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getAllBooks, BASE_URL } from '../services/bookService';
import { ArrowLeft, Search, Menu, Hash, Star, Eye, Zap, UserCircle } from 'lucide-react';
import './ReaderDashboard.css';

const ReaderDashboard = ({ onBookSelect }) => {
    const navigate = useNavigate();
    const { selectRole } = useUser();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await getAllBooks();
            if (response.success) {
                setBooks(response.books);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBack = () => {
        selectRole(null);
        navigate('/');
    };

    const handleBookClick = (book) => {
        if (onBookSelect) {
            onBookSelect(book);
        }
        navigate(`/read/${book._id}`);
    };

    const getCategoryGradient = (category) => {
        const gradients = {
            'Sci-Fi': { from: '#06b6d4', to: '#2563eb' },
            'Cyberpunk': { from: '#a855f7', to: '#ec4899' },
            'Non-Fiction': { from: '#d946ef', to: '#9333ea' },
            'Romance': { from: '#ec4899', to: '#f43f5e' },
            'Adventure': { from: '#fbbf24', to: '#ea580c' },
            'Cooking': { from: '#a3e635', to: '#059669' },
            'Thriller': { from: '#64748b', to: '#1e293b' },
            'Fantasy': { from: '#8b5cf6', to: '#9333ea' },
            'Fiction': { from: '#6366f1', to: '#2563eb' },
            'Technical': { from: '#22c55e', to: '#14b8a6' },
        };
        return gradients[category] || { from: '#6b7280', to: '#374151' };
    };

    const getCategoryEmoji = (category) => {
        const emojis = {
            'Sci-Fi': '🌌',
            'Cyberpunk': '🤖',
            'Non-Fiction': '🧠',
            'Romance': '🌸',
            'Adventure': '🗺️',
            'Cooking': '👨‍🍳',
            'Thriller': '💻',
            'Fantasy': '🔮',
            'Fiction': '📚',
            'Technical': '⚙️',
        };
        return emojis[category] || '📖';
    };

    return (
        <div className="reader-dashboard">
            <header className="reader-header">
                <div className="reader-header-content">
                    <div className="header-nav">
                        <button onClick={handleBack} className="nav-back-button">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="nav-title">EBookify<span className="nav-title-accent"></span></h1>

                        <nav className="nav-pills">
                            <button className="nav-pill active">All</button>
                            <button className="nav-pill inactive">Fiction</button>
                            <button className="nav-pill inactive">Science</button>
                        </nav>
                    </div>

                    <div className="header-actions">
                        <div className="search-wrapper">
                            <Search className="search-icon" size={16} />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search database..."
                                className="search-input"
                            />
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="user-avatar"
                            title="Profile"
                        >
                            <UserCircle size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="reader-main">
                <div className="content-header">
                    <div className="content-header-text">
                        <p>Query Results</p>
                        <h2>{searchQuery ? `"${searchQuery}"` : "Trending Data"}</h2>
                    </div>
                    <div className="view-toggles">
                        <button className="view-toggle"><Hash size={18} /></button>
                        <button className="view-toggle"><Menu size={18} /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">LOADING DATABASE...</p>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="empty-state">
                        <p>No books found in the archive.</p>
                    </div>
                ) : (
                    <div className="books-grid">
                        {filteredBooks.map((book) => {
                            const gradient = getCategoryGradient(book.category);
                            return (
                                <div
                                    key={book._id}
                                    className="book-card"
                                    onClick={() => handleBookClick(book)}
                                >
                                    <div
                                        className="book-cover"
                                        style={!book.coverImage ? {
                                            background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`
                                        } : {}}
                                    >
                                        {book.coverImage ? (
                                            <img
                                                src={`${BASE_URL}${book.coverImage}`}
                                                alt={book.title}
                                            />
                                        ) : (
                                            <>
                                                <div className="cover-texture"></div>
                                                <div className="cover-overlay"></div>
                                                <div className="cover-content">
                                                    <span className="cover-emoji">{getCategoryEmoji(book.category)}</span>
                                                    <span className="category-badge">
                                                        {book.category}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="book-info">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">{book.author}</p>

                                        <div className="book-meta">
                                            <div className="book-rating">
                                                <Star className="rating-icon" size={12} /> {book.rating || 4.5}
                                            </div>
                                            <div className="book-stats">
                                                <span className="stat-item"><Eye className="stat-icon" size={12} /> {book.pageCount || '---'}</span>
                                                <span className="stat-item"><Zap className="stat-icon" size={12} /> {book.language || 'EN'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

        </div>
    );
};

export default ReaderDashboard;

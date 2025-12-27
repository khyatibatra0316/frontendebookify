import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getBook, deleteBook, BASE_URL } from '../services/bookService';
import { ArrowLeft, Type, Heart, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';
import './ReadingInterface.css';

const ReadingInterface = ({ book: propBook }) => {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const { user } = useUser();
    const [book, setBook] = useState(propBook);
    const [loading, setLoading] = useState(!propBook);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!propBook && bookId) {
            fetchBook();
        }
    }, [bookId, propBook]);

    const fetchBook = async () => {
        try {
            setLoading(true);
            const response = await getBook(bookId);
            if (response.success) {
                setBook(response.book);
            }
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBook = async () => {
        try {
            setDeleting(true);
            await deleteBook(book._id);
            navigate('/writer');
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    const isBookOwner = user && book && book.writerId &&
        (book.writerId._id === user._id || book.writerId === user._id);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner-reading"></div>
                    <p className="loading-text-reading">LOADING CONTENT...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <p className="not-found-text">Book not found</p>
                    <button
                        onClick={() => navigate('/reader')}
                        className="return-link"
                    >
                        Return to EBookify
                    </button>
                </div>
            </div>
        );
    }

    const getCategoryEmoji = (category) => {
        const emojis = {
            'Sci-Fi': '',
            'Cyberpunk': '',
            'Non-Fiction': '',
            'Romance': '',
            'Adventure': '',
            'Cooking': '',
            'Thriller': '',
            'Fantasy': '',
            'Fiction': '',
            'Technical': '',
        };
        return emojis[category] || '📖';
    };

    return (
        <div className="reading-interface">
            <div className="reading-header">
                <div className="header-left-section">
                    <button
                        onClick={() => navigate('/reader')}
                        className="return-button"
                    >
                        <div className="return-icon-wrapper">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="return-text">Return</span>
                    </button>
                </div>

                <div className="header-center">
                    <span className="connection-label">Secure Connection</span>
                    <h2 className="book-title-header">{book.title}</h2>
                </div>

                <div className="header-actions">
                    <button className="action-button"><Type size={18} /></button>
                    <button className="action-button"><Heart size={18} /></button>
                    {isBookOwner && (
                        <>
                            <div className="header-divider-vertical"></div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="action-button delete-button"
                                title="Delete Book"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                    <div className="header-divider-vertical"></div>
                    <div className="progress-text">0% READ</div>
                </div>
            </div>

            <div className="reading-canvas">
                <div className="ambient-glow"></div>

                <header className="book-header">
                    <div className="cover-container">
                        {book.coverImage ? (
                            <img
                                src={`${BASE_URL}${book.coverImage}`}
                                alt={book.title}
                                className="cover-image"
                            />
                        ) : (
                            <div className="cover-emoji-large">{getCategoryEmoji(book.category)}</div>
                        )}
                    </div>
                    <h1 className="book-title-main">{book.title}</h1>
                    <p className="book-author-main">{book.author}</p>
                </header>

                <article className="article-content">
                    {book.description && (
                        <p className="lead-paragraph">
                            <span className="drop-cap">
                                {book.description.charAt(0)}
                            </span>
                            {book.description.slice(1)}
                        </p>
                    )}

                    {book.fileUrl ? (
                        <div className="file-access-box">
                            <p className="file-access-text">This book is available for reading.</p>
                            <a
                                href={`${BASE_URL}${book.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="open-file-button"
                            >
                                Open Book File
                                <ChevronRight size={16} />
                            </a>
                        </div>
                    ) : (
                        <p className="no-content-text">
                            Book content preview not available. Please contact the author for access.
                        </p>
                    )}

                    {book.isbn && (
                        <div className="isbn-box">
                            <p className="isbn-label">ISBN</p>
                            <p className="isbn-value">{book.isbn}</p>
                        </div>
                    )}

                    <div className="metadata-grid">
                        {book.category && (
                            <div className="metadata-item">
                                <p className="metadata-label">Category</p>
                                <p className="metadata-value">{book.category}</p>
                            </div>
                        )}
                        {book.language && (
                            <div className="metadata-item">
                                <p className="metadata-label">Language</p>
                                <p className="metadata-value">{book.language}</p>
                            </div>
                        )}
                        {book.pageCount && (
                            <div className="metadata-item">
                                <p className="metadata-label">Pages</p>
                                <p className="metadata-value">{book.pageCount}</p>
                            </div>
                        )}
                        {book.status && (
                            <div className="metadata-item">
                                <p className="metadata-label">Status</p>
                                <p className="metadata-value">{book.status}</p>
                            </div>
                        )}
                    </div>
                </article>

                <div className="reading-footer">
                    <div className="footer-divider"></div>
                    <button
                        onClick={() => navigate('/reader')}
                        className="back-to-archive-button"
                    >
                        <span>Back to EBookify</span>
                        <ChevronRight className="back-arrow-icon" size={16} />
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <AlertTriangle className="warning-icon" size={48} />
                            <h2>Delete Book?</h2>
                        </div>
                        <p className="modal-text">
                            Are you sure you want to delete "{book.title}"? This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="modal-btn modal-btn-secondary"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBook}
                                className="modal-btn modal-btn-danger"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <div className="modal-spinner"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        Delete Forever
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="progress-bar"></div>
        </div>
    );
};

export default ReadingInterface;

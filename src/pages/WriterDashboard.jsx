import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getWriterBooks, deleteBook } from '../services/bookService';
import BookUploadForm from '../components/BookUploadForm';
import BookEditModal from '../components/BookEditModal';
import BookCard from '../components/BookCard';
import { Plus, BookOpen, TrendingUp, Users, UserCircle } from 'lucide-react';

const WriterDashboard = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [stats, setStats] = useState({
        totalBooks: 0,
        published: 0,
        drafts: 0,
    });

    useEffect(() => {
        if (user?._id) {
            fetchBooks();
        }
    }, [user]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await getWriterBooks(user._id);
            if (response.success) {
                setBooks(response.books);
                calculateStats(response.books);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (booksList) => {
        setStats({
            totalBooks: booksList.length,
            published: booksList.filter(b => b.status === 'published').length,
            drafts: booksList.filter(b => b.status === 'draft').length,
        });
    };

    const handleBookUploaded = () => {
        setShowUploadForm(false);
        fetchBooks();
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(bookId);
                fetchBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    const handleEditBook = (bookId) => {
        const book = books.find(b => b._id === bookId);
        if (book) {
            setEditingBook(book);
            setShowEditModal(true);
        }
    };

    const handleBookUpdated = () => {
        setShowEditModal(false);
        setEditingBook(null);
        fetchBooks();
    };

    if (showUploadForm) {
        return <BookUploadForm onClose={() => setShowUploadForm(false)} onSuccess={handleBookUploaded} />;
    }

    if (showEditModal && editingBook) {
        return <BookEditModal book={editingBook} onClose={() => setShowEditModal(false)} onSuccess={handleBookUpdated} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Writer Dashboard</h1>
                            <p className="text-purple-200 mt-1">Welcome back, {user?.name || 'Writer'}!</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all border border-white/20"
                                title="Profile"
                            >
                                <UserCircle size={20} />
                            </button>
                            <button
                                onClick={() => setShowUploadForm(true)}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus size={20} />
                                Upload New Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm font-medium">Total Books</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.totalBooks}</p>
                            </div>
                            <div className="bg-blue-500 p-4 rounded-full">
                                <BookOpen size={32} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm font-medium">Published</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.published}</p>
                            </div>
                            <div className="bg-green-500 p-4 rounded-full">
                                <TrendingUp size={32} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm font-medium">Drafts</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats.drafts}</p>
                            </div>
                            <div className="bg-yellow-500 p-4 rounded-full">
                                <Users size={32} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Your Books</h2>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                            <p className="text-purple-200 mt-4">Loading your books...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                            <BookOpen size={64} className="text-purple-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No books yet</h3>
                            <p className="text-purple-200 mb-6">Start by uploading your first book!</p>
                            <button
                                onClick={() => setShowUploadForm(true)}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all"
                            >
                                <Plus size={20} />
                                Upload Your First Book
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {books.map((book) => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onDelete={handleDeleteBook}
                                    onEdit={handleEditBook}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default WriterDashboard;

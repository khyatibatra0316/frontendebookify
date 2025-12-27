import { Trash2, Edit, Eye } from 'lucide-react';
import { BASE_URL } from '../services/bookService';

const BookCard = ({ book, onDelete, onEdit }) => {
    const getStatusColor = (status) => {
        return status === 'published'
            ? 'bg-green-500/20 text-green-300 border-green-500/50'
            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-1">
            {/* Book Cover */}
            <div className="h-64 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                {book.coverImage ? (
                    <img
                        src={`${BASE_URL}${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-6xl font-bold opacity-50">
                            {book.title?.charAt(0) || 'B'}
                        </span>
                    </div>
                )}

   
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(book.status)}`}>
                        {book.status}
                    </span>
                </div>
            </div>

       
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{book.title}</h3>
                <p className="text-purple-200 text-sm mb-1">by {book.author}</p>
                {book.category && (
                    <p className="text-purple-300 text-xs mb-3">
                        <span className="bg-purple-500/30 px-2 py-1 rounded">{book.category}</span>
                    </p>
                )}

                {book.description && (
                    <p className="text-purple-100 text-sm mb-4 line-clamp-2">{book.description}</p>
                )}

               
                <div className="flex gap-4 text-xs text-purple-200 mb-4">
                    {book.pageCount && <span>📖 {book.pageCount} pages</span>}
                    {book.language && <span>🌐 {book.language}</span>}
                </div>

       
                <div className="flex gap-2">
                    {book.fileUrl && (
                        <a
                            href={`${BASE_URL}${book.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Eye size={16} />
                            View
                        </a>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(book._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(book._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;

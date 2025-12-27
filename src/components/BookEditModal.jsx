import { useState, useEffect } from 'react';
import { updateBook } from '../services/bookService';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';

const BookEditModal = ({ book, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        description: book?.description || '',
        category: book?.category || '',
        isbn: book?.isbn || '',
        pageCount: book?.pageCount || '',
        language: book?.language || 'English',
        price: book?.price || '',
        status: book?.status || 'draft'
    });
    const [bookFile, setBookFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (name === 'bookFile') {
                setBookFile(files[0]);
            } else if (name === 'coverImage') {
                setCoverImage(files[0]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                ...formData,
                pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
            };

            // Add files if they were changed
            if (bookFile) {
                updateData.bookFile = bookFile;
            }
            if (coverImage) {
                updateData.coverImage = coverImage;
            }

            const response = await updateBook(book._id, updateData);
            if (response.success) {
                alert('Book updated successfully!');
                onSuccess();
            }
        } catch (error) {
            console.error('Update error:', error);
            alert(error.error || 'Failed to update book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-purple-500/30 my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">Edit Book</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Current Files Info */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <p className="text-purple-200 text-sm mb-2">
                            <strong>Current Cover:</strong> {book?.coverImage ? 'Uploaded' : 'None'}
                        </p>
                        <p className="text-purple-200 text-sm">
                            <strong>Current Book File:</strong> {book?.fileUrl ? 'Uploaded' : 'None'}
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            <ImageIcon size={20} className="inline mr-2" />
                            Update Cover Image (optional)
                        </label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                        />
                        {coverImage && (
                            <p className="text-purple-200 text-sm mt-2">New: {coverImage.name}</p>
                        )}
                    </div>

                    {/* Book File */}
                    <div>
                        <label className="block text-white font-semibold mb-2">
                            <Upload size={20} className="inline mr-2" />
                            Update Book File (optional)
                        </label>
                        <input
                            type="file"
                            name="bookFile"
                            accept=".pdf,.epub"
                            onChange={handleFileChange}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                        />
                        {bookFile && (
                            <p className="text-purple-200 text-sm mt-2">New: {bookFile.name}</p>
                        )}
                    </div>

                    {/* Title & Author */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white font-semibold mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="Enter book title"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Author *</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="Enter author name"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                            placeholder="Enter book description"
                        />
                    </div>

                    {/* Category, ISBN, Language */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white font-semibold mb-2">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="e.g., Fiction"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">ISBN</label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="ISBN number"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Language</label>
                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="English"
                            />
                        </div>
                    </div>

                    {/* Page Count, Price, Status */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white font-semibold mb-2">Page Count</label>
                            <input
                                type="number"
                                name="pageCount"
                                value={formData.pageCount}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="Number of pages"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                            >
                                <option value="draft" className="bg-slate-800">Draft</option>
                                <option value="published" className="bg-slate-800">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookEditModal;

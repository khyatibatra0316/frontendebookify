import { useState } from 'react';
import { uploadBook } from '../services/bookService';
import { useUser } from '../context/UserContext';
import { X, Upload, Book, Image as ImageIcon } from 'lucide-react';

const BookUploadForm = ({ onClose, onSuccess }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        isbn: '',
        pageCount: '',
        language: 'English',
        price: '',
        status: 'draft'
    });
    const [bookFile, setBookFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [dragActive, setDragActive] = useState(false);

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

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf' || file.name.endsWith('.epub')) {
                setBookFile(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bookFile) {
            alert('Please select a book file to upload');
            return;
        }

        setLoading(true);
        try {
            const uploadData = {
                ...formData,
                bookFile,
                coverImage,
                pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
                price: formData.price ? parseFloat(formData.price) : undefined,
            };

            const response = await uploadBook(uploadData);
            if (response.success) {
                alert('Book uploaded successfully!');
                onSuccess();
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.error || 'Failed to upload book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                   
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Upload New Book</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                ]
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                     ]
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                    ? 'border-purple-400 bg-purple-500/20'
                                    : 'border-purple-300/50 bg-white/5'
                                }`}
                        >
                            <Upload size={48} className="text-purple-300 mx-auto mb-4" />
                            <p className="text-white font-semibold mb-2">
                                {bookFile ? bookFile.name : 'Drop your book file here or click to browse'}
                            </p>
                            <p className="text-purple-200 text-sm mb-4">Supports PDF and EPUB (max 50MB)</p>
                            <input
                                type="file"
                                name="bookFile"
                                accept=".pdf,.epub"
                                onChange={handleFileChange}
                                className="hidden"
                                id="bookFile"
                            />
                            <label
                                htmlFor="bookFile"
                                className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                                Select Book File
                            </label>
                        </div>

                        
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <ImageIcon size={20} className="inline mr-2" />
                                Cover Image
                            </label>
                            <input
                                type="file"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                            />
                            {coverImage && (
                                <p className="text-purple-200 text-sm mt-2">Selected: {coverImage.name}</p>
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
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Uploading...' : 'Upload Book'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookUploadForm;

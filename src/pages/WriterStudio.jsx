import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { uploadBook } from '../services/bookService';
import { ArrowLeft, FileText } from 'lucide-react';
import './WriterStudio.css';

const WriterStudio = () => {
    const navigate = useNavigate();
    const { user, selectRole } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        description: '',
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
                status: 'published'
            };

            const response = await uploadBook(uploadData);
            if (response.success) {
                alert('Book uploaded successfully!');
                setFormData({ title: '', author: '', category: '', description: '' });
                setBookFile(null);
                setCoverImage(null);
                document.getElementById('bookFile').value = '';
                document.getElementById('coverImage').value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.error || 'Failed to upload book');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        selectRole(null);
        navigate('/');
    };

    return (
        <div className="writer-studio">
            <header className="writer-header">
                <div className="header-left">
                    <button onClick={handleBack} className="back-button">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-divider"></div>
                    <h1 className="header-title">EBookify<span className="header-title-accent"></span></h1>
                </div>
                <div className="header-right">
                    <div className="sync-badge">
                        <div className="sync-dot"></div>
                        <span className="sync-text">SYNCED</span>
                    </div>
                    <div className="profile-avatar"></div>
                </div>
            </header>

            <main className="writer-main">
                <form onSubmit={handleSubmit} className="writer-form">
                    <div className="form-header">
                        <h2>Initialize Project</h2>
                        <p>Metadata required for public indexing.</p>
                    </div>

                    <div className="form-content">
                        <div className="input-group">
                            <div className="form-field">
                                <label className="form-label form-label-primary"> Name of the Book</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="title-input"
                                    placeholder="ENTER TITLE..."
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label className="form-label">Name of the Author</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                        className="standard-input"
                                        placeholder="Author Name"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Genre</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="standard-select"
                                    >
                                        <option value="">Select Protocol...</option>
                                        <option value="Sci-Fi">Sci-Fi</option>
                                        <option value="Cyberpunk">Cyberpunk</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Adventure">Adventure</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Synopsis</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="textarea-field"
                                    placeholder="Data summary..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="file-upload-wrapper">
                            <div className="file-upload-glow"></div>
                            <label htmlFor="bookFile" className="file-upload-area">
                                <div className="upload-grid-bg"></div>

                                <div className="upload-icon-container">
                                    <FileText className="upload-icon" size={24} />
                                </div>
                                <p className="upload-text-primary">
                                    {bookFile ? bookFile.name : 'Upload Source File'}
                                </p>
                                <p className="upload-text-secondary">.PDF / .EPUB (MAX 50MB)</p>
                                <input
                                    type="file"
                                    id="bookFile"
                                    name="bookFile"
                                    accept=".pdf,.epub"
                                    onChange={handleFileChange}
                                    className="file-input-hidden"
                                />
                            </label>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Cover Image (Optional)</label>
                            <input
                                type="file"
                                id="coverImage"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cover-image-input"
                            />
                            {coverImage && (
                                <p className="file-selected-text">Selected: {coverImage.name}</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="abort-button"
                            >
                                [ Abort ]
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? 'DEPLOYING...' : 'Deploy to Network'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default WriterStudio;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateProfile, deleteAccount } from '../services/userService';
import { ArrowLeft, User, Mail, Lock, Save, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useUser();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                name: formData.name,
                email: formData.email
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await updateProfile(updateData);

            if (response.success) {
                setUser(response.user);
                setSuccess('Profile updated successfully!');
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: ''
                });
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            const response = await deleteAccount();

            if (response.success) {
                logout();
                navigate('/');
            } else {
                setError(response.message || 'Failed to delete account');
                setShowDeleteConfirm(false);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while deleting account');
            setShowDeleteConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <button onClick={handleBack} className="back-button">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="profile-title">
                        <User className="title-icon" size={28} />
                        Profile Settings
                    </h1>
                </div>

                {/* Profile Form */}
                <div className="profile-content">
                    <form onSubmit={handleSubmit} className="profile-form">
                        {error && (
                            <div className="alert alert-error">
                                <AlertTriangle size={18} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                {success}
                            </div>
                        )}

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">
                                <User size={16} />
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">
                                <Lock size={16} />
                                New Password (optional)
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        {/* Confirm Password */}
                        {formData.password && (
                            <div className="form-group">
                                <label className="form-label">
                                    <Lock size={16} />
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Confirm your new password"
                                />
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>

                    {/* Account Actions */}
                    <div className="account-actions">
                        <h2 className="section-title">Account Actions</h2>

                        <button
                            onClick={handleLogout}
                            className="btn btn-logout"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn btn-danger"
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <AlertTriangle className="warning-icon" size={48} />
                            <h2>Delete Account?</h2>
                        </div>
                        <p className="modal-text">
                            This action cannot be undone. All your data, including uploaded books, will be permanently deleted.
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="btn btn-danger"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
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
        </div>
    );
};

export default ProfilePage;

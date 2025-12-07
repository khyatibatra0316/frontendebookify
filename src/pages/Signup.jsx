import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import authService from '../services/authService';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const { login: loginUser } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'reader'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            );

            if (response.success) {
                // Update UserContext with user data
                loginUser(response.user, response.token);

                // Redirect based on role
                if (response.user.role === 'writer') {
                    navigate('/writer');
                } else {
                    navigate('/reader');
                }
            } else {
                setError(response.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-bg-blob-1"></div>
            <div className="signup-bg-blob-2"></div>

            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <div className="signup-badge">
                            <span className="signup-badge-dot"></span>
                            New Account
                        </div>
                        <h1 className="signup-title">Create Account</h1>
                        <p className="signup-subtitle">Join the eBookify community today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {error && (
                            <div className="signup-error">
                                {error}
                            </div>
                        )}

                        <div className="signup-field">
                            <label htmlFor="name" className="signup-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="signup-input"
                                required
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="email" className="signup-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="signup-input"
                                required
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="password" className="signup-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="signup-input"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="role" className="signup-label">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="signup-select"
                                required
                            >
                                <option value="reader">Reader</option>
                                <option value="writer">Writer</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p className="signup-footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="signup-footer-link">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

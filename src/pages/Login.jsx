import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login: loginUser } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await authService.login(formData.email, formData.password);

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
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-blob-1"></div>
            <div className="login-bg-blob-2"></div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-badge">
                            <span className="login-badge-dot"></span>
                            Secure Access
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <div className="login-field">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="login-input"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password" className="login-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="login-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="login-footer-text">
                            Don't have an account?{' '}
                            <Link to="/signup" className="login-footer-link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

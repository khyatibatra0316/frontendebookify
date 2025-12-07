import { useUser } from '../context/UserContext';
import { Book, Upload, ArrowLeft } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const { selectRole } = useUser();

    const handleRoleSelect = (role) => {
        selectRole(role);
    };

    return (
        <div className="landing-page">
            <div className="bg-blob-purple" />
            <div className="bg-blob-cyan" />
            <div className="landing-content">
                <header className="landing-header">
                    <div className="system-badge">
                        <span className="pulse-dot"></span>
                        Your Favourite Platform
                    </div>
                    <h1 className="main-title">
                        EBookify<br />
                    </h1>
                    <p className="subtitle">
                        Decentralized knowledge repository. <br className="hidden md:block" />
                        Upload consciousness. Download worlds.
                    </p>
                </header>

                <div className="role-cards-grid">
                    <button
                        onClick={() => handleRoleSelect('reader')}
                        className="role-card reader"
                    >
                        <div className="role-card-gradient" />

                        <div className="role-card-content">
                            <div className="role-card-header">
                                <div className="role-icon-container">
                                    <Book className="role-icon" size={32} />
                                </div>
                                <ArrowLeft className="role-arrow" size={32} />
                            </div>

                            <div className="role-card-footer">
                                <h2>READ</h2>
                                <p>Access the archives.</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('writer')}
                        className="role-card writer"
                    >
                        <div className="role-card-gradient" />

                        <div className="role-card-content">
                            <div className="role-card-header">
                                <div className="role-icon-container">
                                    <Upload className="role-icon" size={32} />
                                </div>
                                <ArrowLeft className="role-arrow" size={32} />
                            </div>

                            <div className="role-card-footer">
                                <h2>WRITE</h2>
                                <p>Contribute data.</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

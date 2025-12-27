import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriterStudio from './pages/WriterStudio';
import ReaderDashboard from './pages/ReaderDashboard';
import ReadingInterface from './pages/ReadingInterface';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useUser();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-content">
          <div className="app-loading-spinner"></div>
          <p className="app-loading-text">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

// Main app content
const AppContent = () => {
  const { role } = useUser();
  const [currentBook, setCurrentBook] = useState(null);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={role ? <Navigate to={`/${role}`} replace /> : <LandingPage />}
      />
      <Route
        path="/writer"
        element={
          <ProtectedRoute requiredRole="writer">
            <WriterStudio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reader"
        element={
          <ProtectedRoute requiredRole="reader">
            <ReaderDashboard onBookSelect={setCurrentBook} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/read/:bookId"
        element={
          <ProtectedRoute requiredRole="reader">
            <ReadingInterface book={currentBook} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;


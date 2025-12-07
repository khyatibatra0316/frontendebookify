import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const storedRole = localStorage.getItem('userRole');
        const storedUser = localStorage.getItem('userData');

        if (storedRole && storedUser) {
            setRole(storedRole);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const selectRole = (selectedRole) => {
        setRole(selectedRole);
        localStorage.setItem('userRole', selectedRole);
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userData', JSON.stringify(userData));
        if (userData.role) {
            setRole(userData.role);
            localStorage.setItem('userRole', userData.role);
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
    };

    const value = {
        user,
        role,
        isAuthenticated,
        loading,
        selectRole,
        login,
        logout,
        setUser
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { BookOpen, PenTool } from 'lucide-react';

const RoleSelection = () => {
    const { selectRole } = useUser();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        selectRole(role);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Welcome to eBookify</h1>
                    <p className="text-xl text-purple-200">Choose your role to get started</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div
                        onClick={() => handleRoleSelect('reader')}
                        className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 border-2 ${selectedRole === 'reader' ? 'border-blue-400 shadow-2xl shadow-blue-500/50' : 'border-transparent'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-blue-500 p-6 rounded-full mb-6 shadow-lg">
                                <BookOpen size={48} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Reader</h2>
                            <p className="text-purple-200 text-lg mb-6">
                                Discover and read thousands of books. Build your personal library and enjoy seamless reading experience.
                            </p>
                            <ul className="text-left text-purple-100 space-y-2">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Browse book collections
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Read online
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Create reading lists
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Track reading progress
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Writer Card */}
                    <div
                        onClick={() => handleRoleSelect('writer')}
                        className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 border-2 ${selectedRole === 'writer' ? 'border-pink-400 shadow-2xl shadow-pink-500/50' : 'border-transparent'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-pink-500 p-6 rounded-full mb-6 shadow-lg">
                                <PenTool size={48} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Writer</h2>
                            <p className="text-purple-200 text-lg mb-6">
                                Share your stories with the world. Upload and manage your books with our powerful writer dashboard.
                            </p>
                            <ul className="text-left text-purple-100 space-y-2">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Upload your books
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Manage publications
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Track reader engagement
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> Analytics dashboard
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {selectedRole && (
                    <div className="mt-8 text-center">
                        <p className="text-white text-lg">
                            Selected: <span className="font-bold capitalize">{selectedRole}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSelection;

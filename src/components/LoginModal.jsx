import React, { useState } from 'react';
import { X, Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(usernameOrEmail, password);
      if (result.success) {
        toast.success('Login successful!');
        onClose();
        navigate('/admin');
        setUsernameOrEmail('');
        setPassword('');
      } else {
        setError(result.error || 'Invalid credentials');
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-[hsl(var(--border-black))] animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[hsl(var(--text-black))/0.4] hover:text-[hsl(var(--red))] hover:bg-[hsl(var(--red))/0.1] rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b-2 border-[hsl(var(--border-black))/0.1]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[hsl(var(--red))] rounded-xl">
              <Lock className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[hsl(var(--text-black))]">Admin Login</h2>
              <p className="text-sm text-[hsl(var(--text-black))/0.6]">Enter your credentials to continue</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Username/Email Field */}
          <div>
            <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-[hsl(var(--text-black))/0.4]" size={20} />
              </div>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                         focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                         text-[hsl(var(--text-black))] font-medium"
                placeholder="Enter username or email"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-[hsl(var(--text-black))/0.4]" size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                         focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                         text-[hsl(var(--text-black))] font-medium"
                placeholder="Enter password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white rounded-xl font-bold
                     shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95
                     transition-all duration-200 flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <LogIn size={20} />
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

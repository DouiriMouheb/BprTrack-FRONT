import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, User, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Load saved username if exists
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      
      // Save username if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--bg))] via-[hsl(var(--bg))] to-[hsl(var(--accent))/0.05] p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[hsl(var(--accent))/0.1] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(var(--accent))/0.1] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Login Card */}
  <div className="bg-black backdrop-blur-xl rounded-2xl shadow-2xl border border-[hsl(var(--accent))/0.5] overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[hsl(var(--accent))/0.1] to-[hsl(var(--accent))/0.1] p-8 text-center border-b border-[hsl(var(--accent))/0.5]">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))] rounded-2xl mb-4 shadow-lg">
              <Lock className="text-[hsl(var(--text))]" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-[hsl(var(--text))] mb-2">
              BprTrack
            </h1>
            <p className="text-[hsl(var(--text))]">Welcome back! Please sign in to continue</p>
          </div>
          
          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-[hsl(var(--text))]">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-[hsl(var(--text))] group-focus-within:text-[hsl(var(--accent))] transition-colors" size={20} />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full pl-10 pr-4 py-3 bg-[hsl(var(--panel))/0.5] border-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))/0.2] transition-all text-[hsl(var(--text))] placeholder:text-[hsl(var(--text))]"
                    placeholder="Enter your username"
                    disabled={loading}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[hsl(var(--text))]">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-[hsl(var(--text))] group-focus-within:text-[hsl(var(--accent))] transition-colors" size={20} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-10 pr-12 py-3 bg-[hsl(var(--panel))/0.5] border-[hsl(var(--accent))] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))/0.2] transition-all text-[hsl(var(--text))] placeholder:text-[hsl(var(--text))]"
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--text))] hover:text-[hsl(var(--accent))] transition-colors"
                    disabled={loading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[hsl(var(--accent))] text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))] focus:ring-2 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-[hsl(var(--text))] group-hover:text-[hsl(var(--accent))] transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))/0.8] font-medium transition-colors"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="btn btn-primary w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-[hsl(var(--text))]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--accent))]"></div>
              </div>
            </div>

            {/* Sign Up Link */}  <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[hsl(var(--panel))] text-[hsl(var(--text))]">
                  New to BprTrack?
                </span>
              </div>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-[hsl(var(--text))] hover:text-[hsl(var(--accent))] transition-colors font-medium"
                disabled={loading}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[hsl(var(--text))]">
          <p>© 2025 BprTrack. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

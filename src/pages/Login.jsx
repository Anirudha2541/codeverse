import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password should be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_35%),radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.2),_transparent_20%),linear-gradient(180deg,_#020617,_#0f172a)]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid w-full gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="mb-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Authentication</p>
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">Login to your dashboard</h1>
                <p className="max-w-xl text-slate-400">Securely sign in to view user analytics, form submissions, and logic test tools built with React and Tailwind CSS.</p>
              </div>
              <div className="space-y-4 rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6">
                <h2 className="text-xl font-semibold text-white">Enter your credentials</h2>
                <p className="text-sm text-slate-400">Use the demo credentials below if needed.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="mb-8 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-300/80">Welcome Back</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in securely</h2>
                <p className="mt-2 text-sm text-slate-400">Access the dashboard with basic auth validation and token storage.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="user@example.com"
                  />
                  {errors.email && <p className="text-sm text-rose-400">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-sm text-rose-400">{errors.password}</p>}
                </div>

                {apiError && <p className="text-center text-sm text-rose-400">{apiError}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
                <p className="font-semibold text-slate-100">Demo credentials</p>
                <div className="mt-3 space-y-1">
                  <p><span className="font-medium text-slate-200">Email:</span> user@example.com</p>
                  <p><span className="font-medium text-slate-200">Password:</span> password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

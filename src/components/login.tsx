import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import useTaskStore from '@/lib/store/task-store';

export default function Login() {
  const router = useRouter();
  const { setUserId } = useTaskStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        console.log('data3333', data);
        setUserId(data.user.id);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="DayTaskSync Logo"
              width={32}
              height={32}
              className="h-[32px] w-[32px]"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">
              Day Task Sync
            </span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {authMode === 'signin' ? 'Login' : 'Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {authMode === 'signin'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() =>
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
              }
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {authMode === 'signin' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : authMode === 'signin' ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </button>

          {authMode === 'signin' && (
            <div className="text-center">
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { GoogleLogin } from '@react-oauth/google';
import { FileSpreadsheet, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/auth/google', {
        token: credentialResponse.credential,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication with Google failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-in failed. Please verify your internet connection and try again.');
  };

  const handleDevLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/auth/dev-login');
      login(response.data.token, response.data.user, true); // true = Guest session (sessionStorage)
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Development mock login failed. Ensure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-100 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center shadow-lg shadow-blue-200">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to HireForm
          </h2>
          <p className="text-slate-500 text-sm">
            Create tailored application forms and streamline your candidate pipeline.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Signing you in...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center border border-slate-200 rounded-xl p-2 bg-slate-50 shadow-sm hover:border-slate-300 transition-all">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  text="signin_with"
                />
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-250 w-full border-slate-200"></div>
                <span className="absolute px-3 bg-white text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Or Test Locally
                </span>
              </div>

              <button
                type="button"
                onClick={handleDevLogin}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold rounded-2xl transition-all shadow-sm group"
              >
                <ShieldCheck className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Sign in as Guest Recruiter</span>
                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Designed for recruiters. No complex requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

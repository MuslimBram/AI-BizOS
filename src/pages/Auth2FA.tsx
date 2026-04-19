import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export function Auth2FA() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { verify2FA, user } = useAuth();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate 2FA verification network delay
    setTimeout(() => {
      verify2FA();
      setLoading(false);
      
      // Gatekeeper Logic based on Role and Status
      if (user?.role === 'admin' || user?.role === 'owner') {
        navigate('/dashboard'); // Admins bypass
      } else if (user?.status === 'trial' || user?.status === 'active') {
        navigate('/dashboard'); // Active users and 7-day trial granted
      } else {
        navigate('/pending-approval'); // Pending users who need AI parsing or admin payment approval
      }

    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Two-Factor Authentication</h2>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Please enter the 6-digit security code from your authenticator app to continue.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5 text-center">
                Authentication Code
              </label>
              <div className="mt-1 flex justify-center">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full max-w-[200px] text-center tracking-[0.5em] text-2xl px-3 py-3 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:text-slate-400"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center shadow-sm shadow-blue-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
              </button>
            </div>
            
            <p className="mt-4 text-center text-sm text-slate-500">
              Didn't receive a code? <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Resend</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

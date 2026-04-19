import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../lib/firebase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Drejto tek hapi i verifikimit te dyfishte (2FA) me pare 
      navigate('/2fa');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('Failed to log in. ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setError('Google Auth Provider missing');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/2fa'); // Te njejten gje dhe per Google, e kalojme dhenien nga 2fa
    } catch (err: any) {
      console.log(err);
      setError('Google Sign In failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    if (!auth || !appleProvider) {
      setError('Apple Auth Provider missing');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, appleProvider);
      navigate('/2fa');
    } catch (err: any) {
      console.log(err);
      setError('Apple Sign In failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
          <p className="text-sm text-slate-500">Enter your credentials to sign in</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-900">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-[#22c55e] hover:text-green-600">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#22c55e] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e] transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400 tracking-wider">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                type="button" 
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" alt="Google" />
                Continue with Google
              </button>
              <button 
                type="button" 
                onClick={signInWithApple}
                disabled={loading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701z"/></svg>
                Continue with Apple
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="font-semibold text-[#22c55e] hover:text-green-600">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

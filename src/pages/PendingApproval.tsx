import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, Zap, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function PendingApproval() {
  const { user, updateUserContext } = useAuth();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);

  const simulateAIVerification = () => {
    setVerifying(true);
    setTimeout(async () => {
      if (user && db) {
        try {
          // AI Verifikoi pagesen / Admin aprovoi - updejt databaze
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, { status: 'active' });
          // Update local context
          updateUserContext({ ...user, status: 'active' });
          setVerifying(false);
          navigate('/dashboard');
        } catch(e) {
          console.error(e);
          setVerifying(false);
        }
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Account Pending</h2>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Your account request is currently pending verification.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-xl border border-slate-100">
          
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Registration Details</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-900">{user?.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-medium text-slate-900">{user?.accountType || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Plan Chosen:</span>
                <span className="font-medium inline-flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  <Zap className="w-3 h-3 mr-1" /> {user?.plan || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-medium text-slate-900">{user?.duration || 'N/A'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
            <h4 className="text-sm font-semibold flex items-center text-slate-800 mb-2">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-500" /> What's next?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We are waiting for payment verification or Admin approval. 
              Our <b>AI System</b> sweeps for completed transactions every 15 minutes. 
              Alternatively, an Admin can manually approve your account.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
             <button
                onClick={simulateAIVerification}
                disabled={verifying}
                className="mt-6 w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center shadow-sm shadow-indigo-500/20"
              >
                {verifying ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> AI Verifying Payment...</> : <><Bot className="w-5 h-5 mr-2" /> Simulate AI Payment Verification</>}
              </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

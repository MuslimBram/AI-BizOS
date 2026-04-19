import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Building2, 
  Briefcase, 
  Users, 
  Check, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, appleProvider, db } from '../lib/firebase';

type AccountType = 'Business' | 'Freelancer' | 'Ambassador' | null;
type PlanType = 'Start' | 'Growth' | 'Professional' | 'Enterprise' | null;
type DurationType = 'Trial' | 'Monthly' | '3 Months' | '6 Months' | 'Yearly' | null;

const BASE_PRICES = {
  Start: 49,
  Growth: 99,
  Professional: 199,
  Enterprise: 399
};

export function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [plan, setPlan] = useState<PlanType>('Start');
  const [duration, setDuration] = useState<DurationType>('Trial');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      setError('Firebase is not configured. Te lutem konfiguro firebase config.');
      return;
    }
    if (step === 3 && !termsAccepted) {
      setError('You must accept the conditions to register.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      const isOwner = email.toLowerCase() === 'muslimani181@gmail.com';

      try {
        // Save full data to Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          id: userCredential.user.uid,
          email: email,
          name: fullName,
          role: isOwner ? 'admin' : 'user', 
          accountType: accountType,
          plan: plan || 'None',
          duration: duration || 'Trial',
          status: isOwner ? 'active' : (duration === 'Trial' ? 'trial' : 'pending'),
          createdAt: serverTimestamp()
        });
      } catch (err: any) {
        console.error("Firestore SetDoc error:", err);
        // We still let them navigate since their Firebase Auth succeeded 
        if(err.message?.includes('the client is offline')) {
           console.warn("Firestore offline - user auth created successfully, basic session will be used");
        } else {
           throw err; // throw higher to the main block
        }
      }

      navigate('/2fa');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ky email ekziston tashmë.');
      } else if (err.code === 'auth/weak-password') {
        setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Auth Configuration missing: Të lutem aktivizo Email/Password në Firebase console.');
      } else {
        setError('Registration failed. ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setError('Google Auth Provider missing');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Note: Because Google assigns standard credentials, we handle the document 
      // creation inside AuthContext fallback if the user is completely new.
      // Or we can manually enforce they pass through step 3 in an ideal world.
      await signInWithPopup(auth, googleProvider);
      navigate('/2fa');
    } catch (err: any) {
      console.log(err);
      setError('Google Sign In failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const registerWithApple = async () => {
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

  const currentPrice = plan ? BASE_PRICES[plan] : 49;

  const durationOptions = [
    { id: 'Trial', name: '7-Day Trial', right: '€0', label: 'Free', multiplier: 0 },
    { id: 'Monthly', name: 'Monthly', right: `€${currentPrice}/mo`, multiplier: 1 },
    { id: '3 Months', name: '3 Months', label: 'Save 5%', right: `€${(currentPrice * 0.95).toFixed(2)}/mo`, multiplier: 0.95 },
    { id: '6 Months', name: '6 Months', label: 'Save 10%', right: `€${(currentPrice * 0.90).toFixed(2)}/mo`, multiplier: 0.9 },
    { id: 'Yearly', name: 'Yearly', label: 'Save 15%', right: `€${(currentPrice * 0.85).toFixed(2)}/mo`, multiplier: 0.85 }
  ];

  const getStepTitle = () => {
    if (step === 1) return "Choose your account type";
    if (step === 2) return "Choose your billing plan";
    return "Fill in your details";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-[#22c55e] text-white shadow-md shadow-green-500/20 mb-4">
              <Zap className="size-6" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-sm text-slate-500 mt-1">{getStepTitle()}</p>
            
            {/* Progress Dots */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-6 bg-[#22c55e]' : 'w-2 bg-slate-200'}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-6 bg-[#22c55e]' : 'w-2 bg-slate-200'}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'w-6 bg-[#22c55e]' : 'w-2 bg-slate-200'}`}></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* STEP 1: ACCOUNT TYPE */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Business */}
                <div 
                  onClick={() => setAccountType('Business')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    accountType === 'Business' ? 'border-[#22c55e] ring-4 ring-green-50' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Building2 className={`w-8 h-8 mb-3 ${accountType === 'Business' ? 'text-[#22c55e]' : 'text-slate-600'}`} />
                    <h3 className="font-semibold text-lg mb-2">Business</h3>
                    <p className="text-xs text-slate-500 mb-4 h-12">Manage your business — inbox, CRM, marketing, AI, telephony & analytics in one platform</p>
                    <ul className="text-left text-xs space-y-1.5 text-slate-500 w-full">
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> Unified inbox</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> CRM & Pipeline</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> Personal AI assistant</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> Automated marketing</li>
                    </ul>
                  </div>
                </div>

                {/* Freelancer */}
                <div 
                  onClick={() => setAccountType('Freelancer')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    accountType === 'Freelancer' ? 'border-[#22c55e] ring-4 ring-green-50' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Briefcase className={`w-8 h-8 mb-3 ${accountType === 'Freelancer' ? 'text-[#22c55e]' : 'text-slate-600'}`} />
                    <h3 className="font-semibold text-lg mb-2">Freelancer</h3>
                    <p className="text-xs text-slate-500 mb-4 h-12">Manage client businesses — earn from referrals and management</p>
                    <ul className="text-left text-xs space-y-1.5 text-slate-500 w-full">
                       <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> 35% referral commission</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> 40% from management fee</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> Purchase plan per business</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> 7 day free trial</li>
                    </ul>
                  </div>
                </div>

                {/* Ambassador */}
                <div 
                  onClick={() => setAccountType('Ambassador')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    accountType === 'Ambassador' ? 'border-[#22c55e] ring-4 ring-green-50' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Users className={`w-8 h-8 mb-3 ${accountType === 'Ambassador' ? 'text-[#22c55e]' : 'text-slate-600'}`} />
                    <h3 className="font-semibold text-lg mb-2">Ambassador</h3>
                    <p className="text-xs text-slate-500 mb-4 h-12">Referrals only — earn lifetime commission without managing businesses</p>
                    <ul className="text-left text-xs space-y-1.5 text-slate-500 w-full">
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> 35% lifetime commission</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> Min. 3 referrals/month</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> No plan purchases needed</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#22c55e]" /> 7-day free trial</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (accountType === 'Ambassador' || accountType === 'Freelancer') {
                    setPlan(null);
                    setDuration('Trial');
                    setStep(3);
                  } else {
                    setStep(2);
                  }
                }}
                disabled={!accountType}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#6ee7b7] hover:bg-[#34d399] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}

           {/* STEP 2: BILLING PLAN */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
              {/* Plans */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Choose Plan</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'Start', price: '49' },
                    { name: 'Growth', price: '99', popular: true },
                    { name: 'Professional', price: '199' },
                    { name: 'Enterprise', price: '399' }
                  ].map((p) => (
                     <div 
                       key={p.name}
                       onClick={() => setPlan(p.name as PlanType)}
                       className={`relative p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                         plan === p.name ? 'border-[#22c55e] bg-green-50/30' : 'border-slate-100 hover:border-slate-300'
                       }`}
                     >
                       <div className="font-semibold text-sm mb-1">{p.name}</div>
                       <div className={`text-2xl font-bold ${plan === p.name ? 'text-[#22c55e]' : 'text-[#22c55e]'}`}>€{p.price}</div>
                       <div className="text-xs text-slate-400 mt-1">/mo</div>
                     </div>
                  ))}
                </div>
              </div>

              {/* Durations */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Choose Duration</h4>
                <div className="space-y-2">
                  {durationOptions.map((d) => (
                    <label 
                      key={d.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        duration === d.id ? 'border-[#22c55e] bg-green-50/20 ring-1 ring-[#22c55e]' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="duration" 
                          checked={duration === d.id}
                          onChange={() => setDuration(d.id as any)}
                          className="w-4 h-4 text-[#22c55e] border-slate-300 focus:ring-[#22c55e]"
                        />
                        <span className="font-medium text-sm text-slate-700">{d.name}</span>
                        {d.label && d.id !== 'Trial' && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {d.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{d.right}</span>
                        {d.label && d.id === 'Trial' && (
                          <span className="text-xs bg-[#22c55e] text-white px-2 py-0.5 rounded font-medium">
                            {d.label}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#6ee7b7] hover:bg-[#34d399] transition-all shadow-sm"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              
              {/* Top Summary */}
              <div className="bg-slate-50 p-4 rounded-t-xl border border-b-0 border-slate-200 flex justify-between text-sm mb-0 mt-4">
                <div className="space-y-1 text-slate-500">
                  <div>Type:</div>
                  <div>Plan:</div>
                </div>
                <div className="space-y-1 text-right font-medium text-slate-900">
                  <div>{accountType}</div>
                  <div>{plan} — {duration === 'Trial' ? '7-Day Free' : duration}</div>
                </div>
              </div>

              {/* Info Badges */}
              {duration === 'Trial' && (
                <>
                  <div className="bg-green-50/50 border border-green-200 rounded-b-xl p-4 mb-4 text-sm text-slate-600">
                    <div className="font-semibold flex items-center gap-2 mb-2 text-green-700">
                      <ShieldCheck className="w-4 h-4 bg-green-500 text-white rounded-full p-0.5" /> 
                      What's included in the 7-day trial:
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> Full access to all features (except Admin panel)</li>
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> Dedicated personal AI assistant</li>
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> Unified inbox — email, WhatsApp, Telegram</li>
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> CRM, pipeline and analytics</li>
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> Earn from referrals — 15% goes to your wallet</li>
                      <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5" /> 1 business profile allowed during trial</li>
                    </ul>
                  </div>

                  <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-slate-600">
                    <div className="font-semibold flex items-center gap-2 mb-2 text-red-600">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> 
                      After the 7-day trial:
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5" /> Access is blocked — you must choose a plan</li>
                      <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5" /> If no payment within <b className="text-red-500">30 days</b> — account is automatically deleted</li>
                      <li className="flex items-start gap-1.5"><span className="text-orange-400">💡</span> You can pay with PayPal, Payoneer or wallet balance</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
                      placeholder="First Last"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
                      placeholder="e.g. Aabc@.123"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: 1 uppercase + 3 letters + 1 symbol (!@#$) + 1 punctuation (.,-) + 3 digits
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 text-[#22c55e] border-slate-300 rounded focus:ring-[#22c55e]"
                      />
                    </div>
                    <div className="text-xs text-slate-600">
                      I have read and agree to all the terms, conditions, and payment obligations described above. I understand the rules of the 7-day trial.
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className="flex-[2] flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#22c55e] hover:bg-green-600 transition-all shadow-sm shadow-green-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-slate-400 uppercase tracking-widest">Or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    type="button" 
                    onClick={registerWithGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" alt="Google" />
                    Continue with Google
                  </button>
                  <button 
                    type="button" 
                    onClick={registerWithApple}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701z"/></svg>
                    Continue with Apple
                  </button>
                </div>
                
                <p className="mt-6 text-center text-sm text-slate-600">
                  Have an account? <Link to="/login" className="font-semibold text-[#22c55e] hover:text-green-600">Sign in</Link>
                </p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

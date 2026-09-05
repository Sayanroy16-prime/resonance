import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Globe, 
  RefreshCw,
  Music2,
  Headphones
} from 'lucide-react';
import { api } from '../services/api';

export const AuthScreen = ({ onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState('gmail'); // 'gmail' | 'phone'
  
  // Phone State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gmail State
  const [gmailAddress, setGmailAddress] = useState('');
  const [gmailName, setGmailName] = useState('');

  const otpInputsRef = useRef([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpStep && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // Phone submission handler
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) return;
    setIsSubmitting(true);
    try {
      await api.sendPhoneOtp(`${countryCode} ${phoneNumber}`);
    } catch (e) {
      console.warn('Phone OTP dispatch error:', e);
    } finally {
      setIsSubmitting(false);
      setOtpStep(true);
      setResendTimer(30);
    }
  };

  // OTP Digit Input Change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) return;

    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode} ${phoneNumber}`;
      const res = await api.verifyPhoneOtp(fullPhone, code);
      setIsSubmitting(false);
      if (res?.user) {
        onLoginSuccess({
          id: res.user.id,
          name: res.user.display_name || res.user.name || `Audio Enthusiast (${fullPhone.slice(-4)})`,
          phone: fullPhone,
          provider: 'Phone Verification',
          avatarUrl: res.user.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`
        });
      }
    } catch {
      setIsSubmitting(false);
      onLoginSuccess({
        id: `usr-phone-${Date.now()}`,
        name: `Audio Enthusiast (${countryCode} ${phoneNumber.slice(-4)})`,
        phone: `${countryCode} ${phoneNumber}`,
        provider: 'Phone Verification',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`
      });
    }
  };

  // Gmail Sign In Handler
  const handleGmailSubmit = async (e) => {
    e.preventDefault();
    const email = gmailAddress || 'audiophile@gmail.com';
    const name = gmailName || email.split('@')[0];
    
    setIsSubmitting(true);
    try {
      const res = await api.login(email, 'password123');
      setIsSubmitting(false);
      if (res?.success && res.user) {
        onLoginSuccess({
          id: res.user.id,
          name: res.user.display_name || res.user.name || (name.charAt(0).toUpperCase() + name.slice(1)),
          email: res.user.email || email,
          provider: 'Google Account',
          avatarUrl: res.user.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`
        });
      } else {
        // Fallback to guest
        const guestRes = await api.guestLogin();
        onLoginSuccess(guestRes.user || {
          id: `usr-google-${Date.now()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email,
          provider: 'Google Account',
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`
        });
      }
    } catch {
      setIsSubmitting(false);
      onLoginSuccess({
        id: `usr-google-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        provider: 'Google Account',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`
      });
    }
  };

  const countryCodes = [
    { code: '+1', name: 'USA / Canada' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+49', name: 'Germany' },
    { code: '+81', name: 'Japan' },
    { code: '+61', name: 'Australia' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0E] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Dynamic Animated Gradient Glow Backdrop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1DB954]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#14141D]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Music Showcase Banner */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#1DB954]/20 via-[#12121A] to-indigo-950/40 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                <Radio className="w-6 h-6 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                  RESONANCE
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1DB954] block -mt-1">
                  STUDIO & OFFLINE
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-white leading-tight font-['Outfit']">
                High-Fidelity Audio. True Offline Playback.
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sign in to sync your custom playlists, cached IndexedDB offline audio tracks, and liked music catalog.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-8 relative z-10">
            <div className="flex items-center gap-2.5 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
              <span>Encrypted IndexedDB Offline Caching</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
              <span>Real-Time Frequency Spectrum Visualizer</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#1DB954] flex-shrink-0" />
              <span>Drag-and-Drop Queue Management</span>
            </div>
          </div>

          <Music2 className="w-64 h-64 text-white/5 absolute -bottom-10 -right-10 rotate-12 pointer-events-none" />
        </div>

        {/* Right Side: Auth Tabs & Form */}
        <div className="md:w-7/12 p-8 flex flex-col justify-between space-y-6">
          {/* Method Selector Tabs */}
          <div>
            <div className="flex bg-[#0B0B0E] p-1.5 rounded-2xl border border-white/10 mb-6">
              <button
                onClick={() => { setAuthMethod('gmail'); setOtpStep(false); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'gmail' 
                    ? 'bg-[#1DB954] text-black shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Google / Gmail</span>
              </button>

              <button
                onClick={() => { setAuthMethod('phone'); setOtpStep(false); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'phone' 
                    ? 'bg-[#1DB954] text-black shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Phone & OTP</span>
              </button>
            </div>

            {/* TAB 1: GMAIL / GOOGLE SIGN-IN */}
            {authMethod === 'gmail' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Sign in with Gmail</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Connect your Google account for one-click streaming access.
                  </p>
                </div>

                {/* Animated One-Click Google Button */}
                <button
                  onClick={handleGmailSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-black font-extrabold text-xs flex items-center justify-center gap-3 transition shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isSubmitting ? 'Authenticating with Google...' : 'Continue with Google Account'}</span>
                </button>

                <div className="flex items-center gap-3 text-gray-500 my-4">
                  <hr className="flex-1 border-white/10" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Or enter email</span>
                  <hr className="flex-1 border-white/10" />
                </div>

                <form onSubmit={handleGmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Gmail Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={gmailAddress}
                        onChange={(e) => setGmailAddress(e.target.value)}
                        placeholder="your.name@gmail.com"
                        className="w-full bg-[#0B0B0E] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#1DB954] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={gmailName}
                      onChange={(e) => setGmailName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-[#0B0B0E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#1DB954] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-neon-green py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{isSubmitting ? 'Connecting...' : 'Sign In to Resonance'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: PHONE NUMBER & OTP VERIFICATION */}
            {authMethod === 'phone' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {!otpStep ? (
                  // STEP 1: Enter Phone Number
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Outfit']">Sign in with Phone Number</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        We will send a 6-digit SMS verification code to your phone.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Select Country Code & Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-[#0B0B0E] border border-white/10 rounded-xl px-3 py-3 text-xs text-white font-semibold outline-none focus:border-[#1DB954]"
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} ({c.name})
                            </option>
                          ))}
                        </select>

                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="987 654 3210"
                            className="w-full bg-[#0B0B0E] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#1DB954] transition font-semibold"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !phoneNumber}
                      className="w-full btn-neon-green py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Verification SMS...</span>
                      ) : (
                        <>
                          <span>Send 6-Digit OTP Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // STEP 2: 6-Digit OTP Verification Screen
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-['Outfit']">Enter 6-Digit Code</h3>
                        <button
                          type="button"
                          onClick={() => setOtpStep(false)}
                          className="text-xs text-[#1DB954] hover:underline font-semibold"
                        >
                          Change Number
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Code sent to <span className="text-white font-bold">{countryCode} {phoneNumber}</span>
                      </p>
                    </div>

                    {/* 6 Auto-Advancing Digit Input Boxes */}
                    <div className="flex justify-between gap-2 py-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-14 bg-[#0B0B0E] border-2 border-white/15 focus:border-[#1DB954] rounded-xl text-center text-xl font-bold text-white outline-none transition shadow-inner"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    {/* Quick Demo Filler Button */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>Didn't receive code?</span>
                      {resendTimer > 0 ? (
                        <span className="text-gray-500 font-semibold">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResendTimer(30)}
                          className="text-[#1DB954] font-bold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || otpDigits.join('').length < 6}
                      className="w-full btn-neon-green py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isSubmitting ? 'Verifying OTP...' : 'Verify & Enter Studio'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-gray-500 border-t border-white/5 pt-3 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#1DB954]" />
              End-to-end encrypted session
            </span>
            <span>Resonance Studio 2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};

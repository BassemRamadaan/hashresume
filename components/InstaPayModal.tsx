import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';

interface InstaPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2HQoGeE3qu8Gwh-f8WsMYlOTy9LtagwOUA4q9QKW4IOLZycHO6c2FEM99gQCppY_G/exec";
const PAYMENT_LINK = "https://ipn.eg/S/bassemramadaan/instapay/8hntsK";

const InstaPayModal: React.FC<InstaPayModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [refNumber, setRefNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleClose = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsVerifying(false);
    setRefNumber('');
    setError('');
    setStatusMessage('');
    onClose();
  };

  const handleVerify = async () => {
    if (refNumber.length < 6) {
      setError('Please enter a valid Reference Number.');
      return;
    }

    setIsVerifying(true);
    setError('');
    setStatusMessage('Registering transaction...');

    try {
      // 1. Send POST request to register the reference number
      // 'no-cors' is required for GAS Web Apps to avoid CORS errors on POST
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reference: refNumber })
      });

      setStatusMessage('Waiting for confirmation...');

      // 2. Start polling for status
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`${SCRIPT_URL}?reference=${refNumber}`);
          const status = await response.text();
          
          if (status.trim() === 'paid') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatusMessage('Payment Verified!');
            setTimeout(() => {
              onVerify();
              handleClose();
            }, 1000);
          }
        } catch (pollErr) {
          console.error('Polling error', pollErr);
        }
      }, 5000);

    } catch (err) {
      console.error('Verification error', err);
      setError('Connection failed. Please check your internet.');
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-[#583395] p-6 text-white text-center relative shrink-0">
          <button onClick={handleClose} className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors">
            <Icons.Close size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-2">Unlock Full Access</h2>
          <p className="opacity-90 text-sm">Follow the steps below to download your resume.</p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Step 1: Pay */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#583395] text-white text-xs">1</span>
              <h3>Make a Payment</h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <p className="text-sm text-slate-600 mb-3">
                Click the button below to pay via InstaPay.
              </p>
              <a 
                href={PAYMENT_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white text-[#583395] border-2 border-[#583395] hover:bg-purple-50 font-bold py-2.5 rounded-lg transition-colors"
              >
                <Icons.Link size={18} />
                Open InstaPay
              </a>
            </div>
          </div>

          {/* Step 2: Verify */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#583395] text-white text-xs">2</span>
              <h3>Verify Transaction</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Enter Reference Number
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g., 12345678"
                disabled={isVerifying}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#583395] focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
              />
              {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><Icons.Close size={12}/> {error}</p>}
            </div>

            <button
                onClick={handleVerify}
                disabled={isVerifying || !refNumber}
                className={`w-full font-semibold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-2
                ${isVerifying || !refNumber
                    ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed' 
                    : 'bg-[#583395] hover:bg-[#4a2b7d] text-white hover:shadow-purple-200'}`}
            >
                {isVerifying ? (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                </div>
                ) : (
                <>
                    <Icons.Check size={18} /> Verify Payment
                </>
                )}
            </button>
            
            {isVerifying && (
                 <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                     <Icons.Check size={16} /> {statusMessage}
                 </div>
            )}
          </div>
          
          <div className="text-center pt-2 border-t border-slate-100">
             <p className="text-xs text-slate-400">
                Having trouble? Contact support@hashresume.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstaPayModal;
import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { createPaymentIntent, checkPaymentStatus } from '../services/mockApi';
import { PaymentStatus } from '../types';

interface InstaPayModalProps {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export const InstaPayModal: React.FC<InstaPayModalProps> = ({ onSuccess, onClose }) => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setStatus(PaymentStatus.PENDING);
    
    try {
      // Simulate creating intent
      await createPaymentIntent();
      
      // Simulate verifying transaction (normally done via webhook)
      const finalStatus = await checkPaymentStatus("dummy_token");
      
      if (finalStatus === PaymentStatus.COMPLETED) {
        setStatus(PaymentStatus.COMPLETED);
        setTimeout(() => {
            // Generate a fake one-time token
            onSuccess("valid_export_token_" + Date.now());
        }, 1500);
      } else {
        setStatus(PaymentStatus.FAILED);
      }
    } catch (e) {
      setStatus(PaymentStatus.FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <GlassCard className="w-full max-w-sm bg-slate-900 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        {/* Header */}
        <div className="bg-[#4A148C] -m-6 mb-6 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h2 className="text-2xl font-bold text-white relative z-10">InstaPay</h2>
            <p className="text-purple-200 text-sm relative z-10">Secure Payment</p>
        </div>

        {status === PaymentStatus.COMPLETED ? (
           <div className="text-center py-8">
             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
             <p className="text-gray-400 text-sm">Preparing your download...</p>
           </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-gray-300">Resume Export</span>
                <div className="text-right">
                  <span className="block text-xs text-red-400 line-through">100 EGP</span>
                  <span className="block text-xl font-bold text-green-400">20 EGP</span>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg flex gap-3 items-start">
                 <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <p className="text-xs text-blue-200">
                    This is a secure simulation. No real money will be deducted. Click Pay to proceed.
                 </p>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className={`
                w-full py-3 rounded-full font-bold text-lg transition-all
                ${loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#4A148C] to-purple-600 hover:shadow-lg hover:shadow-purple-500/30'}
              `}
            >
              {loading ? "Processing..." : "Pay 20 EGP"}
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
};
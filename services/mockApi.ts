import { PaymentStatus } from '../types';

// Simulating /api/payment/intent
export const createPaymentIntent = async (): Promise<{ token: string; amount: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "pay_intent_" + Math.random().toString(36).substr(2, 9),
        amount: 20 // Discounted price
      });
    }, 800);
  });
};

// Simulating /api/payment/status polling
export const checkPaymentStatus = async (token: string): Promise<PaymentStatus> => {
  return new Promise((resolve) => {
    // In a real app, this checks DB. Here we simulate random success after delay
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate simulation
      resolve(isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.PENDING);
    }, 1000);
  });
};

// Simulating /api/pdf/generate (gated)
export const generatePdfUrl = async (exportToken: string): Promise<string> => {
  if (!exportToken) throw new Error("Unauthorized");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("blob:https://hashresume.com/resume.pdf"); 
    }, 1500);
  });
};
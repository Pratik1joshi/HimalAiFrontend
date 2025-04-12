import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Button } from "../components/ui/button";
import { Mail, Check } from "lucide-react";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Get email from state or ask user to enter it
  const email = location.state?.email || '';
  
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await authService.verifyEmail({
        email,
        code: verificationCode
      });
      
      // Store tokens in localStorage or context
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Verification failed', err);
      setError(err.response?.data?.detail || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {success ? (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Check size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your account has been successfully verified. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              We've sent a verification code to<br />
              <span className="font-medium">{email || 'your email'}</span>
            </p>
            
            {error && (
              <div className="mb-4 p-3 rounded-md text-center text-sm font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:bg-opacity-30 dark:text-red-300">
                {error}
              </div>
            )}
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !verificationCode}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

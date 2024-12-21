import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`);
        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        toast.error('Email verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      const email = localStorage.getItem('pendingVerificationEmail');
      if (!email) {
        toast.error('No email found for verification');
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, { email });
      toast.success('Verification email resent successfully');
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {verificationStatus === 'verifying' && (
            <RefreshCw className="mx-auto h-12 w-12 text-primary animate-spin" />
          )}
          {verificationStatus === 'success' && (
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          )}
          {verificationStatus === 'error' && (
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
          )}

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {verificationStatus === 'verifying' && 'Verifying your email...'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {verificationStatus === 'verifying' && 'Please wait while we verify your email address.'}
            {verificationStatus === 'success' && 'You will be redirected to login shortly.'}
            {verificationStatus === 'error' && 'The verification link may have expired or is invalid.'}
          </p>

          {verificationStatus === 'error' && (
            <button
              onClick={handleResendVerification}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend Verification Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
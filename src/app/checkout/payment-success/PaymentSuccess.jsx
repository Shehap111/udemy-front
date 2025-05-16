'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import '../checkout.css'
import {useTranslation} from 'react-i18next';
import { useRouter } from 'next/navigation'
import ProgressLoader from './ProgressLoader';

const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter()

const {t} = useTranslation();
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const session_id = searchParams.get('session_id');

      if (session_id) {
        try {
          const response = await axios.post("http://localhost:5000/api/stripe/confirm-checkout-session", {
            sessionId: session_id
          });

          setPaymentStatus(t('PaymentStatus.success'));
          localStorage.removeItem("cart");
const timeout = setTimeout(() => {
      router.push('/profile/courses') // غير '/your-route' للمسار اللي عايزه
    }, 5000)

    return () => clearTimeout(timeout)
          setError(null);
          setErrorDetails(null);
        } catch (error) {
          setError(t('PaymentStatus.error'));

          if (error.response) {
            setErrorDetails(`الخطأ: ${error.response.status} - ${error.response.data?.message || 'لا توجد تفاصيل'}`);
          } else if (error.request) {
            setErrorDetails( t('PaymentStatus.noConnection') );
          } else {
            setErrorDetails(t('PaymentStatus.setupError') ,`  ${error.message}`);
          }

          console.error(t('PaymentStatus.errorDetails'), error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPaymentStatus();
  }, [searchParams]);

  return (
    <div className="payment-success-container">

      <ProgressLoader/>
      {loading && (
        <div className="loading-message">
          <p> {t('PaymentStatus.loading')} </p>
        </div>
      )}

      {error && (
        <div className="error-section">
          <h3>{error}</h3>
          {errorDetails && <p className="error-details">{errorDetails}</p>}
          <p className="retry-message"> {t('PaymentStatus.retryMessage')} </p>
        </div>
      )}

      {paymentStatus && !error && (
        <div className="success-section">
          <h2>{paymentStatus}</h2>
          <p> {t('PaymentStatus.thankYou')} </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
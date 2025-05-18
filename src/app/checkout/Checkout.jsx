'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon } from '../../redux/slices/couponSlice';  
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import IntroSections from '../../components/IntroSections';
import './checkout.css'
import {useTranslation} from 'react-i18next';



const Checkout = () => {
  const dispatch = useDispatch();

  // Get user data from Redux
  const user = useSelector((state) => state.auth.user);  
  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);  
  // Get discount data from Redux
  const { discount, discountType, errorMessage, loading } = useSelector((state) => state.coupon);  
const language = useSelector((state) => state.language.language); // Get the current language from Redux
const {t}= useTranslation(); // 
  
  const [couponCode, setCouponCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const calculateTotal = () => {
      let total = cartItems.length > 0 ? cartItems.reduce((acc, course) => acc + course.price, 0) : 0;

      if (discount > 0) {
        if (discountType === 'percentage') {
          total -= total * (discount / 100); // الخصم بالنسبة المئوية
        } else {
          total -= discount; // الخصم بقيمة ثابتة
        }
      }

      setTotalAmount(Number(total > 0 ? total : 0).toFixed(2));
    };

    calculateTotal();
  }, [cartItems, discount, discountType]);

  // Function to apply coupon and update Redux state
  const handleApplyCoupon = async () => {
    const response = await dispatch(applyCoupon(couponCode));
    if (response.success) {
      alert('Coupon applied successfully!');
    } else {
      alert(response.message); // Show error message if coupon application fails
    }
  };

// Function to handle the checkout process
const handleCheckout = async () => {
if (!user) {
  return (
    <div>
      <p>You must be logged in to proceed with checkout. Please <Link href="/login">login here</Link>.</p>
    </div>
  );
}

  try {
    // Initialize Stripe
    const stripe = await loadStripe("pk_test_51QH9SCRudA1pE7179r11dWHXsCdraUdcQht2XZn6hoWl5m0T7MVzEW2zvIZ63Cvbj072HzO5vUPG2qVQGVImjfYc0044AZsHXI");  
    
    // Send the checkout session request to the backend
    const response = await axios.post(`${BASE_URL}/api/stripe/checkout-session`, {
      totalAmount: totalAmount,
      userEmail: user.email,
      userId: user._id,
      courseIds: cartItems.map(item => item._id),  // Send course IDs to the server
    });

    // Check if the response contains a session ID
    if (response.data.id) {
      const sessionId = response.data.id;
      
      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error during Stripe checkout:', error); // Log any errors during the Stripe checkout process
      }
    } else {
      console.error('No session ID returned from the backend'); // Log if no session ID is returned
    }
  } catch (error) {
    console.error('Error during checkout request:', error); // Handle any errors during the API call
  }
};


  return (
<>
  {/* IntroSection Component - Navigational Heading */}
  <IntroSections path="/checkout" Link="Checkout" sectionName="Checkout" />

  <div className="checkout-container">
        <h2>{t('checkout.orderDetails') }</h2>

    {/* User Information */}
    <div className="user-details">
      <p>{t('checkout.studentName') } : {user?.firstName}</p>
      <p>{t('checkout.email') } : {user?.email}</p>
    </div>

    <h3>{t('checkout.coursesTitle') }</h3>
    <ul>
      {/* Display cart items */}
      {cartItems.length > 0 ? (
        cartItems.map((course) => (
          <li key={course._id}>
            <h4>  {course.title[language]} - ${course.price} </h4>
            <img src={course.image} width={200} height={200} alt={course.title[language]} />
          </li>
        ))
      ) : (
        <p> {t('checkout.noCourses') } </p>
      )}
    </ul>

    {/* Coupon Section */}
    <div className="coupon-section">
      <input 
        type="text" 
        placeholder="Enter Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button onClick={handleApplyCoupon} disabled={loading}>
        {loading ? 'Verifying...' : 'Apply Coupon'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>

    {/* Total Section */}
    <div className="total">
      <h3> <span>{t('checkout.totalAmount') } </span> <span>${totalAmount}</span></h3>
    </div>

    {/* Checkout Button */}
    <button className='btn_style' onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing Payment...' : 'Complete Checkout'}
    </button>
  </div>
</>
  );
};

export default Checkout;

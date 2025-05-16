import React, { Suspense } from 'react';
import PaymentSuccess from './PaymentSuccess';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
};

export default Page;

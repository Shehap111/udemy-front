'use client';
import { useState } from 'react';
import './home.css'; // ستايلات بسيطة

const WatchVideoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <>

          <button  className='Watch_Video'   onClick={openPopup}>
<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clipRule="evenodd"/>
</svg>


</button>

          
      {isOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>✖</button>
            <div className="video-wrapper">
<iframe width="560" height="315" src="https://www.youtube.com/embed/hCYCcUhMBuo?si=BIpZIN3kSU7z7qKx&amp;start=11" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchVideoPopup;

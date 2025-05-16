import React from 'react'
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const S3_about = () => {
  return (
<section className='S3_about'>
    <div className='Follow'>
        <h3>Follow Us</h3>

<ul >
  <li>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
      <FaFacebookF size={30} />
    </a>
  </li>
  <li>
    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
      <FaYoutube size={30} />
    </a>
  </li>
  <li>
    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
      <FaLinkedinIn size={30} />
    </a>
  </li>
  <li>
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
      <FaInstagram size={30} />
    </a>
  </li>
</ul>

    </div>   

</section>
  )
}

export default S3_about
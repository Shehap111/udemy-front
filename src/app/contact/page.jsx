'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { sendContactMessage, resetContactState } from '../../redux/slices/contactSlice';
import { toast } from 'react-toastify';
import IntroSections from '../../components/IntroSections';
import Image from 'next/image';
import img1 from '../../../public/img/contact-thumb.webp';
import './contant.css'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationCity } from 'react-icons/md';
import { IoLogoYoutube } from 'react-icons/io5'
import MapEmbed from './MapEmbed';
import {useTranslation} from 'react-i18next';



const ContactForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

const {t} = useTranslation()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendContactMessage(form));
  };

  useEffect(() => {
    if (success) {
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
      dispatch(resetContactState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetContactState());
    }
  }, [success, error, dispatch]);

  return (
<>
<IntroSections sectionName={'Contact Us'} path={'/contact'} Link={'Contact Us'}/>
      

<section className="contant">
<div className="container">
<div className="row">
    
<div className="col-lg-6">
<h3> {t('contact.getInTouch')} </h3>
<p>{t('contact.teamMessage')}</p>
<Box component="form" onSubmit={handleSubmit} noValidate>
    <TextField
    fullWidth
    margin="normal"
    label={t('contact.yourName')}
    name="name"
    value={form.name}
    onChange={handleChange}
    required
    />
    <TextField
    fullWidth
    margin="normal"
    label={t('contact.yourEmail')}
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
    required
    />
    <TextField
    fullWidth
    margin="normal"
    label={t('contact.yourMessage')}
    name="message"
    value={form.message}
    onChange={handleChange}
    required
    multiline
    rows={4}
    />

    <Box mt={2} textAlign="center">
    <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ px: 5, py: 1 }}
    >
        {loading ? <CircularProgress size={24} color="inherit" /> : t('contact.send')}
    </Button>
    </Box>
</Box>    
</div>
                  
<div className="col-lg-6">
    <Image src={img1} alt="Contact Us" width={100} height={300} className="contact-image" loading='lazy'/>            
</div>
                  
                  
</div>    

<div className="row information">
  <div className="col-lg-3">
    <div className="box">
        <FaMapMarkerAlt  /> 
        <h4>{t('contact.cairoOffice')}</h4>
        <p>{t('contact.cairoAddress')}</p>        
    </div>
  </div>

  <div className="col-lg-3">
    <div className="box">
        <FaPhoneAlt  />
        <h4> {t('contact.callUs')}</h4>
        <p>+20 010 9794 3039</p>
        <p>+20 015 5268 7532</p>        
    </div>
  </div>

  <div className="col-lg-3">
    <div className="box">
        <FaEnvelope />
        <h4> {t('contact.emailUs')}</h4>
        <p>support@shehap.com</p>                              
    </div>
  </div>

<div className="col-lg-3">
  <div className="box">
    <MdLocationCity  />
    <h4> {t('contact.followUs')}</h4>
    <div className='social' >
      <a href="https://facebook.com" target="_blank" rel="noreferrer">
        <FaFacebookF size={25} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer">
        <FaTwitter size={25} />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer">
        <FaInstagram size={25} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer">
        <FaLinkedinIn size={25} />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noreferrer">
        <IoLogoYoutube size={25} />
      </a>
    </div>                              
 </div>
</div>

</div>                  

<div className="map">
    <MapEmbed/>
</div>

</div>              
</section>
      
      
      
</>
  );
};

export default ContactForm;

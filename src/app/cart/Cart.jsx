'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IntroSections from '../../components/IntroSections';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { removeFromCart ,clearCart} from '../../redux/slices/cartSlice';
import './cart.css'; 
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
const Cart = () => {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const {t} = useTranslation();


  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };
    const handelClearCart = () => {
    dispatch(clearCart());
}
    
  return (
    <div>
      <IntroSections Link="Cart" path="/cart" sectionName="Cart Page" />

      <section className="cart py-8">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 text-lg"> {t('cart.emptyCart')} </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('cart.image')}</TableCell>
                    <TableCell>{t('cart.courseTitle')}</TableCell>
                    <TableCell>{t('cart.instructor')}</TableCell>
                    <TableCell>{t('cart.price')}</TableCell>
                    <TableCell>{t('cart.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <img src={item.image} alt={item.title} width={80} height={50} style={{ objectFit: 'cover' }} />
                      </TableCell>
                      <TableCell>{item.title[language]}</TableCell>
                      <TableCell>{item.instructor.name}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemove(item._id)}
                        >
                          {t('cart.remove')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                        <Button
                            className='clear '
                          variant="contained"
                          color="error"
                         onClick={handelClearCart}
                        >
                          {t('cart.clear')}
                        </Button>                              
            </TableContainer>
          )}
        </div>

        {
          cartItems.length > 0 && (
            <div className="total-price ">
              <span>{t('cart.totalPrice')}</span>
              <h4> ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</h4>
            </div>
            
          )
        }
        <Link href={'/checkout'} className='checkout btn_style' >{t('cart.checkout')}</Link>
      </section>
    </div>
  );
};

export default Cart;

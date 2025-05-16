'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { CiShoppingCart } from "react-icons/ci"
import { Badge, IconButton } from '@mui/material'
import Link from 'next/link'
const CartIcon = () => {
  const cartItems = useSelector((state) => state.cart.cartItems)

    return (
<Link href="/cart" className="cart-icon">
<IconButton aria-label="cart" sx={{ color: ' #07a169' }}>
<Badge
  badgeContent={cartItems.length}
  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: '#07a169',
      color: 'white',
    },
  }}
>
  <CiShoppingCart size={28} />
</Badge>
</IconButton>            
</Link>

  )
}

export default CartIcon

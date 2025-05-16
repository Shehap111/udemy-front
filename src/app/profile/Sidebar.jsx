'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/profile/edit', label: 'Edit Profile' },
  { href: '/profile/wishlist', label: 'Wishlist' },
  { href: '/profile/courses', label: 'My Courses' },
  { href: '/profile/subscriptions', label: 'Subscriptions' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='sidebar' >
      {links.map(link => (
        <Link key={link.href} href={link.href}>
          <div style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: pathname === link.href ? '#07a169' : 'transparent',
            color: pathname === link.href ? 'white' : 'black',
            cursor: 'pointer',
            border:'1px solid #07a169' 
            
          }}>
            {link.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

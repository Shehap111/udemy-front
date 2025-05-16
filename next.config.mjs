/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com', 'res.cloudinary.com'], // إضافة الدومين هنا
  },
  i18n: {
    locales: ['en', 'ar', 'de', 'es'],  // قائمة اللغات المتاحة
    defaultLocale: 'en',                 // اللغة الافتراضية
  },
};

export default nextConfig;

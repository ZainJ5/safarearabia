/**
 * Minimal EN / AR translation dictionary for the frontend.
 * Keys are English strings; values are Arabic translations.
 */
export const translations = {
  ar: {
    // Navbar
    'Home': 'الرئيسية',
    'About Us': 'من نحن',
    'Hajj Umrah': 'حج وعمرة',
    'Hotel Booking': 'حجز الفنادق',
    'VIP Transport': 'مواصلات VIP',
    'Pages': 'الصفحات',
    'Contact Us': 'اتصل بنا',
    'Account': 'حسابي',
    'Sign in to continue': 'تسجيل الدخول للمتابعة',
    'Enter your email address for Login.': 'أدخل بريدك الإلكتروني لتسجيل الدخول.',
    'Sign In': 'دخول',
    "Don't have an account?": 'ليس لديك حساب؟',
    'Register Here': 'سجل هنا',
    'Sign In With Google': 'الدخول عبر جوجل',

    // Common
    'More About': 'المزيد',
    'Inquiry Now': 'استفسر الآن',
    'View Details': 'عرض التفاصيل',
    'Book Now': 'احجز الآن',
    'Explore Tours': 'استكشف الجولات',
    'Send Message': 'إرسال الرسالة',
    'Subscribe': 'اشترك',
    'Read More': 'اقرأ المزيد',

    // Sections
    'Why Choose Safar e Arabian': 'لماذا تختار سفر العربي',
    'Ultimate Travel Experience': 'تجربة سفر لا مثيل لها',
    'Visa Processing': 'معالجة التأشيرة',
    'What Our Clients Say': 'ما يقوله عملاؤنا',
    'Join The Newsletter': 'انضم إلى النشرة الإخبارية',
    'To receive our best monthly deals': 'لتلقي أفضل عروضنا الشهرية',
    'Enter Your Email...': 'أدخل بريدك الإلكتروني...',

    // Footer
    'Want To Take Tour Packages?': 'هل تريد باقات سياحية؟',
    'Quick link': 'روابط سريعة',
    'More Inquiry': 'للاستفسار',
    'Send Mail': 'إرسال بريد',
    'Address': 'العنوان',
    'Payment Partner': 'شريك الدفع',
    'Terms and Conditions': 'الشروط والأحكام',
    'Security Information': 'معلومات الأمان',

    // Contact
    'Contact Us': 'اتصل بنا',
    'Send Us a Message': 'أرسل لنا رسالة',
    'Full Name *': 'الاسم الكامل *',
    'Email Address *': 'البريد الإلكتروني *',
    'Phone Number': 'رقم الهاتف',
    'Subject': 'الموضوع',
    'Message *': 'الرسالة *',
    'Sending...': 'جارٍ الإرسال...',
    'Your message has been sent!': 'تم إرسال رسالتك!',

    // About
    "Let's know About Our Journey For Safar e Arabian.": 'تعرف على رحلتنا في سفر العربي.',
    'Mission & Vision': 'المهمة والرؤية',
    'Focus On Customer': 'التركيز على العميل',
    'Enjoy with us': 'استمتع معنا',
    '345+': '+٣٤٥',
    'Customer': 'عميل',
  },
};

/** Return translated string or fallback to English */
export function t(key, lang = 'en') {
  if (lang === 'en') return key;
  return translations.ar?.[key] ?? key;
}

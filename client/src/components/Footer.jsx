import React from 'react';
import { FaPhone, FaEnvelope, FaInstagram, FaPaperPlane, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaPhone className="mr-2 text-green-400" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-green-400">
                  <FaPhone />
                </div>
                <div>
                  <p className="font-medium">+91 70822 53728</p>
                  <p className="font-medium">+91 87900 89089</p>
                  <p className="text-sm text-gray-400 mt-1">Mon-Sat, 8AM-8PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-green-400">
                  <FaEnvelope />
                </div>
                <div>
                  <a 
                    href="mailto:7starfruitbox@gmail.com" 
                    className="font-medium hover:text-green-400 transition-colors"
                  >
                    7starfruitbox@gmail.com
                  </a>
                  <p className="text-sm text-gray-400 mt-1">Response within 24 hours</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-green-400">
                  <FaInstagram />
                </div>
                <div>
                  <a 
                    href="https://instagram.com/7starfruitbox" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium hover:text-green-400 transition-colors"
                  >
                    @7starfruitbox
                  </a>
                  <p className="text-sm text-gray-400 mt-1">Follow us for updates</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-400" />
              Free Delivery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['HITEC City', 'Gachibowli', 'Madhapur', 'Kukatpally', 'Yusufguda', 'Ameerpet', 'Banjara Hills', 'Jubilee Hills'].map((area) => (
                <div key={area} className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Free delivery within 12km radius of Yusufguda
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaLink className="mr-2 text-green-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Subscription Plans', href: '#plans' },
                { name: 'Why Choose Us', href: '#why-us' },
                { name: 'Benefits', href: '#benefits' },
                { name: 'Testimonials', href: '#testimonials' },
                { name: 'FAQs', href: '#plans' },
                { name: 'Terms & Conditions', href: '' },
                { name: 'Privacy Policy', href: '' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-green-400 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-600 mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for seasonal updates, exclusive offers, and health tips.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-amber-50 px-4 py-3 rounded-l-lg focus:outline-none text-gray-800 w-full border-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-r-lg transition duration-300 flex items-center justify-center"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy.
            </p>
            <div className="mt-6">
              <h4 className="font-medium text-white mb-3">Payment Methods</h4>
<div className="flex flex-wrap gap-2">
  {[
    { method: 'UPI', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    )},
    { method: 'COD', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )},
    { method: 'PAYTM', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-blue-500">
        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
      </svg>
    )},
    { method: 'PHONEPE', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-purple-600">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
      </svg>
    )},
    { method: 'GOOGLEPAY', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
        <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      </svg>
    )},
    { method: 'QR', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    )}
  ].map(({method, icon}) => (
    <span 
      key={method}
      className="bg-gray-800 px-3 py-1 rounded text-sm flex items-center"
    >
      {icon}
      {method}
    </span>
  ))}
</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} 7Star Fruit Box. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-green-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-green-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-green-400 transition-colors text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

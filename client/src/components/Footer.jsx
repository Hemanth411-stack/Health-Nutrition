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
              Service Areas
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
                { name: 'FAQs', href: '/faq' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' },
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
              We respect your privacy. Unsubscribe at any time.
            </p>
            <div className="mt-6">
              <h4 className="font-medium text-white mb-3">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'COD'].map((method) => (
                  <span 
                    key={method}
                    className="bg-gray-800 px-3 py-1 rounded text-sm"
                  >
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
import React from "react";
import { useTheme } from "../context/ThemeContex";

const Footer = () => {
  const theme = useTheme(); // Access the theme colors

  return (
    <footer style={{ backgroundColor: theme.oxfordBlue, color: theme.lavenderWeb }} className="py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p style={{ color: theme.powderBlue }}>
              We are a leading e-commerce platform offering the best products at
              affordable prices. Shop with us for a seamless experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" style={{ color: theme.powderBlue }} className="hover:text-[var(--ultra-violet)]">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" style={{ color: theme.powderBlue }} className="hover:text-[var(--ultra-violet)]">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" style={{ color: theme.powderBlue }} className="hover:text-[var(--ultra-violet)]">
                  Cart
                </a>
              </li>
              <li>
                <a href="/profile" style={{ color: theme.powderBlue }} className="hover:text-[var(--ultra-violet)]">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p style={{ color: theme.powderBlue }}>Email: support@mystore.com</p>
            <p style={{ color: theme.powderBlue }}>Phone: +1 (123) 456-7890</p>
            <p style={{ color: theme.powderBlue }}>Address: 123 Main St, City, Country</p>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderColor: theme.richBlack }} className="border-t mt-8 pt-8 text-center">
          <p style={{ color: theme.powderBlue }}>
            &copy; {new Date().getFullYear()} MyStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
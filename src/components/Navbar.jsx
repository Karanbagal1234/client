import React, { memo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const Navbar = memo(() => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, retailer, loading, logout } = useAuth();
  const theme = useTheme(); // Access the theme colors

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = (isRetailer) => {
    logout(isRetailer);
  };

  if (loading) {
    return null;
  }

  return (
    <nav style={{ backgroundColor: theme.lavenderWeb }} className="shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-2xl font-bold" style={{ color: theme.richBlack }}>
              ScanPay
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              style={{ color: theme.richBlack }}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[var(--ultra-violet)] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <a
              href="/"
              style={{ color: theme.richBlack }}
              className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </a>
            <a
              href="/products"
              style={{ color: theme.richBlack }}
              className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </a>
            {user && (
              <>
                <a
                  href="/cart"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cart
                </a>
                <a
                  href="/profile"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </a>
              </>
            )}
            {retailer && (
              <>
                <a
                  href="/dashboard"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/inventory"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inventory
                </a>
              </>
            )}
            {!user && !retailer && (
              <>
                <a
                  href="/login"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <a
                  href="/register"
                  style={{ color: theme.richBlack }}
                  className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </a>
              </>
            )}
            {(user || retailer) && (
              <button
                onClick={() => handleLogout(!!retailer)}
                style={{ color: theme.richBlack }}
                className="hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              style={{ color: theme.richBlack }}
              className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="/products"
              style={{ color: theme.richBlack }}
              className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
            >
              Products
            </a>
            {user && (
              <>
                <a
                  href="/cart"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Cart
                </a>
                <a
                  href="/profile"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </a>
              </>
            )}
            {retailer && (
              <>
                <a
                  href="/dashboard"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/inventory"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Inventory
                </a>
              </>
            )}
            {!user && !retailer && (
              <>
                <a
                  href="/login"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </a>
                <a
                  href="/register"
                  style={{ color: theme.richBlack }}
                  className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </a>
              </>
            )}
            {(user || retailer) && (
              <button
                onClick={() => handleLogout(!!retailer)}
                style={{ color: theme.richBlack }}
                className="block hover:text-[var(--ultra-violet)] px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import { CartProvider } from "./context/cart.jsx";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/login.jsx"));
const RegisterPage = lazy(() => import("./pages/Register.jsx"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard.jsx"));
const RetailerDashboard = lazy(() => import("./pages/RetailerDashboard.jsx"));
const ScanPage = lazy(() => import("./pages/ScanPage.jsx"));
const StorePage = lazy(() => import("./pages/StorePage.jsx"));
const HomePage = lazy(() => import("./pages/Home-page.jsx"));
const DigitalReceipt = lazy(() => import("./pages/Recipt.jsx"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16"
            style={{ minHeight: "calc(100vh - 64px - 80px)" }}
          >
            <Suspense
              fallback={
                <div className="text-center text-gray-500">Loading...</div>
              }
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />

                <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                  <Route path="/Home" element={<CustomerDashboard />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/Shopping-start" element={<StorePage />} />
                  <Route path="/recipt" element={<DigitalReceipt />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["retailer"]} />}>
                  <Route path="/Retailer" element={<RetailerDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
    </Router>
  );
}

export default App;

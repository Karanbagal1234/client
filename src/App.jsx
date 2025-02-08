import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/Register.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import RetailerDashboard from "./pages/RetailerDashboard.jsx";
import ScanPage from "./pages/ScanPage.jsx";
import StorePage from "./pages/StorePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/Home-page.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import DigitalReceipt from "./pages/Recipt.jsx";

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
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />

              <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                <Route path="/Home" element={<CustomerDashboard />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route
                  path="/Shopping-start/:storeId"
                  element={<StorePage />}
                />
                <Route path="/recipt" element={<DigitalReceipt/>}/>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["retailer"]} />}>
              <Route path="/Retailer" element={<RetailerDashboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
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

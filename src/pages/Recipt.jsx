import { useEffect, useState } from "react";
import { cartService } from "../services/cart.js"; // Ensure correct import
import { useCart } from "../context/cartContext.jsx";

const DigitalReceipt = () => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const {cartId} = useCart();
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const { data } = await cartService.getRecipt({
          cartId,
          storeId: localStorage.getItem('store'),
        });
        setReceipt(data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading receipt...</p>;
  }

  if (!receipt) {
    return <p className="text-center mt-10 text-red-500">Failed to load receipt.</p>;
  }

  const { storeDetails, transactionDetails, purchasedItems, total } = receipt;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        {/* Store Details */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{storeDetails.name}</h1>
          <p className="text-gray-600">{storeDetails.address}</p>
          <p className="text-gray-600">{storeDetails.phone}</p>
          <p className="text-gray-600">{storeDetails.email}</p>
        </div>

        {/* Transaction Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Transaction Details</h2>
          <p className="text-gray-600">
            <span className="font-medium">Transaction ID:</span> {transactionDetails.transactionId}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Date:</span> {transactionDetails.date}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Time:</span> {transactionDetails.time}
          </p>
        </div>

        {/* Purchased Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchased Items</h2>
          <div className="space-y-4">
            {purchasedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-800 font-medium">{item.Name}</p>
                  <p className="text-gray-600">Qty: {item.quantity || 1}</p>
                </div>
                <p className="text-gray-800">
                  ${(item.Price * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-lg font-semibold text-gray-800">Total Amount</p>
          <p className="text-xl font-bold text-gray-800">${(total || 0).toFixed(2)}</p>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">Thank you for shopping with us!</p>
          <p className="text-gray-600">Please visit again.</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalReceipt;

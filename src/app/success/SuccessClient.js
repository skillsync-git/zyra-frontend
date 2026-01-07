"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    setTimeout(() => setShowConfetti(true), 500);

    const storedOrderId = sessionStorage.getItem("lastOrderId") || "";
    const storedAmount = sessionStorage.getItem("paymentAmount") || "₹0.00";
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setOrderDetails({
      orderId: storedOrderId,
      amount: storedAmount,
      date: dateStr,
    });
  }, []);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
    ][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-start justify-center pt-40 sm:pt-48 pb-8 px-4 sm:px-6 md:px-8 overflow-hidden relative">
      {/* Confetti Animation */}
      {showConfetti &&
        confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${piece.left}%`,
              top: "-20px",
              backgroundColor: piece.color,
              animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            }}
          />
        ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 1.5s ease-out infinite;
        }
      `}</style>

      <div
        className={`w-full max-w-lg transition-all duration-700 transform ${
          animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Success Icon with Ripple Effect */}
        <div className="flex justify-center mb-6 sm:mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-400 rounded-full animate-ripple"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-400 rounded-full animate-ripple"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <div
            className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-500 ${
              animate ? "rotate-0" : "rotate-180"
            }`}
          >
            <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white stroke-[3]" />
          </div>
        </div>

        {/* Success Message Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order Placed!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Your order has been placed successfully
            </p>
          </div>
          {/* Order Details */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-emerald-200">
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                Order ID
              </span>
              <span className="text-sm sm:text-base text-gray-900 font-bold">
                {orderDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-emerald-200">
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                Total Amount
              </span>
              <span className="text-lg sm:text-xl text-emerald-600 font-bold">
                {orderDetails.amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                Date
              </span>
              <span className="text-sm sm:text-base text-gray-900 font-semibold">
                {orderDetails.date}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <Link href="/" className="flex-1">
              <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 sm:py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
        {/* Thank You Message */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Thank you for your purchase! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

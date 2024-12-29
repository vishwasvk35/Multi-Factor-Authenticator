import React, { useState, useRef } from "react";
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/AuthStore";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { use } from "react";

function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { verifyEmail, isLoading, error } = useAuthStore();

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newOtp = [...otp];

    if (value.length > 1) {
      // Handle pasted OTP
      const pastedOtp = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedOtp[i] || "";
      }
      setOtp(newOtp);

      const lastFilledIndex = newOtp.findIndex((digit) => digit === "");
      inputRefs.current[lastFilledIndex < 5 ? lastFilledIndex + 1 : 5].focus();
    } else {
      // Handle single input change
      if (/^\d$/.test(value) || value === "") {
        // Allow only digits or empty value
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      try {
        await verifyEmail(enteredOtp);
        navigate('/');
      } catch (err) {
        // Show error toast if verification fails
        toast.error(error);
      }
    } else {
      toast.error("Please enter a 6-digit OTP.");
    }
  };

  return (
    <div className="bg-slate-300 bg-opacity-10 border-gray-800 rounded-xl shadow-2xl m-5 w-full max-w-md">
      <h2 className="text-4xl font-medium text-blue-500 mb-6 m-7 text-center">
        Verify Email
      </h2>
      <p className="text-gray-800 text-m flex items-center justify-center">
        Enter the 6-digit OTP sent to your email.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-5 m-7">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => {
            return (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1" // Limit each field to one character
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full p-3 border text-white text-center text-2xl bg-gray-900 bg-opacity-30 border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            );
          })}
        </div>
        <Button
          type="submit"
          placeholder={
            isLoading ? <Loader className="animate-spin mx-24" size={24} /> : "Verify Email"
          }
        />
      </form>
    </div>
  );
}

export default VerifyEmailPage;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect, type ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from "@/app/store/hooks";
import { verifyUserOtp } from "@/modules/auth/store/authSlice";
import { AuthService } from '@/modules/auth/services/auth.service';

export function useVerifyEmail() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(data)) return;
    setOtp(data.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    setError(null);
    const fullOtp = otp.join("");
    setLoading(true);

    try {
      await dispatch(verifyUserOtp(fullOtp)).unwrap();
      navigate("/");
    } catch (reason) {
      switch (reason) {
        case "INVALID_OTP":
          setError("The code you entered is incorrect.");
          break;
        case "OTP_EXPIRED":
          setError("This code has expired. Please request a new one.");
          break;
        case "USER_ALREADY_VERIFIED":
          setError("You are already verified. Redirecting...");
          setTimeout(() => navigate("/dashboard"), 2000);
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      // Still using the service directly since this doesn't affect global auth state
      await AuthService.requestOtp();
      setTimer(45);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return {
    otp,
    timer,
    loading,
    resending,
    email,
    error,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleVerify,
    handleResend,
  };
}
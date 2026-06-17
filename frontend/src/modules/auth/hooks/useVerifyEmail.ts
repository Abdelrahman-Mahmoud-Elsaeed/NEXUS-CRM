/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ClipboardEvent,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../store/auth.slice";
import {
  verifyUserOtp,
  resendOtpCode,
} from "../store/auth.actions";

export function useVerifyEmail() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isVerifyingOtp,
    isResendingOtp,
    otpError,
  } = useSelector(selectAuth);

  const [otp, setOtp] = useState<string[]>(() =>
    new Array(6).fill("")
  );
  const [timer, setTimer] = useState<number>(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || "";

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(
      () => setTimer((p) => p - 1),
      1000
    );
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (
      otpError ===
      "Your account is already verified! Redirecting you..."
    ) {
      const redirect = setTimeout(
        () => navigate("/", { replace: true }),
        2000
      );
      return () => clearTimeout(redirect);
    }
  }, [otpError, navigate]);

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (isNaN(Number(value))) return;

      setOtp((prev) => {
        const updated = [...prev];
        updated[index] = value.slice(-1);
        return updated;
      });

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const data = e.clipboardData.getData("text").trim();
      if (!/^\d{6}$/.test(data)) return;

      setOtp(data.split(""));
      inputRefs.current[5]?.focus();
    },
    []
  );

  const handleVerify = useCallback(async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    const result = await dispatch(verifyUserOtp(fullOtp));

    if (verifyUserOtp.fulfilled.match(result)) {
      navigate("/setup-workspace", { replace: true });
    }
  }, [otp, dispatch, navigate]);

  const handleResend = useCallback(async () => {
    if (timer > 0) return;

    const result = await dispatch(resendOtpCode());

    if (resendOtpCode.fulfilled.match(result)) {
      setTimer(45);
    }
  }, [timer, dispatch]);

  return {
    otp,
    timer,
    loading: isVerifyingOtp,
    resending: isResendingOtp,
    email,

    error: otpError,

    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleVerify,
    handleResend,
  };
}
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [email, setEmail] = useState(""); // This would come from router params or state

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    // Get email from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam =
      urlParams.get("email") ||
      localStorage.getItem("resetEmail") ||
      "user@example.com";

    setEmail(emailParam);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError("");

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus on the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;

    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");

      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Verifying OTP:", otpString, "for email:", email);

      // On success, redirect to reset password page
      if (otpString === "111111") {
        window.location.href = `/reset-password?token=${otpString}&email=${email}`;
      }

      // Add your OTP verification logic here
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Resending OTP to:", email);
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp(["", "", "", "", "", ""]); // Clear current OTP
      inputRefs.current[0]?.focus(); // Focus first input

      // Add your resend OTP logic here
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isExpired = timeLeft === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-content1 p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg mb-4">
            <Icon
              className="text-primary-foreground text-2xl"
              icon="lucide:briefcase"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Fin-AI
          </h1>
          <p className="text-default-500 mt-2">Verify your identity</p>
        </div>

        {/* OTP Verification Card */}
        <Card className="w-full bg-content1/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Icon
                  className="text-primary text-xl"
                  icon="lucide:shield-check"
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Enter OTP Code
              </h2>
              <p className="text-default-500 text-sm mt-1">
                We&apos;ve sent a 6-digit code to
              </p>
              <p className="font-semibold text-foreground text-sm">{email}</p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              {/* OTP Input Grid */}
              <div className="space-y-4">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className={`
                        w-12 h-12 text-center text-xl font-bold rounded-lg border-2 
                        focus:outline-none focus:border-primary transition-colors
                        bg-content2/50 backdrop-blur-sm
                        ${error ? "border-danger" : "border-default-300"}
                        ${digit ? "border-primary bg-primary/5" : ""}
                      `}
                      disabled={isExpired}
                      inputMode="numeric"
                      maxLength={1}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-danger text-sm text-center">{error}</p>
                )}

                {/* Timer */}
                <div className="text-center">
                  {!isExpired ? (
                    <p className="text-default-500 text-sm">
                      Code expires in{" "}
                      <span className="font-mono font-semibold text-primary">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-danger text-sm font-medium">
                      Code has expired. Please request a new one.
                    </p>
                  )}
                </div>
              </div>

              {/* Verify Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                isDisabled={!isOtpComplete || isExpired}
                isLoading={isLoading}
                size="lg"
                type="submit"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              {/* Resend OTP */}
              <div className="text-center space-y-3">
                <p className="text-default-500 text-sm">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  className="text-primary hover:text-primary/80 font-medium"
                  isDisabled={!isExpired && timeLeft > 240} // Allow resend only after 1 minute or if expired
                  isLoading={isResending}
                  variant="light"
                  onPress={handleResendOTP}
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </Button>
              </div>

              {/* Back to Previous Step */}
              <div className="text-center">
                <Link
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
                  href="/forgot-password"
                >
                  <Icon className="text-sm" icon="lucide:arrow-left" />
                  Back to forgot password
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-default-400 text-sm">
            Having trouble?{" "}
            <Link className="text-primary hover:text-primary/80" href="#">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

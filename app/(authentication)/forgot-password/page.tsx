"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Reset password request for:", email);
      setIsEmailSent(true);
      // Add your forgot password logic here
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Resending reset email to:", email);
      // Add resend logic here
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-default-500 mt-2">
            {isEmailSent ? "Check your email" : "Reset your password"}
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="w-full bg-content1/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              {!isEmailSent ? (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon
                      className="text-primary text-xl"
                      icon="lucide:key-round"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
                  <p className="text-default-500 text-sm mt-1">
                    No worries, we'll send you reset instructions
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4">
                    <Icon
                      className="text-success text-xl"
                      icon="lucide:mail-check"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Email Sent!</h2>
                  <p className="text-default-500 text-sm mt-1">
                    We've sent password reset instructions to your email
                  </p>
                </>
              )}
            </div>
          </CardHeader>
          
          <CardBody className="pt-0">
            {!isEmailSent ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Email Input */}
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onValueChange={(value) => {
                    setEmail(value);
                    if (error) setError("");
                  }}
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="lucide:mail"
                    />
                  }
                  classNames={{
                    inputWrapper: `border-primary/40 focus-within:border-primary ${error ? 'border-danger' : ''}`,
                  }}
                  variant="bordered"
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error}
                />

                {/* Reset Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                  size="lg"
                  isLoading={isLoading}
                  isDisabled={!email}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
                  >
                    <Icon icon="lucide:arrow-left" className="text-sm" />
                    Back to sign in
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="text-center space-y-3">
                  <p className="text-default-600">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold text-foreground bg-default-100 rounded-lg py-2 px-3">
                    {email}
                  </p>
                  <p className="text-default-500 text-sm">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                    size="lg"
                    isLoading={isLoading}
                    onPress={handleResendEmail}
                  >
                    {isLoading ? "Resending..." : "Resend Email"}
                  </Button>

                  <Button
                    variant="bordered"
                    className="w-full border-default-300 hover:border-primary/50"
                    size="lg"
                    onPress={() => {
                      setIsEmailSent(false);
                      setEmail("");
                      setError("");
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
                  >
                    <Icon icon="lucide:arrow-left" className="text-sm" />
                    Back to sign in
                  </Link>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-default-400 text-sm">
            Still having trouble?{" "}
            <Link href="#" className="text-primary hover:text-primary/80">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

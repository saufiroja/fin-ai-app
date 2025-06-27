"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get email and token from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam =
      urlParams.get("email") || localStorage.getItem("resetEmail") || "";
    const tokenParam = urlParams.get("token") || "";

    setEmail(emailParam);
    setToken(tokenParam);

    // If no token, redirect back to forgot password
    if (!tokenParam) {
      // window.location.href = '/forgot-password';
    }
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Weak", color: "text-danger" };
      case 2:
      case 3:
        return { text: "Medium", color: "text-warning" };
      case 4:
      case 5:
        return { text: "Strong", color: "text-success" };
      default:
        return { text: "", color: "" };
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Reset password for:", email, "with token:", token);

      // Clear stored email
      localStorage.removeItem("resetEmail");

      // Redirect to login with success message
      // window.location.href = '/login?message=password-reset-success';

      // Add your password reset logic here
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ general: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);
  const isFormValid = formData.password && formData.confirmPassword;

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
          <p className="text-default-500 mt-2">Create your new password</p>
        </div>

        {/* Reset Password Card */}
        <Card className="w-full bg-content1/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Icon
                  className="text-primary text-xl"
                  icon="lucide:lock-keyhole"
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Reset Password
              </h2>
              <p className="text-default-500 text-sm mt-1">
                Enter your new password for
              </p>
              <p className="font-semibold text-foreground text-sm">{email}</p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {/* General Error */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <p className="text-danger text-sm">{errors.general}</p>
                </div>
              )}

              {/* New Password Input */}
              <div className="space-y-2">
                <Input
                  isRequired
                  classNames={{
                    inputWrapper: `border-primary/40 focus-within:border-primary ${errors.password ? "border-danger" : ""}`,
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="text-default-400 w-5 h-5" />
                      ) : (
                        <Eye className="text-default-400 w-5 h-5" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password}
                  isInvalid={!!errors.password}
                  label="New Password"
                  placeholder="Enter your new password"
                  startContent={
                    <Icon className="text-default-400" icon="lucide:lock" />
                  }
                  type={isPasswordVisible ? "text" : "password"}
                  value={formData.password}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("password", value)
                  }
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-default-500">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${strengthInfo.color}`}
                      >
                        {strengthInfo.text}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            index < passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-danger"
                                : passwordStrength <= 3
                                  ? "bg-warning"
                                  : "bg-success"
                              : "bg-default-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <Input
                isRequired
                classNames={{
                  inputWrapper: `border-primary/40 focus-within:border-primary ${errors.confirmPassword ? "border-danger" : ""}`,
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOff className="text-default-400 w-5 h-5" />
                    ) : (
                      <Eye className="text-default-400 w-5 h-5" />
                    )}
                  </button>
                }
                errorMessage={errors.confirmPassword}
                isInvalid={!!errors.confirmPassword}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                startContent={
                  <Icon className="text-default-400" icon="lucide:lock" />
                }
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={formData.confirmPassword}
                variant="bordered"
                onValueChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
              />

              {/* Password Requirements */}
              <div className="p-4 rounded-lg bg-default-50 border border-default-200">
                <p className="text-sm font-medium text-default-700 mb-2">
                  Password requirements:
                </p>
                <ul className="space-y-1 text-xs text-default-600">
                  <li
                    className={`flex items-center gap-2 ${formData.password.length >= 8 ? "text-success" : ""}`}
                  >
                    <Icon
                      className="w-3 h-3"
                      icon={
                        formData.password.length >= 8
                          ? "lucide:check"
                          : "lucide:circle"
                      }
                    />
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-success" : ""}`}
                  >
                    <Icon
                      className="w-3 h-3"
                      icon={
                        /[A-Z]/.test(formData.password)
                          ? "lucide:check"
                          : "lucide:circle"
                      }
                    />
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? "text-success" : ""}`}
                  >
                    <Icon
                      className="w-3 h-3"
                      icon={
                        /[a-z]/.test(formData.password)
                          ? "lucide:check"
                          : "lucide:circle"
                      }
                    />
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/\d/.test(formData.password) ? "text-success" : ""}`}
                  >
                    <Icon
                      className="w-3 h-3"
                      icon={
                        /\d/.test(formData.password)
                          ? "lucide:check"
                          : "lucide:circle"
                      }
                    />
                    One number
                  </li>
                </ul>
              </div>

              {/* Reset Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                isDisabled={!isFormValid || passwordStrength < 3}
                isLoading={isLoading}
                size="lg"
                type="submit"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
                  href="/login"
                >
                  <Icon className="text-sm" icon="lucide:arrow-left" />
                  Back to sign in
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

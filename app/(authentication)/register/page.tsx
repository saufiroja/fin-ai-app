"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration attempt:", formData);
      // Add your registration logic here
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    acceptTerms;

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
            Join Fin-AI
          </h1>
          <p className="text-default-500 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <Card className="w-full bg-content1/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Create Account
              </h2>
              <p className="text-default-500 text-sm mt-1">
                Fill in your details to get started
              </p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-4" onSubmit={handleRegister}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  classNames={{
                    inputWrapper: `border-primary/40 focus-within:border-primary ${errors.firstName ? "border-danger" : ""}`,
                  }}
                  errorMessage={errors.firstName}
                  isInvalid={!!errors.firstName}
                  label="First Name"
                  placeholder="Enter first name"
                  startContent={
                    <Icon className="text-default-400" icon="lucide:user" />
                  }
                  type="text"
                  value={formData.firstName}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("firstName", value)
                  }
                />

                <Input
                  isRequired
                  classNames={{
                    inputWrapper: `border-primary/40 focus-within:border-primary ${errors.lastName ? "border-danger" : ""}`,
                  }}
                  errorMessage={errors.lastName}
                  isInvalid={!!errors.lastName}
                  label="Last Name"
                  placeholder="Enter last name"
                  startContent={
                    <Icon className="text-default-400" icon="lucide:user" />
                  }
                  type="text"
                  value={formData.lastName}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("lastName", value)
                  }
                />
              </div>

              {/* Email Input */}
              <Input
                isRequired
                classNames={{
                  inputWrapper: `border-primary/40 focus-within:border-primary ${errors.email ? "border-danger" : ""}`,
                }}
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email Address"
                placeholder="Enter your email"
                startContent={
                  <Icon className="text-default-400" icon="lucide:mail" />
                }
                type="email"
                value={formData.email}
                variant="bordered"
                onValueChange={(value) => handleInputChange("email", value)}
              />

              {/* Password Input */}
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
                label="Password"
                placeholder="Create a password"
                startContent={
                  <Icon className="text-default-400" icon="lucide:lock" />
                }
                type={isPasswordVisible ? "text" : "password"}
                value={formData.password}
                variant="bordered"
                onValueChange={(value) => handleInputChange("password", value)}
              />

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
                label="Confirm Password"
                placeholder="Confirm your password"
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

              {/* Register Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                isDisabled={!isFormValid}
                isLoading={isLoading}
                size="lg"
                type="submit"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Social Register Divider */}
            <div className="flex items-center gap-4 my-6">
              <Divider className="flex-1" />
              <span className="text-default-400 text-sm">Or register with</span>
              <Divider className="flex-1" />
            </div>

            {/* Social Register Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="border-default-300 hover:border-primary/50"
                startContent={<Icon className="text-lg" icon="lucide:github" />}
                variant="bordered"
              >
                GitHub
              </Button>
              <Button
                className="border-default-300 hover:border-primary/50"
                startContent={<Icon className="text-lg" icon="lucide:chrome" />}
                variant="bordered"
              >
                Google
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-default-500 text-sm">
                Already have an account?{" "}
                <Link
                  className="text-primary hover:text-primary/80 font-medium"
                  href="/login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        {/* <div className="text-center mt-8">
          <p className="text-default-400 text-xs">
            By creating an account, you agree to our{" "}
            <Link href="#" size="sm" className="text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" size="sm" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { loginUser } from "@/lib/redux/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

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
            Welcome to Fin-AI
          </h1>
          <p className="text-default-500 mt-2">
            Sign in to your financial assistant
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full bg-content1/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
              <p className="text-default-500 text-sm mt-1">
                Enter your credentials to access your account
              </p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <Input
                isRequired
                classNames={{
                  inputWrapper: "border-primary/40 focus-within:border-primary",
                }}
                label="Email Address"
                placeholder="Enter your email"
                startContent={
                  <Icon className="text-default-400" icon="lucide:mail" />
                }
                type="email"
                value={email}
                variant="bordered"
                onValueChange={setEmail}
              />

              {/* Password Input */}
              <Input
                isRequired
                classNames={{
                  inputWrapper: "border-primary/40 focus-within:border-primary",
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
                label="Password"
                placeholder="Enter your password"
                startContent={
                  <Icon className="text-default-400" icon="lucide:lock" />
                }
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                variant="bordered"
                onValueChange={setPassword}
              />

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  className="text-primary hover:text-primary/80"
                  href="/forgot-password"
                  size="sm"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                isDisabled={!email || !password}
                isLoading={loading}
                size="lg"
                type="submit"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Social Login Divider */}
            <div className="flex items-center gap-4 my-6">
              <Divider className="flex-1" />
              <span className="text-default-400 text-sm">Or continue with</span>
              <Divider className="flex-1" />
            </div>

            {/* Social Login Buttons */}
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

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-default-500 text-sm">
                Don&apos;t have an account?
                <Link
                  className="text-primary hover:text-primary/80 font-medium"
                  href="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        {/* <div className="text-center mt-8">
          <p className="text-default-400 text-xs">
            By signing in, you agree to our{" "}
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

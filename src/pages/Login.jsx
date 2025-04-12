import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Check, ArrowLeft, Edit2, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState("unchecked"); // unchecked, checking, valid, invalid
  const lastCheckedEmail = useRef("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check email as user types (with debounce)
  useEffect(() => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailStatus("unchecked");
      return;
    }

    // Skip if we've already checked this email
    if (formData.email === lastCheckedEmail.current) {
      return;
    }

    const checkEmailStatus = async () => {
      setEmailStatus("checking");
      
      // In a real app, you would validate email against your database
      // For this demo, we'll simulate email validation
      setTimeout(() => {
        // Simulate email validation - assume all properly formatted emails exist for demo
        setEmailStatus("valid");
        lastCheckedEmail.current = formData.email;
      }, 600);
    };

    // Debounce check
    const timeout = setTimeout(() => {
      checkEmailStatus();
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email]);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: "", message: "" });

    if (!isValidEmail(formData.email)) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }

    setIsCheckingEmail(true);

    try {
      // In a real app, you would check if the email exists in your database
      // For this demo, we'll simulate a successful email check
      setTimeout(() => {
        setCurrentStep(2);
        setIsCheckingEmail(false);
      }, 800);
    } catch (error) {
      console.error("Error checking email:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error verifying email. Please try again.",
      });
      setIsCheckingEmail(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, type: "", message: "" });

    try {
      await login(formData.email, formData.password);
      
      setAlert({
        show: true,
        type: "success",
        message: "Login successful! Redirecting to dashboard..."
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Failed to log in", error);
      
      setAlert({
        show: true,
        type: "error",
        message: "Login failed. Please check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {currentStep === 1 ? "Welcome Back" : "Enter Password"}
          </h2>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold">
                {currentStep > 1 ? <Check size={16} /> : "1"}
              </div>
              <div className="relative h-1 w-16 mx-1">
                <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div
                  className={`absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full transition-transform duration-500 ease-out origin-left ${
                    currentStep > 1 ? "scale-x-100" : "scale-x-0"
                  }`}
                ></div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold overflow-hidden relative ${
                  currentStep === 2 ? "text-white" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-blue-600 dark:bg-blue-500 transition-transform duration-300 ${
                    currentStep > 1 ? "scale-100" : "scale-0"
                  }`}
                ></div>
                <span className="relative z-10">2</span>
              </div>
            </div>
          </div>

          {/* Alert messages */}
          {alert.show && (
            <div
              className={`mb-4 p-3 rounded-md text-center text-sm font-medium ${
                alert.type === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:bg-opacity-30 dark:text-green-300"
                  : alert.type === "warning"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:bg-opacity-30 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-800 dark:bg-opacity-30 dark:text-red-300"
              }`}
            >
              {alert.message}
            </div>
          )}

          {/* Form container with slide animations */}
          <div className="relative overflow-hidden">
            {/* Step 1: Email */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 1
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              {currentStep === 1 && (
                <form onSubmit={handleCheckEmail} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 dark:text-gray-300">Enter your email to continue</p>
                  </div>

                  {/* Email input with validation */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                          formData.email && !isValidEmail(formData.email)
                            ? "border-red-500 focus:ring-red-500"
                            : formData.email && emailStatus === "valid"
                            ? "border-green-500 focus:ring-green-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        } dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoFocus
                      />

                      {/* Status indicators inside input */}
                      {formData.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {emailStatus === "checking" ? (
                            <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : !isValidEmail(formData.email) ? (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white">
                              <X size={12} />
                            </span>
                          ) : emailStatus === "valid" ? (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                              <Check size={12} />
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isCheckingEmail ||
                      emailStatus === "checking" ||
                      !formData.email ||
                      !isValidEmail(formData.email)
                    }
                    className="w-full flex items-center justify-center"
                  >
                    {isCheckingEmail ? (
                      "Checking..."
                    ) : (
                      <>
                        Continue <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Password */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 2
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              {currentStep === 2 && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 dark:text-gray-300">Enter your password to sign in</p>
                  </div>

                  {/* Email display with edit button */}
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      size={20}
                    />
                    <div className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white flex items-center justify-between">
                      <span className="truncate">{formData.email}</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-700 dark:text-blue-300 py-3 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !formData.password}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Branding section */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome Back to FinTrack</h1>
          <p className="text-lg opacity-90 mb-6">
            Sign in to access your account and continue managing your finances effectively.
          </p>
          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <p className="opacity-90">View your financial dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <p className="opacity-90">Track your expenses and income</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <p className="opacity-90">Get personalized financial insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

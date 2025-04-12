import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Check, ArrowLeft, X, Edit2, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { authService } from "../services/api"; // Import authService

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: ""
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length;

  const getFirstMissingRequirement = () => {
    if (!passwordValidation.minLength) {
      return { message: "Password must be at least 8 characters" };
    }
    if (!passwordValidation.hasUppercase) {
      return { message: "Add at least 1 uppercase letter (A-Z)" };
    }
    if (!passwordValidation.hasLowercase) {
      return { message: "Add at least 1 lowercase letter (a-z)" };
    }
    if (!passwordValidation.hasSpecial) {
      return { message: "Add at least 1 special character (!@#$%^&*)" };
    }
    if (!passwordValidation.hasNumber) {
      return { message: "Add at least 1 number (0-9)" };
    }
    return null;
  };

  const handleEmailContinue = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a valid email address"
      });
      return;
    }

    setIsCheckingEmail(true);

    try {
      setTimeout(() => {
        setIsEmailValid(true);
        setCurrentStep(2);
        setIsCheckingEmail(false);
      }, 800);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "Error checking email. Please try again."
      });
      setIsCheckingEmail(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        message: "Passwords do not match"
      });
      return;
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      setAlert({
        show: true,
        type: "error",
        message: "Please meet all password requirements"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the authService with properly formatted data
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword, // snake_case as expected by backend
        first_name: formData.firstName, // snake_case as expected by backend
        last_name: formData.lastName // snake_case as expected by backend
      });

      console.log("Signup successful:", response.data);

      setAlert({
        show: true,
        type: "success",
        message: "Account created successfully! Please check your email for verification."
      });
      
      // Navigate to verification page after success
      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 1500);

    } catch (error) {
      console.error("Failed to create account", error);

      // Get the error message from the response
      const errorMessage = error.response?.data?.detail || "Failed to create account. Please try again.";
      
      setAlert({
        show: true,
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Join FinTrack</h1>
          <p className="text-lg opacity-90 mb-6">
            Take control of your finances with powerful tools for tracking, analyzing, and optimizing your spending.
          </p>
          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <p className="opacity-90">Upload and track all your expenses</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <p className="opacity-90">Visualize spending with smart analytics</p>
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

      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {currentStep === 1 ? "Create Your Account" : "Set Password"}
          </h2>

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
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold relative overflow-hidden ${
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

          {alert.show && (
            <div
              className={`mb-4 p-3 rounded-md text-center text-sm font-medium ${
                alert.type === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:bg-opacity-30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-800 dark:bg-opacity-30 dark:text-red-300"
              }`}
            >
              {alert.message}
            </div>
          )}

          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 1
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              {currentStep === 1 && (
                <form onSubmit={handleEmailContinue} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 dark:text-gray-300">Enter your details to get started</p>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                      
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                      
                    </div>
                  </div>

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
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        } dark:bg-gray-700 dark:text-white`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoFocus
                      />

                      {formData.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {!isValidEmail(formData.email) ? (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white">
                              <X size={12} />
                            </span>
                          ) : (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center"
                    disabled={isCheckingEmail || !formData.firstName || !formData.lastName || !formData.email || !isValidEmail(formData.email)}
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
                      Already have an account?{" "}
                      <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 2
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              {currentStep === 2 && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 dark:text-gray-300">Create a secure password for</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>

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

                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  {formData.password && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Password Strength:{" "}
                          {passwordStrength === 0
                            ? "Very Weak"
                            : passwordStrength <= 2
                            ? "Weak"
                            : passwordStrength <= 4
                            ? "Moderate"
                            : "Strong"}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{passwordStrength}/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength <= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {formData.password && (
                    <div className="py-1">
                      {(() => {
                        const missingRequirement = getFirstMissingRequirement();

                        if (missingRequirement) {
                          return (
                            <div className="flex items-center text-xs">
                              <span className="flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-yellow-500 text-white">
                                <X size={12} />
                              </span>
                              <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                                {missingRequirement.message}
                              </span>
                            </div>
                          );
                        } else if (
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                        ) {
                          return (
                            <div className="flex items-center text-xs">
                              <span className="flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-500 text-white">
                                <X size={12} />
                              </span>
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                Passwords do not match
                              </span>
                            </div>
                          );
                        } else if (
                          formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ) {
                          return (
                            <div className="flex items-center text-xs">
                              <span className="flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-green-500 text-white">
                                <Check size={12} />
                              </span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                Passwords match! You're good to go.
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        isSubmitting ||
                        !formData.password ||
                        !formData.confirmPassword ||
                        formData.password !== formData.confirmPassword ||
                        !Object.values(passwordValidation).every(Boolean)
                      }
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

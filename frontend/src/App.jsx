// import { useState } from 'react'
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/signUpPage";
import LoginPage from "./pages/logInPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/Dashboard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const state = useAuthStore();

  const RedirectAuthenticatedUser = ({ children }) => {
    useEffect(() => {
      if (state.isAuthenticated) {
        navigate("/");
      }
    }, [state.isAuthenticated, navigate]);

    return children;
  };

  const ProtectedPage = ({ children }) => {
    useEffect(() => {
      if (!state.isAuthenticated) {
        navigate("/signup");
      } else if (!state.user) {
        navigate("/verify-email");
      }
    }, [state.isAuthenticated, state?.user?.isVerified, navigate]);

    return children;
  };

  return (
    <div class="min-h-screen bg-gradient-to-tr from-blue-700 to-purple-700 h-screen w-full flex items-center justify-center">
      {/* <h1 className='text-red-500 text-5xl font-bold'>My React App</h1> */}

      {isCheckingAuth ? (
        <Loader className="animate-spin mx-24" size={24} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <DashboardPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/verify-email"
            element={
              <RedirectAuthenticatedUser>
                <VerifyEmailPage />
              </RedirectAuthenticatedUser>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;

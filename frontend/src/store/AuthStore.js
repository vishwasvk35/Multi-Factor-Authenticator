import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: false,
  
    signup: async ({ name, email, password }) => {
      set({ isLoading: true, error: null });
  
      console.log("Signup request:", { name, email, password });
  
      try {
        // API call to the signup endpoint
        const response = await apiClient.post(`/signup`, {
          name,
          email,
          password,
        });
  
        console.log("Signup success:", response.data);
  
        // Update store on successful signup
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        // Extract meaningful error message
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred.";
  
        console.error("Signup error:", errorMessage);
  
        // Update store on error
        set({
          error: errorMessage,
          isLoading: false,
        });
  
        throw new Error(errorMessage); // Throw error for further handling
      }
    },

    verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null });
    
        try {
          const response = await apiClient.post(`/verify-email`, {
            verificationCode,
          });
    
          console.log("Email verification success:", response.data);

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
    
          return response.data; // Return data for further use
        } catch (e) {
          const errorMessage =
            e.response?.data?.message || "Failed to verify email.";
    
          console.error("Email verification error:", errorMessage);
    
          set({
            error: errorMessage,
            isLoading: false,
          });
    
          throw new Error(errorMessage); // Throw error for external handling
        }
      },
  }));
  
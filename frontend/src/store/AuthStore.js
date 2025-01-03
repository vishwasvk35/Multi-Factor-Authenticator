import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: process.env.NODE_ENV==="development" ?  "http://localhost:3000/api/auth" : "/api/auth",
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

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await apiClient.get(`/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
      const state = useAuthStore.getState();
      console.log(state.user);
    } catch (err) {
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
		set({ isLoading: true, error: null });
    console.log({email, password});

		try {
			const response = await apiClient.post(`/login`, { email, password });
      console.log(response);
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});

      console.log(user);
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(`/logout`);
      console.log(response.data);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

  forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(`/forgot-password`, { email });
			set({ isLoading: false });
      return response;
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

  resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await apiClient.post(`/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));

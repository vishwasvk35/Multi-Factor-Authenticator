import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";
import { LucideUser, LucideMail, LucideLock, Loader } from "lucide-react";

const ResetPasswordPage = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const state = useAuthStore.getState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="bg-slate-800 bg-opacity-30 border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-4xl font-medium text-blue-500 mb-6 m-7 text-center">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-5 m-7" action="post">
        <Input
          Icon={LucideLock}
          type="password"
          placeholder="type password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          Icon={LucideLock}
          type="password"
          placeholder="confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="text"
          placeholder={
            isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Reset password"
            )
          }
        />
      </form>

      <p className="text-red-500 text-center">
        {state?.error ? state.error : " "}
      </p>
      {console.log(error)}

      <div className="loginLink text-center mt-4 bg-gray-800 bg-opacity-75 rounded-b-xl">
        <p className="text-gray-400 text-sm h-12 flex items-center justify-center">
          Go back to
          <Link
            to={"/login"}
            className="text-blue-300 hover:text-blue-500 ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

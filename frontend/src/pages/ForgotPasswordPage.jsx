import { useAuthStore } from "../store/AuthStore";
import toast from "react-hot-toast";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { LucideMail, Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setSubmit] = useState(false);

  const { forgotPassword, isLoading, error } = useAuthStore();
  async function handleClick(event) {
    event.preventDefault();
    try {
      const response = await forgotPassword(email);
      console.log("ForgotPassword successful:", response.data.message);
      setSubmit(true);
      console.log(isSubmitted);
      toast.success("Password reset email sent successfully");
    } catch (error) {}
  }

  const state = useAuthStore.getState();

  return (
    <>
      <div className="bg-slate-900 bg-opacity-30 border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {!isSubmitted ? (
          <div>
            <h1 className="text-4xl font-medium text-blue-500 mb-6 m-7 text-center">
              Forgot password
            </h1>
            <form
              onSubmit={(e) => handleClick(e)}
              className="grid gap-5 m-7"
              action="post"
            >
              <Input
                Icon={LucideMail}
                type="text"
                placeholder="email address"
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="text"
                placeholder={
                  isLoading ? (
                    <Loader className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Send reset email"
                  )
                }
              />
            </form>
            <p className="text-red-500 text-center">
              {state?.error ? state.error : " "}
            </p>

            {console.log(error)}{" "}

            <div className="loginLink text-center mt-4 bg-gray-800 bg-opacity-75 rounded-b-xl">
              <p className="text-gray-400 text-sm h-12 flex items-center justify-center">
                Go back to{" "}
                <Link
                  to={"/login"}
                  className="text-blue-300 hover:text-blue-500 ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-300 mb-6">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import PassworkChecker from "../components/PasswordChecker";
import { LucideUser, LucideMail, LucideLock, Loader } from "lucide-react";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  async function handleClick(event) {
    event.preventDefault();

    try {
      await signup({ name: username, email, password });
      navigate("/verify-email");
    } catch (error) {}
  }

  const state = useAuthStore.getState();

  return (
    <div className="bg-slate-800 bg-opacity-30 border-gray-800 rounded-xl shadow-2xl w-full max-w-md m-7">
      <h1 className="text-4xl font-medium text-blue-500 mb-6 m-7 text-center">
        Create Account
      </h1>

      <form onSubmit={handleClick} className="grid gap-5 m-7" action="post">
        <Input
          Icon={LucideUser}
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          Icon={LucideMail}
          type="text"
          placeholder="email address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          Icon={LucideLock}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="text"
          placeholder={
            isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "signup"
            )
          }
        />
      </form>

      
      <p className="text-red-500 text-center">{state?.error ? state.error : " "}</p>
      {console.log(error)}

      <div className="password-strength mt-6 m-7">
        <h2 className="my-3">we recommend using a strong password</h2>
        <PassworkChecker password={password} />
      </div>

      <div className="loginLink text-center mt-4 bg-gray-800 bg-opacity-75 rounded-b-xl">
        <p className="text-gray-400 text-sm h-12 flex items-center justify-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-blue-300 hover:text-blue-500 ml-3"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

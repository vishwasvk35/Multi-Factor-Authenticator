import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import { LucideMail, LucideLock } from "lucide-react";
import { useAuthStore } from "../store/AuthStore";
import { Loader } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, isLoading, error } = useAuthStore();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await login(email, password );
      navigate("/");
    } catch (error) {}
  }

  return (
    <div className="bg-slate-300 bg-opacity-10 border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-4xl font-mono text-blue-500 mb-6 m-7 text-center">
        Login
      </h1>

      <form  onSubmit={ e => handleSubmit(e)} className="grid gap-5 m-7" action="post">
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

          <Link
            to={"/reset-password"}
          >
            <span className="text-gray-800 hover:text-blue-800  ml-3" >Forgot password?</span>
          </Link>

        <Button type="submit" placeholder={isLoading ? <Loader className="animate-spin mx-24" size={24} /> : "Log In"}  />
      </form>

      <p className="text-red-500 text-center">{error ? error : " "}</p>

      <div className="loginLink text-center mt-4 bg-gray-800 bg-opacity-75 rounded-b-xl">
        <p className="text-gray-400 text-sm h-12 flex items-center justify-center">
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            className="text-blue-300 hover:text-blue-500 ml-3"
          >
            signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import PassworkChecker from "../components/PasswordChecker";
import { LucideUser, LucideMail, LucideLock } from "lucide-react";
import VerifyEmailPage from "./VerifyEmailPage";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-slate-300 bg-opacity-10 border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-4xl font-mono text-blue-500 mb-6 m-7 text-center">
        Create Account
      </h1>

      <form className="grid gap-5 m-7" action="post">
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

        <Button type="text" placeholder="Sign Up" />
      </form>

      <div className="password-strength mt-6 m-7">
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

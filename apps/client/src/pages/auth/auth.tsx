import { useState } from "react";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";

const Auth = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const toggleForm = () => {
    currentForm === "login"
      ? setCurrentForm("register")
      : setCurrentForm("login");
  };
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 p-4 shadow-2xl rounded-2xl w-[90vw] max-w-256">
        <div className="flex flex-col w-full h-full items-center justify-center p-4 pb-0 md:pb-4">
          <img src="/logo.png" className="w-25 md:w-50" />
          <p className="text-violet-600 text-2xl md:text-5xl font-bold hidden md:block">
            FlowIT
          </p>
        </div>
        <div className="flex items-center">
          {currentForm === "login" ? (
            <LoginForm toggleForm={toggleForm} />
          ) : (
            <RegisterForm toggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

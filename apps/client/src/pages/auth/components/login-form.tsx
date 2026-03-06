import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const LoginForm = ({ toggleForm }: { toggleForm: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isButtonActive, setIsButtonActive] = useState(false);

  const submitForm = () => {
    const data = { email, password };
    toast.success("Ви успішно авторизувались");
  };

  const validateEmail = (email: string) => {
    const pattern = /\S+@\S+\.\S+/;
    return pattern.test(email);
  };

  useEffect(() => {
    if (!validateEmail(email)) {
      setIsButtonActive(false);
      return;
    }
    if (password.length < 6) {
      setIsButtonActive(false);
      return;
    }
    setIsButtonActive(true);
  }, [email, password]);

  return (
    <div className="flex flex-col justify-between items-center p-4 w-full h-112">
      <p className="font-semibold text-2xl text-violet-600">Вхід</p>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-1 w-full">
          <p className="px-2">Електронна пошта</p>
          <input
            type="text"
            className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <p className="px-2">Пароль</p>
          <div className="flex border-0 outline-0 text-md w-full bg-zinc-100 rounded-xl p-2">
            <input
              type={showPassword ? "text" : "password"}
              className="border-0 outline-0 text-md flex-1 bg-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="px-2 cursor-pointer text-zinc-700"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        <button
          disabled={!isButtonActive}
          className="w-full rounded-xl p-2 bg-violet-600 text-white hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed font-semibold cursor-pointer transition-all duration-300"
          onClick={submitForm}
        >
          Увійти
        </button>
      </div>

      <div className="flex flex-col text-md">
        <p>Не маєте акаунту?</p>
        <button
          className="text-violet-600 border-b border-transparent hover:border-violet-400 cursor-pointer transition-all duration-300"
          onClick={toggleForm}
        >
          Зареєструватись
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

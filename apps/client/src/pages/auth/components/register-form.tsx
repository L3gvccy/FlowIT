import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { LOGIN_URL } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

const RegisterForm = ({ toggleForm }: { toggleForm: () => void }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isButtonActive, setIsButtonActive] = useState(false);

  const validatePassword = (): boolean => {
    if (password !== confirmPassword) {
      toast.error("Паролі не співпадають");
      return false;
    }

    return true;
  };

  const submitForm = async () => {
    if (!validatePassword()) return;

    const data = { email, password };

    await apiClient
      .post(LOGIN_URL, data)
      .then((res) => {
        dispatch(setUser(res.data.user));
        toast.success("Ви успішно авторизувались");
        localStorage.setItem("accessToken", res.data.accessToken);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
    if (password.length < 6 && confirmPassword.length < 6) {
      setIsButtonActive(false);
      return;
    }
    setIsButtonActive(true);
  }, [email, password, confirmPassword]);

  return (
    <div className="flex flex-col justify-between items-center p-4 w-full h-112">
      <p className="font-semibold text-2xl text-violet-600">Реєстрація</p>
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

        <div className="flex flex-col gap-1 w-full">
          <p className="px-2">Підтвердження паролю</p>
          <input
            type={showPassword ? "text" : "password"}
            className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        <button
          disabled={!isButtonActive}
          className="w-full rounded-xl p-2 bg-violet-600 text-white hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed font-semibold cursor-pointer transition-all duration-300"
          onClick={submitForm}
        >
          Зареєструватись
        </button>
      </div>

      <div className="flex flex-col text-md">
        <p>Вже маєте акаунт?</p>
        <button
          className="text-violet-600 border-b border-transparent hover:border-violet-400 cursor-pointer transition-all duration-300"
          onClick={toggleForm}
        >
          Увійти
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;

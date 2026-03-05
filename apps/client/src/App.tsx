import { useState } from "react";
import Loader from "./components/loader";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const [loading, setloading] = useState(true);
  if (loading)
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Loader size={24} />
      </div>
    );
  return <></>;
}

export default App;

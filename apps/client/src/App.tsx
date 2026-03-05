import { useEffect, useState } from "react";
import Loader from "./components/loader";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { apiClient } from "./utils/api-client";
import { GET_ME_URL } from "./utils/constants";
import { clearUser, setUser } from "./store/userSlice";
import { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout/layout";
import Landing from "./pages/landing/landing";
import Auth from "./pages/auth/auth";
import Profile from "./pages/profile/profile";
import Projects from "./pages/project/projects";
import ProfileSetup from "./pages/profile/profile-setup";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const isAuthenticated = !!user?.id;

  if (isAuthenticated) {
    return user.isProfileCompleted ? (
      children
    ) : (
      <Navigate to="/setup-profile" />
    );
  } else {
    return <Navigate to="/auth" />;
  }
};

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const isAuthenticated = !!user?.id;

  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  const dispatch = useDispatch();

  const getMe = async () => {
    await apiClient
      .get(GET_ME_URL)
      .then((res) => {
        dispatch(setUser(res.data.user));
      })
      .catch((err) => {
        dispatch(clearUser());
        console.error(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    getMe();
  }, []);
  const [loading, setloading] = useState(true);
  if (loading)
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Loader size={24} />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />

          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

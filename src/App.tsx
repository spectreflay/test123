import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StaffLogin from "./components/auth/StaffLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateStore from "./pages/CreateStore";
import Stores from "./pages/Stores";
import UserManagement from "./pages/UserManagement";
import Unauthorized from "./pages/Unauthorized";
import Subscription from "./pages/Subscription";
import { RootState } from "./store";
import { PERMISSIONS } from "./utils/permissions";

function App() {
  const { token, staff } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && location.pathname === "/") {
      if (staff) {
        navigate(`/stores/${staff.store}/dashboard`);
      } else {
        navigate("/stores");
      }
    }
  }, [token, staff, navigate, location.pathname]);

  return (
    <ThemeProvider>
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              staff ? (
                <Navigate to={`/stores/${staff.store}/dashboard`} replace />
              ) : (
                <Stores />
              )
            }
          />
          <Route
            path="stores"
            element={
              staff ? (
                <Navigate to={`/stores/${staff.store}/dashboard`} replace />
              ) : (
                <Stores />
              )
            }
          />

          <Route
            path="stores/create"
            element={
              staff ? (
                <Navigate to={`/stores/${staff.store}/dashboard`} replace />
              ) : (
                <CreateStore />
              )
            }
          />
          <Route path="stores/:storeId">
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_SETTINGS}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;


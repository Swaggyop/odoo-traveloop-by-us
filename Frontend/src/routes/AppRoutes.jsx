import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import MyTrips from "../pages/trips/MyTrips";
import BudgetPage from "../pages/budget/BudgetPage";
import ActivityPage from "../pages/activities/ActivityPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import CreateTripPage from "../pages/trips/CreateTripPage";
import ProfilePage from "../pages/profile/ProfilePage";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Redirect Root */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/trips"
          element={
            <DashboardLayout>
              <MyTrips />
            </DashboardLayout>
          }
        />

        <Route
          path="/budget"
          element={
            <DashboardLayout>
              <BudgetPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/activities"
          element={
            <DashboardLayout>
              <ActivityPage />
            </DashboardLayout>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

        <Route
  path="/create-trip"
  element={
    <DashboardLayout>
      <CreateTripPage />
    </DashboardLayout>
  }
/>

<Route
  path="/profile"
  element={
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;
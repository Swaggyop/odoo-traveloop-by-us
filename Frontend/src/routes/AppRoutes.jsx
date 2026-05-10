import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import MyTrips from "../pages/trips/MyTrips";

function AppRoutes() {
  return (
    <BrowserRouter>

      <DashboardLayout>

        <Routes>

          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/trips"
            element={<MyTrips />}
          />

        </Routes>

      </DashboardLayout>

    </BrowserRouter>
  );
}

export default AppRoutes;
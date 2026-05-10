import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import MyTrips from "../pages/trips/MyTrips";
import BudgetPage from "../pages/budget/BudgetPage";

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

          <Route
            path="/budget"
            element={<BudgetPage />}
          />

        </Routes>

      </DashboardLayout>

    </BrowserRouter>
  );
}

export default AppRoutes;
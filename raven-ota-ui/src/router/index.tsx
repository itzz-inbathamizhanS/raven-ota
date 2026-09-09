import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";

// Page placeholders
import { OverviewPage } from "../pages/OverviewPage";
import { DashboardPage } from "../pages/DashboardPage";
import { FleetPage } from "../pages/FleetPage";
import { VehicleDetailPage } from "../pages/VehicleDetailPage";
import { OTACampaignsPage } from "../pages/OTACampaignsPage";
import { OTADetailPage } from "../pages/OTADetailPage";
import { AssurancePage } from "../pages/AssurancePage";
import { IncidentsPage } from "../pages/IncidentsPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { SimulatorPage } from "../pages/SimulatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "vehicles", element: <FleetPage /> },
      { path: "vehicles/:id", element: <VehicleDetailPage /> },
      { path: "ota", element: <OTACampaignsPage /> },
      { path: "ota/:id", element: <OTADetailPage /> },
      { path: "assurance", element: <AssurancePage /> },
      { path: "incidents", element: <IncidentsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "simulator", element: <SimulatorPage /> },
    ],
  },
]);

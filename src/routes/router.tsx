import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../ui/AppLayout";
// import { AppLayout } from "../ui/AppLayout";
import BookingsPage from "../features/bookings/BookingsPage"; //for the main time lest kep pages with features
import Dashboard from "../pages/DashboardPage";
import CabinsPage from "../features/cabins/Cabinspage";
import ErrorFallback from "../ui/ErrorFallback";
import { BookingDetailPage } from "../features/bookings/BookingDetailPage";
// import { mockBookings } from "../data/MockData";
// import { BookingsTable } from "../features/bookings/BookingsTable";
import UserPage from "../features/users/UserPage";
import SettingsPage from "../features/settings/SettingsPageComplete";
import AccountSettingsPage from "../features/account/AccountSettingsPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../ui/ProtectedRoute";

export const router = createBrowserRouter([
  {
    // 1. PUBLIC AREA
    path: "/login",
    element: <LoginPage />,
  },
  {
    // 2. PROTECTED AREA (The Wrapper)
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        errorElement: <ErrorFallback />,
        children: [
          {
            index: true,
            element: <Navigate replace to="dashboard" />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "bookings",
            element: <BookingsPage />,
          },
          {
            path: "bookings/:bookingId",
            element: <BookingDetailPage />,
          },
          {
            path: "cabins",
            element: <CabinsPage />,
          },
          {
            path: "users",
            element: <UserPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "account",
            element: <AccountSettingsPage />,
          },
        ],
      },
    ],
  },
]);


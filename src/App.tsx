import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppBootstrap from './components/AppBootstrap'
import ProtectedRoute from './router/ProtectedRoute'
import AdminRoute from './router/AdminRoute'

import LoginPage from './pages/auth/LoginPage'
import ChangePasswordPage from './pages/user/ChangePasswordPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import UsersPage from './pages/user/UsersPage'
import GeneralSettings from './pages/dashboard/GeneralSettings'
import Notifications from './pages/dashboard/Notifications'
import SecuritySettings from './pages/dashboard/SecuritySettings'
import UserProfile from './pages/user/UserProfile'
import Roles from './pages/user/Roles'
import Permissions from './pages/user/Permissions'
import TransactionReports from './pages/reports/TransactionReport'
import FilesReports from './pages/reports/FilesReports'

import MonitoringVBG_Page from './config/demo/MonitoringVBGPage'
import MonitoringCAG_Page from './config/demo/MonitoringCAGPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppBootstrap>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />

             <Route
              path="dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="monitor/VBG"
              element={<MonitoringVBG_Page />}
            />

            <Route
              path="monitor/CAG"
              element={<MonitoringCAG_Page />}
            />

            <Route
              path="reports/transactions"
              element={<TransactionReports />}
            />

            <Route
              path="reports/files"
              element={<FilesReports />}
            />

            <Route
              path="users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />

            <Route
              path="users/change-password"
              element={<ChangePasswordPage />}
            />

            <Route
              path="users/roles"
              element={<Roles />}
            />

            <Route
              path="users/permissions"
              element={<Permissions />}
            />

            <Route
              path="settings/general"
              element={<GeneralSettings />}
            />

            <Route
              path="settings/security"
              element={<SecuritySettings />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />
            
            <Route
              path="profile"
              element={<UserProfile />}
            />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Route>
        </Routes>
      </AppBootstrap>
    </BrowserRouter>
  )
}
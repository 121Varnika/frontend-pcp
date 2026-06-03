// BrowserRouter with Route definitions; wraps private routes in ProtectedRoute
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { IssueProvider } from '../context/TaskContext';

function AppRouter() {
  return (
    <BrowserRouter>
      <IssueProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </IssueProvider>
    </BrowserRouter>
  );
}

export default AppRouter;

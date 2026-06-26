/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Register from './pages/Register';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';

// Protected Route Component
const ProtectedRoute = ({ children, requireCategories = false }: { children: React.ReactNode, requireCategories?: boolean }) => {
  const { user, categories } = useStore();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requireCategories && categories.length < 3) {
    return <Navigate to="/categories" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requireCategories>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/movies" element={
            <ProtectedRoute requireCategories>
              <Movies />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

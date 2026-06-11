import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts & Protected Route
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Error & Fallback
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';

// Main Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import BooksCatalog from './pages/BooksCatalog';
import AIRecommendations from './pages/AIRecommendations';
import MyBooks from './pages/MyBooks';
import AddBook from './pages/AddBook';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import IssueHistory from './pages/IssueHistory';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public / Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes inside Main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/catalog" element={<BooksCatalog />} />
              <Route path="/recommendations" element={<AIRecommendations />} />
              <Route path="/my-books" element={<MyBooks />} />
              
              {/* Librarian Only Routes */}
              <Route element={<ProtectedRoute requireLibrarian={true} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/issue-book" element={<IssueBook />} />
                <Route path="/return-book" element={<ReturnBook />} />
                <Route path="/issue-history" element={<IssueHistory />} />
              </Route>
            </Route>
          </Route>
          
          
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

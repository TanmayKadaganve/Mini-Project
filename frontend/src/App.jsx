
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import FacultyLogin from "./pages/FacultyLogin";
import UploadPage from "./pages/UploadPage";
import Footer from "./components/Footer";

// Protect Upload Page
function FacultyProtectedRoute({ children }) {
  const token = localStorage.getItem("facultyToken");
  const role = localStorage.getItem("facultyRole");

  if (!token || role !== "faculty") {
    return <Navigate to="/faculty-login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <Footer />
            </>
          }
        />

        <Route
          path="/faculty-login"
          element={
            <>
              <FacultyLogin />
              <Footer />
            </>
          }
        />

        <Route
          path="/upload"
          element={
            <FacultyProtectedRoute>
              <UploadPage />
            </FacultyProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

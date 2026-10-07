import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function DebugBar() {
  const { user, loading, accessToken } = useAuth();
  return (
    <div style={{ padding: "1rem", background: "#1a4a34", fontSize: "0.85rem" }}>
      {loading
        ? "Loading session..."
        : user
        ? `Logged in as: ${user.email} (token: ${accessToken?.slice(0, 12)}...)`
        : "Not logged in"}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DebugBar />
        <Routes>
          <Route path="/" element={<div style={{ padding: "2rem" }}>Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
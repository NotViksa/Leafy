import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Details from "./pages/Details";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import MyPosts from "./pages/MyPosts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/:postId" element={<Details />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/feed/:postId/edit"
              element={<ProtectedRoute><Edit /></ProtectedRoute>}
            />
            <Route
              path="/create"
              element={<ProtectedRoute><Create /></ProtectedRoute>}
            />
            <Route
              path="/my-posts"
              element={<ProtectedRoute><MyPosts /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
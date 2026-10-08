import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AuthLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="auth-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
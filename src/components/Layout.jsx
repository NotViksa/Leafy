import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
}
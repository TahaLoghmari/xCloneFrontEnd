import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function App() {
  const navigate = useNavigate();
  const [Auth, setAuth] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setAuth(null);
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
        const logoutTimer = setTimeout(() => {
          setAuth(null);
          localStorage.removeItem("token");
          navigate("/login");
        }, timeUntilExpiry);
        console.log("Decoded token:", decoded);
        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]; // This is the ClaimTypes.NameIdentifier claim
        const username = decoded.sub; // This is the JwtRegisteredClaimNames.Sub claim
        setAuth({ userId, username });
        // API Call
        navigate("/home");
      } catch (error) {
        setAuth(null);
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      setAuth(null);
      console.error("No token available");
      navigate("/login");
    }
    return () => clearTimeout(logoutTimer);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex h-full w-full flex-col sm:flex-row">
        {/* By default this is going to be the news feed */}
        <Outlet />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

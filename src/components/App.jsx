import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState, createContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import SearchNewsFeed from "./SearchNewsFeed";
import { API_BASE_URL } from "@/lib/api";

export const States = createContext({ Auth: "", setAuth: () => {} });
export default function App() {
  const navigate = useNavigate();
  const [Auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/User/current`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Authentication failed or session expired");
        }
        return res.json();
      })
      .then((data) => {
        setAuth(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setAuth(null);
        setLoading(false);
        navigate("/auth");
      });
  }, [navigate]);
  useEffect(() => {
    if (!loading && Auth) {
      navigate("/home");
    }
  }, [loading, Auth, navigate]);
  if (loading)
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="flex min-h-screen min-w-screen items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            fill="currentColor"
            className="flex h-18 w-18 items-center justify-center"
          >
            <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
          </svg>
        </div>
      </ThemeProvider>
    );
  if (!loading && Auth) {
    document.title = "Home";
    return (
      <ThemeProvider defaultTheme="dark">
        <States.Provider value={{ Auth, setAuth }}>
          <div className="flex min-h-screen w-full flex-col sm:flex-row md:w-[690px] xl:w-[1000px] xl:flex-row xl:gap-4 2xl:w-[1280px] 2xl:gap-6">
            {/* By default this is going to be the news feed */}
            <Outlet />
            <SearchNewsFeed />
            <Footer />
          </div>
        </States.Provider>
      </ThemeProvider>
    );
  }
}

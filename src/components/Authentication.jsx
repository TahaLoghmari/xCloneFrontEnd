import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { ThemeProvider } from "./theme-provider";
import GoogleIcon from "../assets/googleIcon.png";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Authentication() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <ThemeProvider defaultTheme="dark">
      <div
        className={`my-auto flex min-h-screen w-[85%] flex-col gap-10 sm:w-[70%] md:w-[60%] xl:w-[90%] xl:flex-row xl:items-center xl:justify-center 2xl:w-[70%] ${!isAuthPage && "hidden md:flex"}`}
      >
        <img
          src={WhiteXLogoNoBackground}
          alt="X Logo"
          className="h-auto w-22 xl:w-[60%]"
        />
        <div className="flex flex-col gap-10 xl:w-[40%]">
          <h1 className="w-60 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Hapenning Now
          </h1>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Join today.
          </h4>
          {/* Sign Up */}
          <div>
            <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffffff] p-3 transition-all duration-300 hover:bg-[#e6e6e6]">
              <img src={GoogleIcon} alt="Google Icon" className="h-5 w-5" />
              <p className="text-primary-foreground font-semibold">
                Sign up with Google
              </p>
            </div>
            <div className="my-2 flex items-center justify-center">
              <hr className="mx-2 w-full border-t border-gray-500" />
              <span className="mx-2 text-sm text-gray-500">or</span>
              <hr className="mx-2 w-full border-t border-gray-500" />
            </div>
            <Button
              className="text-primary h-12 w-full cursor-pointer rounded-full bg-[#4999ed] p-3 font-bold transition-all duration-300 hover:bg-[#428ad5]"
              onClick={() => navigate("/auth/signup")}
            >
              Create Account
            </Button>
          </div>
          {/* Sign In */}
          <div className="mb-8 flex flex-col gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Already have an account?
            </h4>
            {/* You Left where the button overflowing from the body for no reason */}
            <Button
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="h-13 w-full cursor-pointer rounded-full transition-all duration-300 hover:bg-[#070f16]"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
      {!isAuthPage && width >= 690 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#262d34]/75">
          <div className="bg-background max-h-[95vh] w-150 overflow-y-auto rounded-lg shadow-lg md:p-3">
            <Outlet />
          </div>
        </div>
      ) : (
        ""
      )}
      {!isAuthPage && width < 690 && <Outlet />}
    </ThemeProvider>
  );
}

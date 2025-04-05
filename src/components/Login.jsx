import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { ThemeProvider } from "./theme-provider";
import GoogleIcon from "../assets/googleIcon.png";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="my-auto flex w-[85%] flex-col gap-10">
        <img
          src={WhiteXLogoNoBackground}
          alt="X Logo"
          className="h-auto w-22"
        />
        <h1 className="w-60 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Hapenning Now
        </h1>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Join today.
        </h4>
        {/* Sign Up */}
        <div>
          <div className="bg-primary flex w-full items-center justify-center gap-2 rounded-full p-3">
            <img src={GoogleIcon} alt="Google Icon" className="h-5 w-5" />
            <p className="text-primary-foreground font-semibold">
              Sign up with Google
            </p>
          </div>
          <div class="my-2 flex items-center justify-center">
            <hr class="mx-2 w-full border-t border-gray-500" />
            <span class="mx-2 text-sm text-gray-500">or</span>
            <hr class="mx-2 w-full border-t border-gray-500" />
          </div>
          <Button className="text-primary h-12 w-full rounded-full bg-[#4999ed] p-3 font-bold hover:bg-[#428ad5]">
            Create Account
          </Button>
        </div>
        {/* Sign In */}
        <div className="flex flex-col gap-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Already have an account?
          </h4>
          {/* You Left where the button overflowing from the body for no reason */}
          <Button variant="outline" className="w-full rounded-full">
            Sign in
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

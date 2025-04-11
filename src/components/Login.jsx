import { X } from "lucide-react";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import GoogleIcon from "../assets/googleIcon.png";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { API_BASE_URL } from "@/lib/api";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";

const formSchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export default function Login() {
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (formData) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: formData.email,
        Password: formData.password,
      }),
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((t) => {
            setAuthError(t);
            throw new Error(t);
          });
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        console.log("Successfull Login");
        localStorage.setItem("token", data.token);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        setAuthError(`${error.message} . Please try again.`);
      });
  };
  if (loading)
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#262d34]/75">
          <div className="bg-background flex min-h-[80vh] w-150 items-center justify-center overflow-y-auto rounded-lg shadow-lg md:p-3">
            <div style={{ filter: "brightness(0) invert(1)" }}>
              <Lottie animationData={LoadingScreen} loop={true} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center overflow-y-auto p-3 md:min-h-full md:min-w-full md:p-0">
      <div className="flex w-full items-center">
        <X
          className="w-[5%] cursor-pointer"
          onClick={() => navigate("/auth")}
        />
        <div className="flex w-[95%] items-center justify-center">
          <img
            src={WhiteXLogoNoBackground}
            alt="X Logo"
            className="h-auto w-16"
          />
        </div>
      </div>
      <div className="mt-3 flex w-75 flex-col gap-10">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Sign in to X
        </h3>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mb-10 space-y-4"
            >
              {authError && (
                <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
                  {authError}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="h-13 rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="h-13 rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className={`mt-2 h-12 w-full cursor-pointer rounded-full font-bold transition-all duration-300 ${
                  form.formState.isValid ? "opacity-100" : "opacity-50"
                }`}
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <p className="mt-12 text-gray-600">
                Don't have an account?{" "}
                <span
                  className="cursor-pointer text-sky-500"
                  onClick={() => navigate("/auth/signup")}
                >
                  Sign up
                </span>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

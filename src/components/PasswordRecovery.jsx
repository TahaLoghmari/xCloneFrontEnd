import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { API_BASE_URL } from "@/lib/api";
import Lottie from "lottie-react";
import LoadingScreen from "../assets/LoadingScreen.json";

const formSchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters"),
});
export default function PasswordRecovery() {
  const [codeConfirmation, setCodeConfirmation] = useState(false);
  const [password, setPassword] = useState(false);
  const [AuthError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });
  const navigate = useNavigate();
  const onSubmit = async (formData) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/User/${formData.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("An error occured while sending email");
        return res.text();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        setCodeConfirmation(true);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
        setAuthError(error.message);
      });
  };
  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#262d34]/75">
          <div className="bg-background flex h-screen w-screen flex-col items-center justify-center gap-6 md:h-[72%] md:w-150 md:rounded-xl md:shadow-lg">
            <div style={{ filter: "brightness(0) invert(1)" }}>
              <Lottie animationData={LoadingScreen} loop={true} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }
  if (!codeConfirmation)
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#262d34]/75">
          <div className="bg-background flex h-screen w-screen flex-col items-center gap-6 md:h-[72%] md:w-150 md:rounded-xl md:shadow-lg">
            <div className="mx:px-4 flex h-13 w-full px-3">
              <div
                className="flex w-[5%] items-center justify-center"
                onClick={() => navigate("/auth")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5 cursor-pointer"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </div>
              <div className="flex w-[95%] items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  fill="currentColor"
                  className="h-8 w-8"
                >
                  <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
                </svg>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[83%] w-[80%] flex-col justify-between space-y-4 md:mb-6 md:h-full"
              >
                {AuthError && (
                  <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
                    {AuthError}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">
                        Find your X account
                      </FormLabel>
                      <FormDescription>
                        Enter the email associated with your account to change
                        your password.
                      </FormDescription>
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
                <Button
                  className={`h-12 w-full cursor-pointer rounded-full text-lg font-bold transition-all duration-300 ${
                    form.formState.isValid ? "opacity-100" : "opacity-50"
                  }`}
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Next..." : "Next"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </ThemeProvider>
    );
  else if (codeConfirmation)
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#262d34]/75">
          <div className="bg-background flex h-screen w-screen flex-col items-center gap-6 md:h-[72%] md:w-150 md:rounded-xl md:shadow-lg">
            <div className="mx:px-4 flex h-13 w-full px-3">
              <div
                className="flex w-[5%] items-center justify-center"
                onClick={() => navigate("/auth")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5 cursor-pointer"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </div>
              <div className="flex w-[95%] items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  fill="currentColor"
                  className="h-8 w-8"
                >
                  <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
}

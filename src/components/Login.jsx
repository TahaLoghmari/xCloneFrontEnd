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

const formSchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (formData) => {};
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
          <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffffff] p-3 transition-all duration-300 hover:bg-[#e6e6e6]">
            <img src={GoogleIcon} alt="Google Icon" className="h-5 w-5" />
            <p className="text-primary-foreground font-semibold">
              Sign in with Google
            </p>
          </div>
          <div className="my-2 flex items-center justify-center">
            <hr className="mx-2 w-full border-t border-gray-500" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <hr className="mx-2 w-full border-t border-gray-500" />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mb-10 space-y-4"
            >
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
              <div className="flex flex-col gap-5">
                <Button
                  className={`h-12 w-full cursor-pointer rounded-full font-bold transition-all duration-300 ${
                    form.formState.isValid ? "opacity-100" : "opacity-50"
                  }`}
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                <Button
                  className={`bg-background border-primary text-primary hover:text-primary-foreground h-12 w-full cursor-pointer rounded-full border font-bold transition-all duration-300`}
                >
                  Forget password?
                </Button>
              </div>
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

import { X } from "lucide-react";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default function Register({}) {
  const [authError, setAuthError] = useState(null);
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", name: "" },
  });
  const onSubmit = (data) => {
    console.log(data);
    fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: data.name,
        Email: data.email,
        Password: data.password,
        BirthDate: new Date(data.dob).toISOString(),
        ImageUrl: "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((message) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/");
      })
      .catch((error) => setAuthError(`${error} . Please try again.`));
  };
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center overflow-y-auto md:min-h-full md:min-w-full md:p-0">
      <div className="flex w-full items-center px-8 py-2">
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
      <div className="mt-6 flex w-135 flex-col gap-10 md:w-110">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Create your account
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-10 space-y-10"
          >
            {authError && (
              <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
                {authError}
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
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
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "bg-background h-13 w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={`h-12 w-full rounded-full font-bold transition-all duration-300 ${
                form.formState.isValid ? "opacity-100" : "opacity-50"
              }`}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useMemo } from "react";
import { API_BASE_URL } from "@/lib/api";
const formSchema = z.object({
  displayname: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default function Register({}) {
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", displayname: "", username: "" },
  });
  const onSubmit = (data) => {
    console.log(data);
    fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: data.username,
        DisplayName: data.displayname,
        Email: data.email,
        Password: data.password,
        BirthDate: new Date(data.dob).toISOString(),
        ImageUrl:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
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
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const months = useMemo(() => {
    const leap =
      selectedYear &&
      ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) ||
        selectedYear % 400 === 0);
    return {
      January: {
        name: "January",
        number: 1,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      February: {
        name: "February",
        number: 2,
        days: Array.from({ length: leap ? 29 : 28 }, (_, i) => i + 1),
      },
      March: {
        name: "March",
        number: 3,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      April: {
        name: "April",
        number: 4,
        days: Array.from({ length: 30 }, (_, i) => i + 1),
      },
      May: {
        name: "May",
        number: 5,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      June: {
        name: "June",
        number: 6,
        days: Array.from({ length: 30 }, (_, i) => i + 1),
      },
      July: {
        name: "July",
        number: 7,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      August: {
        name: "August",
        number: 8,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      September: {
        name: "September",
        number: 9,
        days: Array.from({ length: 30 }, (_, i) => i + 1),
      },
      October: {
        name: "October",
        number: 10,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
      November: {
        name: "November",
        number: 11,
        days: Array.from({ length: 30 }, (_, i) => i + 1),
      },
      December: {
        name: "December",
        number: 12,
        days: Array.from({ length: 31 }, (_, i) => i + 1),
      },
    };
  }, [selectedYear]);
  const years = useMemo(
    () => Array.from({ length: 2025 - 1915 + 1 }, (_, i) => i + 1915),
    [],
  );
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
            className="mb-10 space-y-4"
          >
            {authError && (
              <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
                {authError}
              </div>
            )}
            <FormField
              control={form.control}
              name="displayname"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
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
              render={({ field }) => {
                const updateDob = (month, day, year) => {
                  if (month && day && year) {
                    const date = new Date(year, month - 1, day);
                    console.log(date);
                    field.onChange(date);
                  }
                };
                return (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormDescription>
                      This will not be shown publicly. Confirm your own age,
                      even if this accout is for a business. a pet, or something
                      else.
                    </FormDescription>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-2 h-13">
                        <Select
                          value={selectedMonth ? selectedMonth.toString() : ""}
                          onValueChange={(value) => {
                            const month = parseInt(value, 10);
                            setSelectedMonth(month);
                            updateDob(month, selectedDay, selectedYear);
                          }}
                        >
                          <FormControl className="min-h-full w-full">
                            <SelectTrigger id="dob-month-trigger">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(months).map((month) => (
                              <SelectItem
                                key={`Month-${month.number}`}
                                value={month.number.toString()}
                              >
                                {month.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-13">
                        <Select
                          value={selectedDay ? selectedDay.toString() : ""}
                          onValueChange={(value) => {
                            const day = parseInt(value, 10);
                            setSelectedDay(day);
                            updateDob(selectedMonth, day, selectedYear);
                          }}
                        >
                          <FormControl className="min-h-full w-full">
                            <SelectTrigger id="dob-day-trigger">
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(selectedMonth
                              ? Object.values(months).find(
                                  (m) => m.number === selectedMonth,
                                )?.days
                              : months["January"].days
                            ).map((day) => (
                              <SelectItem
                                key={`Day-${day}`}
                                value={day.toString()}
                              >
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="h-13">
                        <Select
                          value={selectedYear ? selectedYear.toString() : ""}
                          onValueChange={(value) => {
                            const year = parseInt(value, 10);
                            setSelectedYear(year);
                            updateDob(selectedMonth, selectedDay, year);
                          }}
                        >
                          <FormControl className="min-h-full w-full">
                            <SelectTrigger id="dob-year-trigger">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem
                                key={`Year-${year}`}
                                value={year.toString()}
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              className={`mt-10 h-12 w-full rounded-full font-bold transition-all duration-300 ${
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

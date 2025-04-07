import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useContext } from "react";
import { States } from "./App";

const formSchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  picture: z.string().min(5, "Picture URL must not be Empty"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
export default function NewsFeedAddPost({}) {
  const { Auth } = useContext(States);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
    picture: "",
  });
  const onSubmit = async (formData) => {};
  return (
    <div className="flex w-full border-b p-4">
      <div className="flex w-full">
        <div className="flex w-[10%] flex-col items-center">
          <Avatar>
            <AvatarImage src={Auth.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-[90%] flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="border-0 text-xl"
                      placeholder="What's happening?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Image Carousel of the Uploaded Images */}
            <div></div>
            {/* submit button and options */}
            <div className="flex justify-between border-t p-2">
              <div className="flex items-center justify-between">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5 text-[#4999ed]"
                >
                  <path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                </svg>
              </div>
              <div className="flex h-full items-center justify-end">
                <Button
                  className="rounded-full font-bold opacity-50 transition-all duration-300"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

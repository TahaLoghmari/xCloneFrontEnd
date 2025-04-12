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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
export default function Reply({ content, Auth }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
    mode: "onChange",
  });
  console.log("content", content);
  const onSubmit = async (formData) => {};
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription>
          <p>
            Replying to{" "}
            <span className="text-[#4999ed]">@{content.creator.userName}</span>
          </p>
        </DialogDescription>
      </DialogHeader>
      <div className="flex w-full justify-center">
        <div className="flex w-[95%]">
          <div className="flex w-13 flex-col">
            <Avatar className="h-auto w-10">
              <AvatarImage src={Auth.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="border-0 text-xl"
                        placeholder="Post your reply"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Image Carousel of the Uploaded Images */}
              <div></div>
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
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        className={`rounded-full font-bold transition-all duration-300 ${
                          !form.formState.isValid ? "opacity-50" : "opacity-100"
                        }`}
                        type="submit"
                        disabled={
                          form.formState.isSubmitting || !form.formState.isValid
                        }
                      >
                        {form.formState.isSubmitting ? "Replying..." : "Reply"}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  );
}

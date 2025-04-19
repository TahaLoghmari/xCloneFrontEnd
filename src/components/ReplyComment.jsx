import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { API_BASE_URL } from "@/lib/api";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});
export default function ReplyComment({
  content,
  Auth,
  setReplyComment,
  index,
  postId,
  setLoading,
  setComments,
  setComment,
  skip,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
  });
  const onSubmit = async (data) => {
    if (setLoading) setLoading(true);
    try {
      const url = `${API_BASE_URL}/Comment/${Auth.id}/${postId}/${content.id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content: data.description,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const responseData = await response.json();

      setReplyComment(null);
      if (setComments) {
        if (!skip)
          setComments((prevState) => [
            ...prevState,
            {
              id: responseData.id,
              userId: responseData.userId,
              postId: responseData.postId,
              content: responseData.content,
              createdAt: responseData.createdAt,
              hasLiked: false,
              creator: {
                id: Auth.id,
                hasBeenfollowed: false,
                birthDate: Auth.birthDate,
                createdAt: Auth.CreatedAt,
                imageUrl: Auth.imageUrl,
                userName: Auth.userName,
                displayName: Auth.displayName,
                email: Auth.email,
                followerCount: Auth.followerCount,
                followingCount: Auth.followingCount,
              },
              likesCount: 0,
              repliesCount: 0,
            },
          ]);
        setComments((prevState) =>
          prevState.map((comment) =>
            comment.id === content.id
              ? { ...comment, repliesCount: comment.repliesCount + 1 }
              : comment,
          ),
        );
      }
      if (setComment) {
        setComment((prevState) => ({
          ...prevState,
          repliesCount: prevState.repliesCount + 1,
        }));
      }
      if (setLoading) setLoading(false);
      return true;
    } catch (error) {
      console.error("Error posting reply:", error);
      if (setLoading) setLoading(false);
      return false;
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#262d34]/30"
      onClick={(e) => {
        e.stopPropagation();
        setReplyComment(false);
      }}
    >
      <div
        className="bg-background flex h-full w-full justify-center md:h-[360px] md:w-[600px] md:rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex w-[90%] flex-col gap-3">
          <div className="flex gap-3 py-5">
            <ArrowLeft
              className="h-5 w-5 cursor-pointer"
              onClick={() => setReplyComment(false)}
            />
            <p>
              Replying to{" "}
              <span className="text-[#4999ed]">
                @{content.creator.userName}
              </span>
            </p>
          </div>
          <div className="flex">
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
                    <Button
                      className={`cursor-pointer rounded-full font-bold transition-all duration-300 ${
                        !form.formState.isValid ? "opacity-50" : "opacity-100"
                      }`}
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Replying..." : "Reply"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

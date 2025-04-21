import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Images } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useState, useRef } from "react";
import { States } from "./App";
import { API_BASE_URL } from "@/lib/api";
import { NewsFeedStates } from "./NewsFeed";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  Content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(500, "Content cannot exceed 500 characters"),
});
export default function NewsFeedAddPost({ option, setAddPost }) {
  const { Auth, posts, setPosts } = useContext(States);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Content: "",
    },
  });
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const onSubmit = async (formData) => {
    let responseData = null;
    try {
      setIsUploading(true);
      setUploadError("");

      let mediaUploadPath = null;
      let mediaPublicId = null;
      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("file", selectedFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/Upload/image`, {
          method: "POST",
          body: imageData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.text();
          console.error("Upload failed:", errorData);
          throw new Error(
            `Failed to upload image: ${uploadResponse.status} ${uploadResponse.statusText}`,
          );
        }

        const uploadResult = await uploadResponse.json();
        console.log("Cloudinary upload result:", uploadResult);
        if (!uploadResult || !uploadResult.url) {
          console.error("Invalid upload response:", uploadResult);
          throw new Error("Image upload response missing URL");
        }

        mediaUploadPath = uploadResult.url;
        mediaPublicId = uploadResult.publicId;
      }

      const postData = {
        Content: formData.Content,
        MediaUploadPath: mediaUploadPath,
        MediaUploadType: selectedFile ? "image" : null,
        MediaPublicId: mediaPublicId,
      };

      const postResponse = await fetch(
        `${API_BASE_URL}/Post/addPost/${Auth.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(postData),
        },
      );

      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        console.error("Post creation failed:", errorText);
        throw new Error("Failed to create post");
      }
      responseData = await postResponse.json();

      form.reset();
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (typeof onPostCreated === "function") {
        onPostCreated(responseData);
      }
      console.log(responseData, formData);
      setPosts((prevState) => [
        {
          id: responseData.Id || responseData.id,
          content: formData.Content,
          mediaUploadPath: mediaUploadPath,
          mediaUploadType: selectedFile ? "image" : null,
          mediaPublicId: mediaPublicId,
          commentsCount: 0,
          sharesCount: 0,
          likesCount: 0,
          viewsCount: 0,
          createdAt: new Date().toISOString(),
          isRetweet: false,
          hasLiked: false,
          userId: Auth.id,
          creator: {
            id: Auth.id,
            userName: Auth.userName,
            displayName: Auth.displayName,
            imageUrl: Auth.imageUrl,
            hasBeenfollowed: false,
          },
        },
        ...prevState,
      ]);
    } catch (error) {
      console.error("Error submitting post:", error);
      setUploadError(error.message || "Failed to submit post");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="mt-4 flex w-full justify-center border-b">
      <div className="flex w-[95%] flex-col gap-8">
        {option && (
          <ArrowLeft
            className="h-5 w-5 cursor-pointer"
            onClick={() => setAddPost(false)}
          />
        )}
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
                name="Content"
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
              {filePreview && (
                <div className="relative">
                  <img
                    src={filePreview}
                    alt="Upload preview"
                    className="max-h-80 rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-opacity-70 absolute top-2 right-2 rounded-full bg-black p-1 text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex justify-between border-t p-2">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center text-blue-400"
                      disabled={isUploading}
                    >
                      <Images className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                </div>
                <div className="flex h-full items-center justify-end">
                  <Button
                    className={`rounded-full font-bold ${
                      form.formState.isSubmitting || isUploading
                        ? "opacity-50"
                        : "cursor-pointer opacity-100"
                    }`}
                    type="submit"
                    disabled={form.formState.isSubmitting || isUploading}
                  >
                    {form.formState.isSubmitting || isUploading
                      ? "Posting..."
                      : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

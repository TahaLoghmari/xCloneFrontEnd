import { Search, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { States } from "./App";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Footer({}) {
  const navigate = useNavigate();
  const { Auth } = useContext(States);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };
  return (
    <>
      <div className="2sm:w-20 bg-background fixed bottom-0 flex w-full items-center justify-between overflow-x-auto overflow-y-auto border-t p-4 sm:h-full sm:w-17 sm:flex-col sm:border-r sm:p-2 2xl:min-h-screen 2xl:w-70 2xl:items-start 2xl:px-6 2xl:pb-6">
        <div className="flex w-full items-center justify-between sm:mb-6 sm:flex-col sm:justify-start sm:gap-8 2xl:mb-0 2xl:items-start">
          <div className="hidden items-center sm:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              fill="currentColor"
              className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9"
            >
              <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="flex h-7 w-7 items-center justify-center sm:h-7 sm:w-7 2xl:h-8 2xl:w-8"
            >
              <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
            </svg>
            <p className="hidden text-xl 2xl:block">Home</p>
          </div>
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="flex h-7 w-7 items-center justify-center sm:h-7 sm:w-7 2xl:h-8 2xl:w-8"
            >
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
            </svg>
            <p className="hidden text-xl 2xl:block">Notifications</p>
          </div>
          <div className="flex items-center gap-4">
            <User className="flex h-7 w-7 items-center justify-center sm:h-7 sm:w-7 2xl:h-8 2xl:w-8" />
            <p className="hidden text-xl 2xl:block">Profile</p>
          </div>
          <div className="bg-primary hidden rounded-full p-3 sm:block sm:p-2 2xl:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="text-secondary flex h-7 w-7 items-center justify-center sm:h-7 sm:w-7 2xl:h-8 2xl:w-8"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </div>
          <Button className="hidden h-15 w-full rounded-full font-extrabold 2xl:inline-block">
            Post
          </Button>
        </div>
        <Popover>
          <PopoverTrigger className="2xl:w-full">
            <div className="hover:bg-secondary hidden cursor-pointer rounded-md sm:block 2xl:mt-4 2xl:flex 2xl:w-full 2xl:items-center 2xl:justify-between 2xl:p-3">
              <div className="2xl:flex 2xl:items-center 2xl:gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={Auth?.imageUrl || "/path/to/default/image.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="hidden 2xl:flex 2xl:flex-col 2xl:items-start">
                  <p>{Auth.userName}</p>
                  <p className="text-sm text-[#56595d]">@{Auth.displayName}</p>
                </div>
              </div>
              <div className="hidden 2xl:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                </svg>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="border-gray-700 shadow-2xl">
            <div className="flex flex-col gap-3">
              <div className="hover:bg-secondary cursor-pointer rounded-sm p-3">
                <p className="font-semibold">Add an existing account</p>
              </div>

              <div
                onClick={() => handleLogout()}
                className="hover:bg-secondary cursor-pointer rounded-sm p-3"
              >
                <p className="font-semibold">Log out @{Auth.userName}</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="bg-primary fixed right-5 bottom-20 cursor-pointer rounded-full p-3 sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="text-secondary h-5 w-5"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </div>
    </>
  );
}

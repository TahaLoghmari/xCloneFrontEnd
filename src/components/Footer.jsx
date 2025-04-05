import { Search, Pencil } from "lucide-react";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Footer({}) {
  return (
    <>
      <div className="fixed bottom-0 flex w-full items-center justify-between border-t p-4 sm:h-full sm:w-16 sm:flex-col sm:border-r">
        <div className="hidden w-18 rounded-full sm:block">
          <img
            src={WhiteXLogoNoBackground}
            alt="XLogo"
            className="h-auto w-20"
          />
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="flex h-7 w-7 items-center justify-center sm:h-6 sm:w-6"
          >
            <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
          </svg>
        </div>
        <div>
          <Search className="flex h-6 w-6 items-center justify-center sm:h-6 sm:w-6" />
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="flex h-7 w-7 items-center justify-center sm:h-6 sm:w-6"
          >
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
          </svg>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="flex h-7 w-7 items-center justify-center sm:h-6 sm:w-6"
          >
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
          </svg>
        </div>
        <div className="bg-primary hidden rounded-full p-3 sm:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-secondary flex h-7 w-7 items-center justify-center sm:h-6 sm:w-6"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
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

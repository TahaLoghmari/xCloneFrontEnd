import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { States } from "./NewsFeed";

export default function NewsFeedHeader({}) {
  const { setFollowing, setForYou, forYou, following } = useContext(States);
  return (
    <div className="border-b px-4 pt-2">
      {/* Avatar - X Logo - Upgrade */}
      <div className="flex items-center justify-between sm:hidden">
        <div className="w-20">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="">
          <img
            src={WhiteXLogoNoBackground}
            alt="XLogo"
            className="h-auto w-12"
          />
        </div>
        <Button
          variant="primary"
          className="w-24 rounded-full border-1 border-[#55636f] py-0 text-[15px] font-semibold"
        >
          Upgrade
        </Button>
      </div>
      {/* This is the part where you choose the content you are seeing is from following or general */}
      <div className="mt-6 flex items-center justify-center sm:mt-0">
        <div className="flex w-[70%] items-center justify-between">
          {/* For You */}
          <div className="">
            <p
              className={`py-2 font-semibold transition-all duration-300 ${forYou ? "border-b-3 border-blue-400 opacity-100" : "opacity-50"}`}
              onClick={() => {
                setForYou((prevState) => !prevState);
                setFollowing((prevState) => !prevState);
              }}
            >
              For you
            </p>
          </div>
          {/* Following */}
          <div className="">
            <p
              className={`py-2 font-semibold transition-all duration-300 ${following ? "border-b-3 border-blue-400 opacity-100" : "opacity-50"}`}
              onClick={() => {
                setForYou((prevState) => !prevState);
                setFollowing((prevState) => !prevState);
              }}
            >
              Following
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

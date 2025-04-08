import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WhiteXLogoNoBackground from "../assets/WhiteXLogoNoBackground.png";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { NewsFeedStates } from "./NewsFeed";
import { States } from "./App";
import { User, Settings, LogOut, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export default function NewsFeedHeader({}) {
  const navigate = useNavigate();
  const { setFollowing, setForYou, forYou, following } =
    useContext(NewsFeedStates);
  const { Auth } = useContext(States);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };
  return (
    <div className="border-b px-4 pt-2">
      {/* Avatar - X Logo - Upgrade */}
      <div className="flex items-center justify-between sm:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="w-20">
              <Avatar>
                <AvatarImage src={Auth?.imageUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex w-20 flex-col gap-2">
                  <Avatar>
                    <AvatarImage src={Auth?.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p>{Auth.username}</p>
                    <p className="text-sm text-[#56595d]">
                      @{Auth.displayName}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <p>
                    {Auth.followingCount}{" "}
                    <span className="text-sm text-[#56595d]">Following</span>
                  </p>
                  <p>
                    {Auth.followerCount}{" "}
                    <span className="text-sm text-[#56595d]">Followers</span>
                  </p>
                </div>
              </SheetTitle>
              <SheetDescription>
                <div className="mt-6 flex h-50 flex-col items-start justify-between border-b pb-8">
                  <div className="text-primary flex items-center justify-start gap-3">
                    <User className="flex h-7 w-7 items-center justify-center" />
                    <p className="text-lg font-bold">Profile</p>
                  </div>
                  <div className="text-primary flex items-center justify-start gap-3">
                    <Settings className="flex h-7 w-7 items-center justify-center" />
                    <p className="text-lg font-bold">Settings</p>
                  </div>
                  <div className="text-primary flex items-center justify-start gap-3">
                    <Users className="flex h-7 w-7 items-center justify-center" />
                    <p className="text-lg font-bold">Switch account</p>
                  </div>
                  <div
                    className="text-primary flex items-center justify-start gap-3"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="flex h-7 w-7 items-center justify-center" />
                    <p className="text-lg font-bold">Log out</p>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
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

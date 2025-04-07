import NewsFeedAddPost from "./NewsFeedAddPost";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedPosts from "./NewsFeedPosts";
import { createContext, useState } from "react";

export const NewsFeedStates = createContext(null);
export default function NewsFeed({}) {
  const [forYou, setForYou] = useState(true);
  const [following, setFollowing] = useState(false);
  return (
    <NewsFeedStates.Provider
      value={{ forYou, following, setForYou, setFollowing }}
    >
      <div className="2sm:ml-20 semixl:w-[63%] w-full sm:ml-17 md:border-r xl:w-[67%] 2xl:ml-70">
        {/* This is The Header */}
        <NewsFeedHeader />
        {/* This is the part where you can post */}
        <NewsFeedAddPost />
        {/* Posts part */}
        <NewsFeedPosts />
      </div>
    </NewsFeedStates.Provider>
  );
}

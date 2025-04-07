import { Search } from "lucide-react";

export default function SearchNewsFeed() {
  return (
    <div className="semixl:w-[37%] mt-4 mr-4 hidden min-h-screen xl:block xl:w-[33%]">
      <div className="flex w-full items-center gap-2 rounded-full border p-3">
        <Search className="h-4 w-4 text-[#6f7378]" />
        <input type="text" name="" id="" placeholder="Search" />
      </div>
    </div>
  );
}

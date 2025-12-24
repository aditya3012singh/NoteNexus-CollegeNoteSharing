import React from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterType: "all" | "recent" | "important";
  setFilterType: (v: "all" | "recent" | "important") => void;
  onClear?: () => void;
};

export const AnnouncementsSearchFilter: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  onClear,
}) => {
  return (
    <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl ">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center shadow-lg">
          <Search className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Find Announcements</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-200 h-5 w-5" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#dcebea]/20 rounded-xl text-slate-200  focus:ring-[#8dbbb9] transition-all"
          />
        </div>

      <Select
        value={filterType}
        onValueChange={(value) => setFilterType(value as any)}
      >
        <SelectTrigger
          className="
            w-full
            py-6
            bg-white/5
            border border-white/15
            rounded-xl
            text-white
            font-medium
            focus:ring-2 focus:ring-[#8dbbb9]/40
            transition
          "
        >
          <SelectValue placeholder="All Announcements" />
        </SelectTrigger>

        <SelectContent
          className="
            bg-[#0b0f0f]
            text-white
            border border-white/10
            rounded-xl
            shadow-xl
          "
        >
          <SelectItem value="all">All Announcements</SelectItem>
          <SelectItem value="recent">Recent (This Week)</SelectItem>
          <SelectItem value="important">Important Only</SelectItem>
        </SelectContent>
      </Select>



        <button
          onClick={() => {
            setSearchTerm("");
            setFilterType("all");
            onClear?.();
          }}
          className="flex items-center justify-center px-4 py-3 bg-[#669a9b] text-white rounded-xl hover:shadow-lg transition-all"
        >
          <X className="h-4 w-4 mr-2" /> Clear
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsSearchFilter;

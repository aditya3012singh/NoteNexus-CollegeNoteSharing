import React from "react";
import { Calendar, User, Clock, } from "lucide-react";
import type { Announcement } from "../../../redux/slices/announcementSlice";
import { getAnnouncementPriority, formatDate } from "./utils";

type Props = {
  a: Announcement;
  index?: number;
};



export const AnnouncementItem: React.FC<Props> = ({ a, index = 0 }) => {
  const priority = getAnnouncementPriority(a.title, a.message || "");
  const PriorityIcon = priority.icon as React.ComponentType<any>;

  return (
    <div
      key={a.id}
      className="bg-transparent backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 100 + 500}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center`}
            style={{
              background: `linear-gradient(to right, ${priority.color}, #8dbbb9)`,
            }}
          >
            <PriorityIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">
              {priority.level === "high"
                ? "Important Notice"
                : priority.level === "medium"
                ? "Academic Update"
                : "General Announcement"}
            </span>
            <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(a.createdAt || "")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#669a9b] mb-2">{a.title}</h3>
        <p className="text-slate-600 leading-relaxed">{a.message}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/60">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <User className="h-4 w-4 text-[#669a9b]" />
          <span>Admin</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>
            {new Date(a.createdAt || "").toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* <div className="flex items-center space-x-2">
          <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-lg hover:shadow-lg">
            <Eye className="h-4 w-4 mr-1 inline" /> Read More
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AnnouncementItem;

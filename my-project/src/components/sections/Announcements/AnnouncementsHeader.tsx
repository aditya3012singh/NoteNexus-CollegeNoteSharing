import React from "react";
import { MessageSquare, Bell } from "lucide-react";

type Props = {
  total: number;
  recent: number;
};

export const AnnouncementsHeader: React.FC<Props> = ({ total, recent }) => {
  return (
    <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl ">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-4xl font-bold text-slate-200">
            Latest <span className="text-[#669a9b]">Announcements</span>
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            Stay informed with the latest updates and notices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
            <MessageSquare className="h-5 w-5 mr-2" />
            {total} total
          </div>
          <div className="flex items-center bg-[#669a9b] text-white px-4 py-2 rounded-xl">
            <Bell className="h-5 w-5 mr-2" />
            {recent} new this week
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsHeader;

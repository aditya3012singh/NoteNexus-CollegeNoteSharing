import { AlertCircle, Clock, Info } from "lucide-react";

export const getAnnouncementPriority = (title: string, content: string) => {
  const combined = (title + " " + content).toLowerCase();
  if (
    combined.includes("urgent") ||
    combined.includes("important") ||
    combined.includes("deadline")
  ) {
    return { level: "high", color: "#d9534f", icon: AlertCircle } as const;
  } else if (
    combined.includes("exam") ||
    combined.includes("test") ||
    combined.includes("assignment")
  ) {
    return { level: "medium", color: "#f0ad4e", icon: Clock } as const;
  } else {
    return { level: "normal", color: "#669a9b", icon: Info } as const;
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" as const : undefined,
  });
};

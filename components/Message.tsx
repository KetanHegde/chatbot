import {
  parseISO,
  format,
  isToday,
  isYesterday,
  differenceInCalendarDays,
} from "date-fns";
interface MessageProps {
  content: string;
  sender: "User" | "assistant";
  timestamp: string;
}

export function formatDate(iso: string) {
  const date = parseISO(iso);

  if (isToday(date)) {
    return format(date, "p");
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  if (differenceInCalendarDays(new Date(), date) < 7) {
    return format(date, "EEEE");
  }

  return format(date, "dd/MM/yy");
}

export default function Message({ content, sender, timestamp }: MessageProps) {
  const isUser = sender === "User";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl backdrop-blur-xl border ${
          isUser
            ? "bg-gray-800/70  border-blue-700 text-white"
            : "bg-gray-800/70 text-gray-100 border-gray-700"
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        <p
          className={`text-xs mt-2 ${
            isUser ? "text-blue-100/80" : "text-gray-400"
          }`}
        >
          {formatDate(timestamp)}
        </p>
      </div>
    </div>
  );
}

import type { UserCardProps } from "../../Types/TaskType";

const UserCard = ({ avatar, userName, email }: UserCardProps) => (
  <div
    className="flex items-center gap-3 px-3 py-3 rounded-xl"
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <img
      src={avatar && avatar}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover shrink-0"
    />
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold truncate text-gray-100">
        {userName}
      </span>
      <span className="text-xs truncate text-gray-500">{email}</span>
    </div>
  </div>
);
export default UserCard
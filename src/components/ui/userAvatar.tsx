// src/components/ui/UserAvatar.tsx
import type { AdminUser } from "../../types";

interface UserAvatarProps {
  user: AdminUser;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200`}
    >
      {user.photo ? (
        <img
          src={`data:image/png;base64,${user.photo}`}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <span class="text-orange-600 ${textSizes[size]} font-semibold">
                  ${getInitials(user.name)}
                </span>
              `;
            }
          }}
        />
      ) : (
        <span className={`text-orange-600 ${textSizes[size]} font-semibold`}>
          {getInitials(user.name)}
        </span>
      )}
    </div>
  );
}

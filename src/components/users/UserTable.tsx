// src/components/users/UserTable.tsx
import type { AdminUser } from "../../types";
import { formatDate } from "../../lib/utils";
import eyeIcon from "../../assets/mata.svg";
import editIcon from "../../assets/edit.svg";

interface UserTableProps {
  users: AdminUser[];
  startIndex: number;
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
}

export function UserTable({
  users,
  startIndex,
  onView,
  onEdit,
}: UserTableProps) {
  const handleEditClick = (e: React.MouseEvent, user: AdminUser) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit button clicked for:", user.name);
    onEdit(user);
  };

  return (
    <table className="w-full border-collapse">
      <thead className="bg-white">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold tracking-wider">
            Account ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold tracking-wider">
            Name
          </th>
          <th className="px-8 py-3 text-left text-xs font-bold tracking-wider">
            Date
          </th>
          <th className="px-8 py-3 text-left text-xs font-bold tracking-wider">
            Status
          </th>
          <th className="px-14 py-3 text-left text-xs font-bold tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={user._id}
            className={`${
              (startIndex + index) % 2 === 0 ? "bg-white" : "bg-orange-50"
            } hover:bg-orange-100 transition-colors`}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              #{String(startIndex + index + 1).padStart(6, "0")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {user.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatDate(user.date_of_birth)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Registered
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-4">
              <button
                onClick={() => onView(user)}
                className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                title="Lihat Detail"
              >
                <img src={eyeIcon} alt="View" className="w-4 h-4 mr-1.5" />
                <span>Lihat</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah event bubbling
                  console.log("Edit button clicked for user:", user);
                  onEdit(user);
                }}
                className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                title="Edit User"
              >
                <img src={editIcon} alt="Edit" className="w-4 h-4 mr-1.5" />
                <span>Edit</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

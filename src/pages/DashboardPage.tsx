import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import logo from "../assets/logo3.png";
import eyeIcon from "../assets/mata.svg";
import editIcon from "../assets/edit.svg";

interface AdminUser {
  _id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  date_of_birth: string;
  photo?: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("DashboardPage mounted");

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("User authenticated:", user?.name);
    fetchUsers();
  }, [navigate, isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      console.log("Fetching users with token:", token);

      const response = await fetch(
        "https://api-test.bullionecosystem.com/api/v1/admin?offset=0&limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Full API Response:", data);

      if (response.ok && !data.iserror) {
        console.log("Users data:", data.data);
        setUsers(data.data || []);
        setError(""); // Clear any previous errors
      } else if (response.status === 401) {
        console.log("Unauthorized - removing token and redirecting");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        console.log("API Error:", data);
        setError(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleViewUser = (user: AdminUser) => {
    console.log("View user clicked:", user._id);
    setSelectedUser(user);
    setShowViewModal(true);

    // Fetch detail user dari endpoint spesifik
    fetchUserDetail(user._id);
  };

  // Fungsi baru untuk fetch detail user
  const fetchUserDetail = async (userId: string) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await fetch(
        `https://api-test.bullionecosystem.com/api/v1/admin/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("User detail:", data);

      if (response.ok && !data.iserror) {
        // Update selectedUser dengan data lengkap
        setSelectedUser((prevUser) => ({
          ...prevUser!,
          first_name: data.data!.first_name || data.data!.name.split(" ")[0],
          last_name:
            data.data!.last_name ||
            data.data!.name.split(" ").slice(1).join(" "),
        }));
      } else {
        console.error("Failed to fetch user detail:", data);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    console.log("Edit user clicked:", user._id);
    setSelectedUser(user);
    setEditFormData({ ...user });
    setEditError("");
    setEditSuccess("");
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    setIsSaving(true);
    setEditError("");
    setEditSuccess("");

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      // Split name untuk API
      const nameParts = editFormData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
        gender: editFormData.gender,
        date_of_birth: new Date(editFormData.date_of_birth).toISOString(),
      };

      console.log("Sending update data:", updateData);

      const response = await fetch(
        `https://api-test.bullionecosystem.com/api/v1/admin/${editFormData._id}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      console.log("Update response:", data);

      if (response.ok && !data.err_code) {
        setEditSuccess("User berhasil diupdate!");
        // Refresh data users
        await fetchUsers();
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess("");
        }, 1500);
      } else {
        setEditError(
          data.err_message || data.err_message_en || "Gagal mengupdate user"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      setEditError("Network error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log("Rendering DashboardPage", { users, isLoading, error });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="flex items-center p-4 border-b">
            <img src={logo} alt="logo2" className="h-8 w-auto" />
            <div className="mx-22">
              <svg
                className="w-5 h-5 mr-2 text-gray-500 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </div>
          <nav className="p-4">
            <div className="space-y-2">
              <div className="bg-orange-500 text-white px-4 py-2 rounded font-medium">
                User Aktif
              </div>
              <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                Menu 2
              </div>
              <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                Menu 3
              </div>
              <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                Menu 4
              </div>
              <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                Menu 5
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">User Aktif</h2>
              <div className="flex items-center space-x-3">
                <button
                  // onClick={() => navigate("/register")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Tambah User
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto py-6">
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
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500 bg-white"
                    >
                      {error ? (
                        <div className="text-red-600">{error}</div>
                      ) : (
                        <div>
                          <div className="text-lg mb-2">
                            Tidak ada data user
                          </div>
                          <div className="text-sm">
                            Pastikan API berjalan dengan baik
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`${
                        (indexOfFirstItem + index) % 2 === 0
                          ? "bg-white"
                          : "bg-orange-50"
                      } hover:bg-orange-100 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{String(indexOfFirstItem + index + 1).padStart(6, "0")}
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
                          onClick={() => handleViewUser(user)}
                          className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                          title="Lihat Detail"
                        >
                          <img
                            src={eyeIcon}
                            alt="View"
                            className="w-4 h-4 mr-1.5"
                          />
                          <span>Lihat</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Edit button clicked for:", user.name);
                            handleEditUser(user);
                          }}
                          className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                          title="Edit User"
                        >
                          <img
                            src={editIcon}
                            alt="Edit"
                            className="w-4 h-4 mr-1.5"
                          />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Component */}
            {users.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, users.length)} dari {users.length}{" "}
                  user
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &laquo;
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum =
                      currentPage > 3 && totalPages > 5
                        ? currentPage -
                          3 +
                          i +
                          (currentPage + 2 > totalPages
                            ? totalPages - currentPage - 2
                            : 0)
                        : i + 1;

                    if (pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded border text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-orange-500 text-white border-orange-500"
                              : "text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`px-3 py-1 rounded border text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-filter backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-50 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lihat User
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-3">Foto Profil</div>
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200">
                  {selectedUser.photo ? (
                    <img
                      src={`data:image/png;base64,${selectedUser.photo}`}
                      alt={selectedUser.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        console.log(
                          "Image load error for user:",
                          selectedUser.name
                        );
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                      <span class="text-orange-600 text-lg font-semibold">
                        ${getInitials(selectedUser.name)}
                      </span>
                    `;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-orange-600 text-lg font-semibold">
                      {getInitials(selectedUser.name)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Nama depan dan nama belakang */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Nama Depan</div>
                    <div className="font-medium text-gray-900">
                      {selectedUser.first_name ||
                        selectedUser.name.split(" ")[0]}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">
                      Nama Belakang
                    </div>
                    <div className="font-medium text-gray-900">
                      {selectedUser.last_name ||
                        selectedUser.name.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                </div>

                {/* Nama lengkap */}
                {/* <div>
                  <div className="text-gray-600 text-sm mb-1">Nama Lengkap</div>
                  <div className="font-medium text-gray-900">
                    {selectedUser.name}
                  </div>
                </div> */}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">
                      Jenis Kelamin
                    </div>
                    <div className="font-medium text-gray-900">
                      {selectedUser.gender === "male"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">
                      Tanggal Lahir
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedUser.date_of_birth)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-600 text-sm mb-1">Email</div>
                  <div className="font-medium text-gray-900">
                    {selectedUser.email}
                  </div>
                </div>

                <div>
                  <div className="text-gray-600 text-sm mb-1">
                    No. Handphone
                  </div>
                  <div className="font-medium text-gray-900">
                    {selectedUser.phone}
                  </div>
                </div>

                <div>
                  <div className="text-gray-600 text-sm mb-1">Alamat</div>
                  <div className="font-medium text-gray-900">
                    {selectedUser.address}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditUser(selectedUser);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - HANYA SATU MODAL */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/20 backdrop-filter backdrop-brightness-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto relative z-50 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {editSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  No. Handphone *
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan nomor handphone"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Gender</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(editFormData.date_of_birth)}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Alamat *
                </label>
                <textarea
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Masukkan alamat lengkap"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-6">
                {/* <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                  disabled={isSaving}
                >
                  Batal
                </button> */}
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

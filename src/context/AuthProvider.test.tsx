// import { AuthProvider, useAuth } from "./AuthProvider";
// import { vi, expect, test, describe, beforeEach } from "vitest";

// // Mock authService
// vi.mock("../services/authService", () => ({
//   authService: {
//     login: vi.fn(),
//     register: vi.fn(),
//     logout: vi.fn(),
//   },
// }));

// // Import mocked authService
// import { authService } from "../services/authService";

// // Test component that uses the AuthContext
// const TestComponent = () => {
//   const { isAuthenticated, user, login, logout } = useAuth();

//   return (
//     <div>
//       <div data-testid="auth-status">
//         {isAuthenticated ? "Authenticated" : "Not authenticated"}
//       </div>
//       <div data-testid="user-name">{user?.name || "No user"}</div>
//       <button
//         data-testid="login-btn"
//         onClick={() => login("test@example.com", "password")}
//       >
//         Login
//       </button>
//       <button data-testid="logout-btn" onClick={() => logout()}>
//         Logout
//       </button>
//     </div>
//   );
// };

// describe("AuthProvider", () => {
//   beforeEach(() => {
//     // Clear mocks before each test
//     vi.clearAllMocks();

//     // Clear localStorage
//     localStorage.clear();
//   });

//   test("should render children and provide context values", () => {
//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     // Initial state should be not authenticated
//     expect(screen.getByTestId("auth-status").textContent).toBe(
//       "Not authenticated"
//     );
//     expect(screen.getByTestId("user-name").textContent).toBe("No user");
//   });

//   test("should handle login success", async () => {
//     // Mock successful login response
//     const mockResponse = {
//       iserror: false,
//       err_code: null,
//       data: {
//         token: "test-token",
//         name: "Test User",
//         email: "test@example.com",
//       },
//     };

//     (authService.login as any).mockResolvedValueOnce(mockResponse);

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     // Trigger login
//     await act(async () => {
//       screen.getByTestId("login-btn").click();
//     });

//     // After login, should be authenticated
//     expect(screen.getByTestId("auth-status").textContent).toBe("Authenticated");
//     expect(screen.getByTestId("user-name").textContent).toBe("Test User");

//     // Check localStorage
//     expect(localStorage.getItem("authToken")).toBe("test-token");
//     expect(localStorage.getItem("userName")).toBe("Test User");
//     expect(localStorage.getItem("userEmail")).toBe("test@example.com");
//   });

//   test("should handle login failure", async () => {
//     // Mock failed login response
//     const mockResponse = {
//       iserror: true,
//       err_code: 401,
//       err_message: "Invalid credentials",
//     };

//     (authService.login as any).mockResolvedValueOnce(mockResponse);

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     // Trigger login
//     await act(async () => {
//       screen.getByTestId("login-btn").click();
//     });

//     // After failed login, should still be not authenticated
//     expect(screen.getByTestId("auth-status").textContent).toBe(
//       "Not authenticated"
//     );
//     expect(screen.getByTestId("user-name").textContent).toBe("No user");

//     // No items in localStorage
//     expect(localStorage.getItem("authToken")).toBeNull();
//   });

//   test("should handle logout", async () => {
//     // Setup authenticated state first
//     localStorage.setItem("authToken", "test-token");
//     localStorage.setItem("userName", "Test User");
//     localStorage.setItem("userEmail", "test@example.com");

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     // Should be authenticated initially because of localStorage
//     expect(screen.getByTestId("auth-status").textContent).toBe("Authenticated");
//     expect(screen.getByTestId("user-name").textContent).toBe("Test User");

//     // Trigger logout
//     await act(async () => {
//       screen.getByTestId("logout-btn").click();
//     });

//     // After logout, should be not authenticated
//     expect(screen.getByTestId("auth-status").textContent).toBe(
//       "Not authenticated"
//     );
//     expect(screen.getByTestId("user-name").textContent).toBe("No user");

//     // No items in localStorage
//     expect(localStorage.getItem("authToken")).toBeNull();
//     expect(localStorage.getItem("userName")).toBeNull();
//     expect(localStorage.getItem("userEmail")).toBeNull();
//   });
// });

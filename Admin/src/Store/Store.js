// store/authStore.js
import { create } from "zustand";
import { io } from "socket.io-client";

const useStore = create((set, get) => ({
  userToken: null,
  isAuthenticated: false,
  userInformation: null,
  socket: null,
  announcements: [], // Changed to lowercase for convention

  fetchMe: async () => {
    const response = await fetch("http://localhost:3000/admin/me", {
      method: "GET",
      headers: {
        Authorization: `${get().userToken}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      set({ userInformation: data });
    } else {
      console.error("Failed to fetch user information:", data.message);
    }
  },

  // Fetch announcements from the backend
  getAnnouncements: async () => {
    try {
      const token = get().userToken;
      const response = await fetch(
        "http://localhost:3000/announcement/getannouncements",
        {
          headers: {
            Authorization: `${token}`, // Add token for authentication if required
          },
        }
      );
      const data = await response.json();
      console.log("Fetched announcements:", data);
      if (response.ok) {
        set({ announcements: data }); // Update state with fetched data
      } else {
        console.error("Failed to fetch announcements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  },

  // Socket initialization
  socketInitialization: () => {
    const token = get().userToken;
    if (!token) return;

    const socket = io("http://localhost:3000", {
      // Changed to http://localhost:3000
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Listen for real-time announcements
    socket.on("announcement", (newAnnouncement) => {
      console.log("heheheheh");
      console.log("New announcement received:", newAnnouncement);
      set((state) => ({
        announcements: [...state.announcements, newAnnouncement],
      }));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    set({ socket });
  },

  // Check authentication and initialize
  checkAuth: () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      set({ userToken: token });
      set({ isAuthenticated: true });
      get().socketInitialization();
      get().getAnnouncements(); // Fetch initial announcements
      get().fetchMe();
    }
  },

  // Set user token
  setUserToken: (token) => {
    console.log("Setting token:", token);
    set({ userToken: token });
    set({ isAuthenticated: true });
    localStorage.setItem("userToken", token); // Persist token
    get().socketInitialization();
    get().getAnnouncements(); // Fetch announcements after login
    get().fetchMe();
  },

  // Set user information
  setUserInformation: (user) => {
    set({ userInformation: user });
  },

  // Logout
  Logout: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({
      userToken: null,
      isAuthenticated: false,
      userInformation: null,
      socket: null,
      announcements: [],
    });
    localStorage.removeItem("userToken");
  },
}));

export default useStore;

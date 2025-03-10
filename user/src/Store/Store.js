import { create } from "zustand";
import { io } from "socket.io-client";

const useStore = create((set, get) => ({
  userToken: null,
  userInformation: null,
  isAuthenticated: false,
  announcements: [],
  socket: null, // Explicitly track socket in state

  fetchMe: async () => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${get().userToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        set({ userInformation: data });
      } else {
        console.error("Failed to fetch user information:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ userToken: token, isAuthenticated: true });
      get().socketInitialization(); // Initialize socket
      get().fetchMe();
      get().getAnnouncements(); // Fetch initial announcements
    }
  },

  getAnnouncements: async () => {
    try {
      const token = get().userToken;
      const response = await fetch(
        "http://localhost:3000/announcement/getannouncements",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        set({ announcements: data });
      } else {
        console.error("Failed to fetch announcements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  },

  setUserToken: (token) => {
    localStorage.setItem("token", token);
    set({ userToken: token, isAuthenticated: true });
    get().socketInitialization();
  },

  socketInitialization: () => {
    const token = get().userToken;
    if (!token || get().socket) return; // Prevent multiple socket instances

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("announcement", (newAnnouncement) => {
      console.log("New announcement received:", newAnnouncement);
      set((state) => ({
        announcements: [newAnnouncement, ...state.announcements],
      }));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    set({ socket });
  },

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
    localStorage.removeItem("token"); // Corrected from "userToken" to "token"
  },
}));

export default useStore;

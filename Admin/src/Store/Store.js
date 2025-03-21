import { create } from "zustand";
import { io } from "socket.io-client";

const useStore = create((set, get) => ({
  userToken: null,
  isAuthenticated: false,
  userInformation: null,
  socket: null,
  announcements: [],
  isLoadingAuth: true, // Added for auth loading state

  fetchMe: async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching user info:", error);
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

  socketInitialization: () => {
    const token = get().userToken;
    if (!token || get().socket) return;

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

  checkAuth: async () => {
    console.log("Checking auth...");
    const token = localStorage.getItem("userToken");
    if (token) {
      set({ userToken: token, isAuthenticated: true });
      get().socketInitialization();
      await Promise.all([get().fetchMe(), get().getAnnouncements()]);
    }
    set({ isLoadingAuth: false });
  },

  setUserToken: (token) => {
    console.log("Setting token:", token);
    set({ userToken: token, isAuthenticated: true });
    localStorage.setItem("userToken", token);
    get().socketInitialization();
    get().fetchMe();
    get().getAnnouncements();
  },

  setUserInformation: (user) => {
    set({ userInformation: user });
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
      isLoadingAuth: false,
    });
    localStorage.removeItem("userToken");
  },
}));

export default useStore;

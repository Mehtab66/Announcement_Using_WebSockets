// store/authStore.js
import { create } from "zustand";
import { useEffect } from "react";
import { io } from "socket.io-client";

// Store
const useStore = create((set, get) => ({
  userToken: null,
  isAuthenticated: false, // Fixed typo
  userInformation: null,
  socket: null,
  //Actions:

  //Socket Initialization

  socketInitialization: () => {
    const token = get().userToken;
    if (!token) return;
    const socket = io("127.0.0.1:3000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });
    set({ socket });
  },

  // Check if user is authenticated
  checkAuth: () => {
    if (localStorage.getItem("userToken")) {
      set({ userToken: localStorage.getItem("userToken") });
      set({ isAuthenticated: true });
      get().socketInitialization();
    }
  },

  // Set user Token
  setUserToken: (token) => {
    console.log(token);
    set({ userToken: token });
    set({ isAuthenticated: true });
    get().socketInitialization();
  },

  // Set user Information
  setUserInformation: (user) => {
    set({ userInformation: user });
  },

  //Logout
  Logout: () => {
    set({ token: null }),
      set({ isAuthenticated: false }),
      set({ userInformation: null });
    set({ socket: null });
  },
}));

export default useStore;

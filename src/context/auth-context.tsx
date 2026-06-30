"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured, dbGetOrders, dbUpdateOrderStatus, dbCreateOrder, Order } from "@/utils/supabase";

export interface UserProfile {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  createOrder: (orderData: Omit<Order, "created_at" | "status">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);


  // Initialize session and fetch orders
  useEffect(() => {
    const initSession = async () => {
      // 1. Check local storage for mocked admin session
      const savedUser = localStorage.getItem("simo_admin_session");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else if (isSupabaseConfigured() && supabase) {
        // Check active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setUser({
            name: "مدير المتجر",
            email: session.user.email || "",
            isAdmin: true,
          });
        }
      }

      // 2. Fetch orders from unified DB API
      try {
        const fetchedOrders = await dbGetOrders();
        setOrders(fetchedOrders);
      } catch (e) {
        console.error("Error fetching orders:", e);
      }

    };

    initSession();
  }, []);

  const login = async (email: string, password = ""): Promise<boolean> => {
    // Check if Supabase is active
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Supabase Auth Error:", error.message);
          return false;
        }

        if (data?.user) {
          const adminUser: UserProfile = {
            name: "مدير المتجر",
            email: data.user.email || email,
            isAdmin: true,
          };
          setUser(adminUser);
          localStorage.setItem("simo_admin_session", JSON.stringify(adminUser));
          // Refresh orders on login
          const fetchedOrders = await dbGetOrders();
          setOrders(fetchedOrders);
          return true;
        }
      } catch (e) {
        console.error("Auth Exception:", e);
      }
    }

    // Fallback Mock Login (Works immediately out-of-the-box)
    if (email.toLowerCase() === "admin@simoprotein.com" && password === "admin12345") {
      const adminUser: UserProfile = {
        name: "مدير المتجر (تجريبي)",
        email: email,
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem("simo_admin_session", JSON.stringify(adminUser));
      const fetchedOrders = await dbGetOrders();
      setOrders(fetchedOrders);
      return true;
    }

    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("simo_admin_session");
  };

  const createOrder = async (orderData: Omit<Order, "created_at" | "status">): Promise<Order> => {
    const created = await dbCreateOrder(orderData);
    setOrders((prev) => [created, ...prev]);
    return created;
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    await dbUpdateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const refreshOrders = async () => {
    const fetchedOrders = await dbGetOrders();
    setOrders(fetchedOrders);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        logout,
        createOrder,
        updateOrderStatus,
        refreshOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

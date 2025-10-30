"use client";
import PocketBase from "pocketbase";

const PB_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090";

class PocketBaseClient {
  private static instance: PocketBase;

  static getInstance(): PocketBase {
    if (!PocketBaseClient.instance) {
      PocketBaseClient.instance = new PocketBase(PB_URL);
      PocketBaseClient.instance.autoCancellation(false);

      // Enable cookie-based auth
      if (typeof document !== "undefined") {
        PocketBaseClient.instance.authStore.onChange(() => {
          document.cookie = PocketBaseClient.instance.authStore.exportToCookie({
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          });
        });
      }
    }
    return PocketBaseClient.instance;
  }
}

export const pb = PocketBaseClient.getInstance();

// Auth helper functions
export async function signUp(email: string, password: string, name: string) {
  try {
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name,
    });

    // Authenticate after signup
    await pb.collection("users").authWithPassword(email, password);

    // Force cookie update
    if (typeof document !== "undefined") {
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    // Force cookie update
    if (typeof document !== "undefined") {
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    }

    return { success: true, user: authData.record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  pb.authStore.clear();

  // Clear the cookie
  if (typeof document !== "undefined") {
    document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export function getCurrentUser() {
  return pb.authStore.model;
}

export function isAuthenticated() {
  return pb.authStore.isValid;
}

export function onAuthChange(callback: (user: any) => void) {
  return pb.authStore.onChange((token, model) => {
    callback(model);
  });
}

"use client";

import { UserLoggedIn } from "@/components/sidebar";
import { getToken } from "@/lib/helpers";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface UpdateData {
  name?: string;
  email?: string;
  password?: string
}

export const EditProfile = ({ token }: { token: string }) => {
  const [currentUser, setCurrentUser] = useState<UserLoggedIn>();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchUserLoggedIn = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch profile");
          setLoading(false);
          return;
        }

        if (data.user) {
          setCurrentUser(data.user);
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email,
          }));
        }
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(errMessage);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoggedIn();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validasi email
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    setUpdating(true);

    try {
      const updateData: UpdateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      setCurrentUser(data.user);

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(errMessage);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <h1 className="text-white text-xl font-semibold">Your Profile</h1>
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2" id="edit-profile">
        <h1 className="text-white text-xl font-semibold">Your Profile</h1>
        <p className="text-white/60 italic text-sm">
          Anda dapat kustomisasi informasi akun anda
        </p>
      </div>

      <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-18 w-18 flex-shrink-0 rounded-full bg-gradient-to-tr from-darkColor to-mainColor text-white flex justify-center items-center">
            <span className="font-bold uppercase text-3xl">
              {currentUser?.name?.split("").slice(0, 2).join("") || "US"}
            </span>
          </div>
          <div>
            <p className="text-[26px] text-white font-semibold">
              {currentUser?.name || "User"}
            </p>
            <p className="text-base italic text-white/80 capitalize">
              {currentUser?.role?.toLowerCase().replace("_", " ") || "user"}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-white text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-mainColor transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-mainColor transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-mainColor transition-colors"
                placeholder="Leave blank to keep current password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white text-sm font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-mainColor transition-colors"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-mainColor hover:bg-mainColor/80 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

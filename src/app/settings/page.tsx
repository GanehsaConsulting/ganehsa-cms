"use client"

import { AppearanceSettings } from "@/components/features/settings/appearance";
import { UserManagement } from "@/components/features/settings/user-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrapper } from "@/components/wrapper";
import { getToken } from "@/lib/helpers";
import { FaPaintbrush, FaUsersGear } from "react-icons/fa6";

function SettingsPage() {
  const token = getToken();
  
  // Debug logging
  console.log("🔍 SettingsPage - Token:", token ? "exists" : "missing");
  console.log("🔍 Token length:", token?.length);
  console.log("🔍 Token preview:", token?.substring(0, 30) + "...");

  return (
    <Wrapper className="flex flex-col gap-2 p-6">
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">
            <span>
              <FaPaintbrush />
            </span>
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="userManage">
            <span>
              <FaUsersGear />
            </span>
            <span>User Management</span>
          </TabsTrigger>
        </TabsList>

        {/* APPEARANCE */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <AppearanceSettings token={token as string} />
        </TabsContent>

        {/* USER MANAGEMENT */}
        <TabsContent value="userManage" className="space-y-4 mt-4">
          {/* <div className="space-y-2">
            <h1 className="text-white text-xl font-semibold">
              User Management Settings
            </h1>
            <p className="text-white/60 italic text-sm">
              Fitur ini hanya dapat dilihat dan di edit oleh "super admin"
            </p>
          </div> */}

          {token ? (
            <UserManagement token={token} />
          ) : (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-300">⚠️ No token found! Please login again.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Wrapper>
  );
}

export default SettingsPage;
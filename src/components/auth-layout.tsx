"use client";

import { TbBrandSnowflake } from "react-icons/tb";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AuthLayout = () => {
  const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>({});
  const [identifier, setIdentifier] = useState(""); // ✅ ganti nama biar jelas
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = (id: string) => {
    setVisibleInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }), // ✅ sesuai API
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success("Login berhasil 🎉");

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Terjadi error, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="absolute inset-3 flex items-end justify-end">
      <div className="w-[40%] h-full backdrop-blur-lg bg-lightColor/15 dark:bg-darkColor/40 border border-muted/20 rounded-main">
        <div className="p-10 flex flex-col justify-center w-full h-full gap-3">
          {/* Header */}
          <div className="flex items-center gap-2 bg-white/10 rounded-third pr-2 w-fit">
            <div className="text-3xl text-lightColor p-1 bg-mainColor/50 rounded-third">
              <TbBrandSnowflake />
            </div>
            <div className="text-lightColor text-lg leading-tight font-medium">
              Ganesha Content Management
            </div>
          </div>

          <h1 className="font-bold text-4xl text-lightColor">Welcome Back!</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Identifier */}
            <div className="space-y-2">
              <Label className="text-white" htmlFor="identifier">
                Email / Username
              </Label>
              <Input
                placeholder="Enter your email or username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                name="identifier"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-white" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={visibleInputs["password"] ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  name="password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  size={"icon"}
                  onClick={() => toggleVisibility("password")}
                  variant={"ghost"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-[#ffffff] !p-0"
                >
                  {visibleInputs["password"] ? <HiEye /> : <HiEyeSlash />}
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

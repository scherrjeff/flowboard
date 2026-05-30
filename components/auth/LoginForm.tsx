"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

type Tab = "password" | "magic" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (tab === "password") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        router.push("/");
        router.refresh();
      }
    } else if (tab === "magic") {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Check your email for a magic link!" });
      }
    } else if (tab === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Account created! Check your email to confirm, or sign in now." });
        setTab("password");
      }
    }

    setLoading(false);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "password", label: "Password" },
    { id: "magic", label: "Magic link" },
    { id: "signup", label: "Sign up" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center px-4">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <Logo className="size-12" color="#00b800" />
        <h1 className="text-2xl font-semibold text-[#0a0a0a] tracking-tight">FlowBoard</h1>
        <p className="text-sm text-[#717182]">Sign in to manage your boards</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] w-full max-w-[448px] pt-8 px-8 pb-8">
        {/* Tab toggle */}
        <div className="bg-[#f3f4f6] rounded-[10px] p-1 flex mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setMessage(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-[8px] transition-all ${
                tab === t.id
                  ? "bg-white text-[#0a0a0a] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
                  : "text-[#717182]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2.5 text-base text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[#0369a1] focus:bg-[#e0e7ff] transition-colors"
            />
          </div>

          {/* Password (not shown for magic link) */}
          {tab !== "magic" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2.5 text-base text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[#0369a1] focus:bg-[#e0e7ff] transition-colors"
              />
            </div>
          )}

          {/* Forgot password */}
          {tab === "password" && (
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-sm text-[#0369a1] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Feedback message */}
          {message && (
            <p
              className={`text-sm ${
                message.type === "error" ? "text-[#d4183d]" : "text-[#0369a1]"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00b800] hover:bg-[#00a000] disabled:opacity-60 text-white font-medium text-base py-2.5 rounded-[10px] transition-colors mt-2"
          >
            {loading
              ? "..."
              : tab === "signup"
              ? "Create account"
              : tab === "magic"
              ? "Send magic link"
              : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

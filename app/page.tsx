"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Home() {
  const [chatKey, setChatKey] = useState(0)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [usage, setUsage] = useState<{ left: number; limit: number } | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [planLoading, setPlanLoading] = useState(true)

  // Fetch user auth and plan
  useEffect(() => {
    let mounted = true

    async function fetchUserData() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const uid = userData?.user?.id
        const email = userData?.user?.email

        if (mounted) {
          setUserEmail(email ?? null)
        }

        if (uid) {
          // Fetch user plan from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("plan")
            .eq("id", uid)
            .single()

          if (mounted) {
            setUserPlan(profile?.plan ?? "free")
          }
        } else {
          if (mounted) {
            setUserPlan(null)
          }
        }
      } catch (e) {
        console.warn("User data fetch error:", e)
      } finally {
        if (mounted) {
          setPlanLoading(false)
        }
      }
    }

    fetchUserData()

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      fetchUserData()
    })

    return () => {
      mounted = false
      authSub?.subscription?.unsubscribe()
    }
  }, [])

  // Fetch usage
  useEffect(() => {
    let mounted = true

    async function fetchUsage() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const uid = userData?.user?.id
        if (!uid) {
          if (mounted) setUsage(null)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("messages left, message limit")
          .eq("id", uid)
          .single()

        if (mounted) {
          setUsage({
            left: Math.max(0, profile?.["messages left"] ?? 0),
            limit: Math.max(0, profile?.["message limit"] ?? 0),
          })
        }
      } catch (e) {
        // Swallow; might fail due to policies or columns not existing
        console.warn("Usage fetch/insert fallback error:", e)
      }
      if (mounted) setUsage({ left: 0, limit: 0 })
    }

    fetchUsage()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      fetchUsage()
    })
    return () => {
      sub?.subscription?.unsubscribe()
      mounted = false
    }
  }, [])

  // Realtime: subscribe to profile changes for current user and update usage instantly
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let active = true

    async function subscribe() {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData?.user?.id
      if (!uid) return

      channel = supabase
        .channel("profiles-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles", filter: `id=eq.${uid}` },
          (payload: any) => {
            const row = payload?.new as any
            if (!row) return
            if (active) setUsage({ left: Math.max(0, row["messages left"] ?? 0), limit: Math.max(0, row["message limit"] ?? 0) })
          }
        )
        .subscribe()
    }

    subscribe()

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      if (channel) supabase.removeChannel(channel)
      subscribe()
    })

    return () => {
      active = false
      authSub?.subscription?.unsubscribe()
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const consumeCredit = () => {
    setUsage((prev) => {
      if (!prev) return prev
      const left = (prev.left ?? 0) - 1
      return { left: left < 0 ? 0 : left, limit: prev.limit }
    })
  }

  return (
    <div className="flex h-[100dvh]">
      {/* Mobile sidebar drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
          </SheetHeader>
          <div className="flex h-full w-full flex-col border-r border-border/40 bg-background">
            <div className="p-4">
              <Button className="w-full rounded-xl" variant="outline" onClick={() => { if (typeof window !== 'undefined') window.sessionStorage.removeItem('lumio_chat_messages'); setChatKey((k) => k + 1); }}>
                New Chat
              </Button>
            </div>

            <div className="px-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History disabled</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Past conversations are temporarily disabled to optimize storage. Your current session will remain active.
              </p>
            </div>

            <div className="mt-auto p-4">
              {/* Usage display above Upgrade to Pro (mobile) */}
              <div className="rounded-xl border border-border/40 bg-card p-3">
                {userEmail && (
                  <div className="mb-1 text-xs text-muted-foreground">
                    {`Signed in as ${userEmail}`} {planLoading ? "• Plan: Loading…" : `• Plan: ${userPlan ?? "unknown"}`}
                  </div>
                )}
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message Count</div>
                <div className="mt-1 text-sm font-medium">
                  {usage ? `${Math.max(0, usage.left ?? 0)} / ${usage.limit ?? 0}` : "Sign in to track usage"}
                </div>
              </div>

              <Link href="/upgrade">
                <Button variant="secondary" className="mt-2 w-full rounded-xl">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Left sidebar (desktop only) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border/40 bg-background">
        <div className="p-4">
          <Button className="w-full rounded-xl" variant="outline" onClick={() => { if (typeof window !== 'undefined') window.sessionStorage.removeItem('lumio_chat_messages'); setChatKey((k) => k + 1); }}>
            New Chat
          </Button>
        </div>

        <div className="px-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History disabled</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Past conversations are temporarily disabled to optimize storage. Your current session will remain active.
          </p>
        </div>

        <div className="mt-auto p-4">
          {/* Usage display above Upgrade to Pro (desktop) */}
          <div className="rounded-xl border border-border/40 bg-card p-3">
            {userEmail && (
              <div className="mb-1 text-xs text-muted-foreground">
                {`Signed in as ${userEmail}`} {planLoading ? "• Plan: Loading…" : `• Plan: ${userPlan ?? "unknown"}`}
              </div>
            )}
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message Count</div>
            <div className="mt-1 text-sm font-medium">
              {usage ? `${Math.max(0, usage.left ?? 0)} / ${usage.limit ?? 0}` : "Sign in to track usage"}
            </div>
          </div>

          <Link href="/upgrade">
            <Button variant="secondary" className="mt-2 w-full rounded-xl">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1">
        <ChatInterface key={chatKey} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} onConsumeCredit={consumeCredit} messagesLeft={usage?.left ?? 0} messageLimit={usage?.limit ?? 0} />
      </main>
    </div>
  )
}

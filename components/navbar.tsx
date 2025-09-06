"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Package, ShoppingCart, User, Leaf, Menu, X, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { CartBadge } from "@/components/cart-badge"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/my-listings", label: "My Listings", icon: Package },
    { href: "/cart", label: "Cart", icon: ShoppingCart, showBadge: true },
    { href: "/orders", label: "Orders", icon: History },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-200">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">EcoFinds</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                      pathname === item.href
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-800"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105 active:scale-95",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                    {item.showBadge && <CartBadge />}
                  </Link>
                )
              })}

              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-border/50">
                <ThemeToggle />
                <div className="hidden xl:block">
                  <span className="text-sm text-muted-foreground">Welcome back,</span>
                  <span className="text-sm font-semibold text-foreground ml-1">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-300 dark:hover:border-red-800 transition-all duration-200 bg-transparent"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tablet Navigation */}
      <nav className="hidden md:block lg:hidden bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group">
              <div className="p-1 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-200">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">EcoFinds</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative",
                      pathname === item.href
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105 active:scale-95",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.showBadge && <CartBadge />}
                  </Link>
                )
              })}

              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="ml-3 text-xs bg-transparent hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Top Bar */}
      <nav className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 group">
            <div className="p-1 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-200">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">EcoFinds</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-md shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                      pathname === item.href
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "text-muted-foreground hover:text-foreground active:scale-95",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.showBadge && <CartBadge />}
                  </Link>
                )
              })}

              <div className="pt-3 mt-3 border-t border-border/50">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-300 dark:hover:border-red-800 transition-all duration-200"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-50 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-1 py-2 text-xs font-medium transition-all duration-200 relative group",
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground active:scale-95",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive ? "bg-emerald-50 dark:bg-emerald-950/50 shadow-sm" : "group-hover:bg-muted/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="truncate leading-none">{item.label}</span>
                {item.showBadge && <CartBadge />}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

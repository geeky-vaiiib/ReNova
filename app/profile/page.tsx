"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Save, X, Package, ShoppingCart, Leaf, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState({
    totalListings: 0,
    totalOrders: 0,
    totalSpent: 0,
    co2Saved: 0,
    joinDate: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditedUsername(parsedUser.username)
      setEditedEmail(parsedUser.email)
    }

    // Calculate user stats
    const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Mock additional listings for demo
    const totalListings = userProducts.length + 2 // +2 for mock products

    const totalSpent = orders.reduce((total: number, order: any) => total + order.total, 0) + 329.99 // +mock orders
    const totalOrderCount = orders.length + 2 // +2 for mock orders

    // Calculate total items purchased for CO2 savings
    const totalItems = orders.reduce((total: number, order: any) => {
      return total + order.items.reduce((itemTotal: number, item: any) => itemTotal + item.quantity, 0)
    }, 0)
    const co2Saved = (totalItems + 3) * 15 // +3 for mock items, 15kg per item

    setStats({
      totalListings,
      totalOrders: totalOrderCount,
      totalSpent: totalSpent,
      co2Saved,
      joinDate: "January 2024", // Mock join date
    })
  }, [])

  const handleSaveProfile = () => {
    setError("")
    setSuccess("")

    if (!editedUsername || !editedEmail) {
      setError("Please fill in all fields")
      return
    }

    if (!editedEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    const updatedUser = {
      ...user,
      username: editedUsername,
      email: editedEmail,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    setSuccess("Profile updated successfully!")

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleCancelEdit = () => {
    setEditedUsername(user.username)
    setEditedEmail(user.email)
    setIsEditing(false)
    setError("")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Profile Dashboard</h1>
              <p className="text-muted-foreground">Manage your account and view your ReNova activity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your personal details and account settings</CardDescription>
                      </div>
                      {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{user.username}</h3>
                        <p className="text-muted-foreground">Member since {stats.joinDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        {isEditing ? (
                          <Input
                            id="username"
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                          />
                        ) : (
                          <div className="p-2 bg-muted/30 rounded-md text-foreground">{user.username}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                          />
                        ) : (
                          <div className="p-2 bg-muted/30 rounded-md text-foreground">{user.email}</div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                {/* Activity Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Listings</span>
                      </div>
                      <Badge variant="secondary">{stats.totalListings}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Orders</span>
                      </div>
                      <Badge variant="secondary">{stats.totalOrders}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Spent</span>
                      </div>
                      <Badge variant="secondary">₹{stats.totalSpent.toFixed(2)}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Impact */}
                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-accent" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">{stats.co2Saved}kg</div>
                      <p className="text-sm text-muted-foreground">CO₂ saved by choosing second-hand items</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/my-listings">
                        <Package className="h-4 w-4 mr-2" />
                        View My Listings
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/orders">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order History
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/add-product">
                        <Package className="h-4 w-4 mr-2" />
                        Add New Product
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

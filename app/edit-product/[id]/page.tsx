"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<any>(null)

  const categories = ["Clothing", "Electronics", "Furniture", "Sports", "Books", "Music"]

  useEffect(() => {
    // Load product data for editing
    const productId = Number.parseInt(params.id as string)

    // Check user products first
    const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")
    let foundProduct = userProducts.find((p: any) => p.id === productId)

    // Add mock user products for demo
    if (!foundProduct && productId >= 101) {
      const userData = localStorage.getItem("user")
      const mockUserProducts = [
        {
          id: 101,
          title: "MacBook Pro 2019",
          description: "Well-maintained MacBook Pro, perfect for students or professionals",
          price: 899.99,
          category: "Electronics",
          imageUrl: "/placeholder.svg?height=300&width=300&text=MacBook",
          sellerId: 1,
          sellerName: userData ? JSON.parse(userData).username : "user",
        },
        {
          id: 102,
          title: "Vintage Denim Jacket",
          description: "Classic 90s denim jacket in excellent condition, size M",
          price: 45.0,
          category: "Clothing",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Denim+Jacket",
          sellerId: 1,
          sellerName: userData ? JSON.parse(userData).username : "user",
        },
      ]
      foundProduct = mockUserProducts.find((p) => p.id === productId)
    }

    if (foundProduct) {
      setProduct(foundProduct)
      setTitle(foundProduct.title)
      setDescription(foundProduct.description)
      setCategory(foundProduct.category)
      setPrice(foundProduct.price.toString())
      setImageUrl(foundProduct.imageUrl)
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validation
    if (!title || !description || !category || !price) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (description.length < 10) {
      setError("Description must be at least 10 characters long")
      setIsLoading(false)
      return
    }

    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price greater than 0")
      setIsLoading(false)
      return
    }

    try {
      const updatedProduct = {
        ...product,
        title,
        description,
        category,
        price: priceNum,
        imageUrl: imageUrl || "/placeholder.svg?height=300&width=300",
      }

      // Update in localStorage for demo
      const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")
      const updatedProducts = userProducts.map((p: any) => (p.id === product.id ? updatedProduct : p))
      localStorage.setItem("userProducts", JSON.stringify(updatedProducts))

      router.push("/my-listings")
    } catch (err) {
      setError("Failed to update product. Please try again.")
    }

    setIsLoading(false)
  }

  if (!product) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
              <Link href="/my-listings">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Listings
                </Button>
              </Link>
            </div>
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
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/my-listings">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
                <p className="text-muted-foreground">Update your product information</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Make changes to your product listing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter product title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product (minimum 10 characters)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                    <p className="text-xs text-muted-foreground">{description.length}/10 characters minimum</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? "Updating Product..." : "Update Product"}
                    </Button>
                    <Link href="/my-listings">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

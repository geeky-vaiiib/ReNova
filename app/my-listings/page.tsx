"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { productsAPI, type Product } from "@/lib/api"

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchMyProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productsAPI.getMyProducts()
      setProducts(response.products)
    } catch (error: any) {
      console.error("Error fetching my products:", error)
      toast({
        title: "Error",
        description: "Failed to load your products.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchMyProducts()
  }, [])

  const handleDeleteProduct = async (productId: number) => {
    try {
      await productsAPI.deleteProduct(productId)
      await fetchMyProducts() // Refresh the list
      setDeleteProductId(null)
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
              <p className="text-muted-foreground">Manage your products on the marketplace</p>
            </div>
            <Link href="/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading your products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start selling by adding your first product to the marketplace
                </p>
              </div>
              <Link href="/add-product">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} showActions={false} />

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link href={`/edit-product/${product.id}`}>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit product</span>
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteProductId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete product</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  )
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username: string, email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: async (id: number) => {
    return apiRequest(`/products/${id}`);
  },

  createProduct: async (productData: {
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string;
  }) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id: number, productData: Partial<{
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
  }>) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id: number) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getMyProducts: async (params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return apiRequest(`/products/my${queryString ? `?${queryString}` : ''}`);
  },
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    return apiRequest('/cart');
  },

  getCartCount: async () => {
    return apiRequest('/cart/count');
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem: async (id: number, quantity: number) => {
    return apiRequest(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (id: number) => {
    return apiRequest(`/cart/${id}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async (params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id: number) => {
    return apiRequest(`/orders/${id}`);
  },

  checkout: async () => {
    return apiRequest('/orders/checkout', {
      method: 'POST',
    });
  },

  updateOrderStatus: async (id: number, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getOrderStats: async () => {
    return apiRequest('/orders/stats');
  },
};

// Types for better TypeScript support
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  ownerId: number;
  owner?: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  priceAtPurchase: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

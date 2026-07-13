import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique ID based on selections (e.g., 'ring-silver-8')
  name: string;
  price: number;
  quantity: number;
  size: string;
  finish: string;
  image: string;
  variantId?: string; // Shopify Variant GID
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  
  // Computed
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const id = `${newItem.name.toLowerCase().replace(/\s+/g, '-')}-${newItem.finish.toLowerCase()}-${newItem.size}`;
        
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
              isOpen: true, // Auto open cart when adding
            };
          }
          
          return {
            items: [...state.items, { ...newItem, id }],
            isOpen: true, // Auto open cart when adding
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0 
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'itminan-cart-storage',
      // We don't want to persist the 'isOpen' state, only the items
      partialize: (state) => ({ items: state.items }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  stock: number;
  quantity: number;
  shopId: string;
};

type Store = {
  cart: Product[];
  wishList: Product[];

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;

  addToWishList: (product: Product) => void;
  removeFromWishList: (productId: string) => void;
  clearWishList: () => void;
  selectedItems: Product[];
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      wishList: [],
      selectedItems: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find(
            (item) => item.id === product.id
          );

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: product.quantity || 1,
              },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== productId
          ),
        }));
      },

      updateCartQuantity: (
        productId,
        quantity
      ) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, quantity),
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addToWishList: (product) => {
        set((state) => {
          const exists = state.wishList.some(
            (item) => item.id === product.id
          );

          if (exists) return state;

          return {
            wishList: [
              ...state.wishList,
              product,
            ],
          };
        });
      },

      removeFromWishList: (
        productId
      ) => {
        set((state) => ({
          wishList: state.wishList.filter(
            (item) => item.id !== productId
          ),
        }));
      },

      clearWishList: () => {
        set({ wishList: [] });
      },
    }),
    {
      name: 'ecommerce-store',
    }
  )
);
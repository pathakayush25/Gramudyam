import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState(() => productService.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortBy, setSortBy] = useState('featured');

  // Supabase is the source of truth for all real persisted products
  const refreshProductsFromSupabase = useCallback(async () => {
    try {
      const { data: dbProducts, error } = await productService.fetchFromSupabase();

      if (error) {
        console.warn('Could not fetch products from Supabase, relying on cache/mock:', error);
        return;
      }

      if (dbProducts && Array.isArray(dbProducts)) {
        const demoProducts = productService.getMockProducts();
        // Supabase products take precedence as real records; merge with non-colliding demo products
        const combined = [...dbProducts];
        for (const demo of demoProducts) {
          if (!combined.some((p) => String(p.id) === String(demo.id))) {
            combined.push(demo);
          }
        }

        setProducts(combined);
        productService.setLocalCache(combined);
      }
    } catch (err) {
      console.warn('Failed to refresh products from Supabase:', err);
    }
  }, []);

  useEffect(() => {
    refreshProductsFromSupabase();
  }, [refreshProductsFromSupabase]);

  const addOrUpdateProduct = useCallback((product) => {
    setProducts((prev) => {
      const existingIndex = prev.findIndex((p) => String(p.id) === String(product.id));
      let updated;
      if (existingIndex >= 0) {
        updated = prev.map((p, idx) => (idx === existingIndex ? { ...p, ...product } : p));
      } else {
        updated = [product, ...prev];
      }
      productService.setLocalCache(updated);
      return updated;
    });
    return product;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (!target) return;

    // Verify it is a persisted Supabase product before sending request to Supabase
    if (typeof id === 'string' && id.includes('-') && !target.isDemo) {
      const { error } = await productService.deleteFromSupabase(id, user?.id);
      if (error) {
        console.error('Delete product failed in Supabase:', error);
        throw error;
      }
    }

    // Only remove from UI/state if deletion succeeded
    setProducts((prev) => {
      const updated = prev.filter((p) => String(p.id) !== String(id));
      productService.setLocalCache(updated);
      return updated;
    });
  }, [products, user?.id]);

  const togglePublish = useCallback(async (id) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (!target) return;

    const nextPublished = !target.isPublished;

    // Verify it is a persisted Supabase product before sending request to Supabase
    if (typeof id === 'string' && id.includes('-') && !target.isDemo) {
      const { data, error } = await productService.togglePublishInSupabase(id, nextPublished, user?.id);
      if (error) {
        console.error('Toggle publish failed in Supabase:', error);
        throw error;
      }
      if (data) {
        setProducts((prev) => {
          const updated = prev.map((p) => (String(p.id) === String(id) ? { ...p, ...data } : p));
          productService.setLocalCache(updated);
          return updated;
        });
        return data;
      }
    }

    // Demo products local update
    setProducts((prev) => {
      const updated = prev.map((p) =>
        String(p.id) === String(id)
          ? { ...p, isPublished: nextPublished, is_available: nextPublished }
          : p
      );
      productService.setLocalCache(updated);
      return updated;
    });
  }, [products, user?.id]);

  // Filtered products list for Marketplace (only available/published crafts!)
  const filteredProducts = products.filter((product) => {
    if (product.is_available === false || product.isPublished === false) {
      return false;
    }
    // Search match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = (product.name || '').toLowerCase().includes(q);
      const matchNameMr = (product.nameMr || '').toLowerCase().includes(q);
      const matchArtisan = (product.artisan?.name || '').toLowerCase().includes(q);
      const matchVillage = (product.artisan?.village || '').toLowerCase().includes(q);
      const matchDesc = (product.description || '').toLowerCase().includes(q);
      if (!matchName && !matchNameMr && !matchArtisan && !matchVillage && !matchDesc) {
        return false;
      }
    }

    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Price match
    if (product.price > maxPrice) {
      return false;
    }

    // Cluster match
    if (selectedClusters.length > 0) {
      const clusterText = `${product.artisan?.village || ''} ${product.artisan?.district || ''} ${product.artisan?.cluster || ''}`.toLowerCase();
      const matchCluster = selectedClusters.some(c => clusterText.includes(c.toLowerCase().split(' ')[0]));
      if (!matchCluster) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // 'featured'
  });

  const updateProduct = useCallback(async (id, updates) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (!target) {
      throw new Error('Product not found in current catalog.');
    }

    // Verify it is a persisted Supabase product before sending request to Supabase
    if (typeof id === 'string' && id.includes('-') && !target.isDemo) {
      const { data, error } = await productService.updateInSupabase(id, updates, user?.id);
      if (error) {
        console.error('Update product failed in Supabase:', error);
        throw error;
      }
      if (data) {
        setProducts((prev) => {
          const updated = prev.map((p) => (String(p.id) === String(id) ? { ...p, ...data } : p));
          productService.setLocalCache(updated);
          return updated;
        });
        return data;
      }
    }

    // Demo products or local fallback update
    const updatedItem = {
      ...target,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : target.price,
      inStock: updates.inStock !== undefined ? Number(updates.inStock) : (updates.stock_quantity !== undefined ? Number(updates.stock_quantity) : target.inStock),
      stock_quantity: updates.stock_quantity !== undefined ? Number(updates.stock_quantity) : (updates.inStock !== undefined ? Number(updates.inStock) : target.stock_quantity)
    };
    setProducts((prev) => {
      const updated = prev.map((p) => (String(p.id) === String(id) ? updatedItem : p));
      productService.setLocalCache(updated);
      return updated;
    });
    return updatedItem;
  }, [products, user?.id]);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts: sortedProducts,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedClusters,
        setSelectedClusters,
        maxPrice,
        setMaxPrice,
        sortBy,
        setSortBy,
        addOrUpdateProduct,
        updateProduct,
        deleteProduct,
        togglePublish,
        refreshProductsFromSupabase
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

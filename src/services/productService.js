/* ==========================================================================
   PRODUCT SERVICE
   Supabase Data-Access Layer & Local Offline Catalog Cache
   ========================================================================== */

import { supabase } from '../lib/supabase';
import { mockProducts } from '../data/mockData';
import { formatTrustTagId } from '../utils/trustTag';

const PRODUCTS_STORAGE_KEY = 'gramudyam_products_catalog';
const DEFAULT_PRODUCT_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F';
const DEFAULT_ARTISAN_AVATAR =
  'https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK';

/**
 * Maps a row from public.products in Supabase to the application's product format.
 */
export function mapRowToProduct(row) {
  if (!row) return null;

  const priceNum = Number(row.price);
  const stockNum = Number(row.stock_quantity);

  const artisanName =
    row.profiles?.full_name ||
    (row.village ? `Artisan of ${row.village}` : 'Master Artisan');

  return {
    id: row.id,
    supabaseId: row.id,
    artisan_id: row.artisan_id,
    name: row.name,
    nameMr: row.name,
    nameHi: row.name,
    description: row.description || '',
    story: row.description || '',
    price: Number.isFinite(priceNum) ? priceNum : 0,
    originalPrice: Number.isFinite(priceNum) ? Math.round(priceNum * 1.25) : 0,
    stock_quantity: Number.isFinite(stockNum) ? stockNum : 1,
    inStock: Number.isFinite(stockNum) ? stockNum : 1,
    category: row.category || 'Handicrafts & Tribal Art',
    craft: row.craft || row.category || 'Handicrafts',
    village: row.village || 'Palghar',
    district: row.district || 'Palghar',
    image: row.image_url || DEFAULT_PRODUCT_IMAGE,
    images: [row.image_url || DEFAULT_PRODUCT_IMAGE],
    image_url: row.image_url || '',
    is_available: row.is_available ?? true,
    isPublished: row.is_available !== false,
    isDemo: false,
    artisan: {
      name: artisanName,
      nameMr: artisanName,
      role: 'Master Artisan',
      avatar: row.profiles?.avatar_url || DEFAULT_ARTISAN_AVATAR,
      village: row.village || 'Palghar',
      district: row.district || 'Palghar',
      cluster: row.village ? `${row.village} Craft Collective` : 'Rural Craft Collective',
      shgName: 'Adivasi Mahila Warli Kala Bachat Gat'
    },
    trustTagId: formatTrustTagId(row.id),
    blockHash: `0x${String(row.id).replace(/-/g, '').slice(0, 16)}`,
    qualityScore: 94,
    remittancePercent: 88.0,
    rating: 5.0,
    reviewsCount: 0,
    scansCount: 1,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export const productService = {
  /**
   * Fetches all real persisted products from Supabase public.products
   */
  async fetchFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch products from Supabase:', error);
        return { data: null, error };
      }

      const mapped = (data || []).map(mapRowToProduct);
      return { data: mapped, error: null };
    } catch (err) {
      console.error('Network or client error fetching products from Supabase:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetches a single product by UUID or ID from Supabase public.products
   */
  async fetchByIdFromSupabase(id) {
    try {
      if (!id) return { data: null, error: new Error('Product ID required') };

      const { data, error } = await supabase
        .from('products')
        .select('*, profiles(full_name, avatar_url)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Failed to fetch product by ID from Supabase:', error);
        return { data: null, error };
      }

      return { data: mapRowToProduct(data), error: null };
    } catch (err) {
      console.error('Network or client error fetching product by ID:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Inserts a new product row into public.products in Supabase
   */
  async createInSupabase(productData, userId) {
    try {
      const rawStock = Number(productData.stock_quantity ?? productData.inStock ?? 1);
      const rawPrice = Number(productData.price);

      const productRow = {
        artisan_id: userId,
        name: String(productData.name || '').trim(),
        description: String(productData.description || productData.story || ''),
        price: Number.isFinite(rawPrice) ? rawPrice : 0,
        stock_quantity: Number.isFinite(rawStock) ? Math.max(0, Math.floor(rawStock)) : 1,
        category: productData.category || 'Handicrafts & Tribal Art',
        craft: productData.craft || productData.category || 'Handicrafts',
        village: productData.artisan?.village || productData.location || productData.village || '',
        district: productData.artisan?.district || productData.district || 'Palghar',
        image_url:
          productData.image_url ||
          (typeof productData.image === 'string' && /^https?:\/\//i.test(productData.image) ? productData.image : null),
        is_available: productData.is_available ?? true
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productRow)
        .select()
        .single();

      if (error) {
        console.error('Failed to insert product into Supabase:', error);
        return { data: null, error };
      }

      return { data: mapRowToProduct(data), error: null };
    } catch (err) {
      console.error('Error in createInSupabase:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Updates an existing product row in public.products in Supabase
   */
  async updateInSupabase(id, updates, userId) {
    try {
      const productRow = {
        updated_at: new Date().toISOString()
      };

      if (updates.name !== undefined) productRow.name = String(updates.name).trim();
      if (updates.description !== undefined || updates.story !== undefined) {
        productRow.description = updates.description !== undefined ? String(updates.description) : String(updates.story);
      }
      if (updates.price !== undefined) {
        const p = Number(updates.price);
        if (Number.isFinite(p)) productRow.price = p;
      }
      if (updates.stock_quantity !== undefined || updates.inStock !== undefined) {
        const s = Number(updates.stock_quantity ?? updates.inStock);
        if (Number.isFinite(s)) productRow.stock_quantity = Math.max(0, Math.floor(s));
      }
      if (updates.category !== undefined) productRow.category = updates.category;
      if (updates.craft !== undefined) productRow.craft = updates.craft;
      if (updates.village !== undefined || updates.artisan?.village !== undefined) {
        productRow.village = updates.village || updates.artisan?.village;
      }
      if (updates.district !== undefined || updates.artisan?.district !== undefined) {
        productRow.district = updates.district || updates.artisan?.district;
      }
      if (updates.image_url !== undefined) productRow.image_url = updates.image_url;
      if (updates.is_available !== undefined || updates.isPublished !== undefined) {
        productRow.is_available = updates.is_available !== undefined ? Boolean(updates.is_available) : Boolean(updates.isPublished);
      }

      let query = supabase.from('products').update(productRow).eq('id', id);
      if (userId) {
        query = query.eq('artisan_id', userId);
      }

      const { data, error } = await query.select().single();

      if (error) {
        console.error('Failed to update product in Supabase:', error);
        return { data: null, error };
      }

      return { data: mapRowToProduct(data), error: null };
    } catch (err) {
      console.error('Error in updateInSupabase:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Deletes a product row from public.products in Supabase
   */
  async deleteFromSupabase(id, userId) {
    try {
      let query = supabase.from('products').delete().eq('id', id);
      if (userId) {
        query = query.eq('artisan_id', userId);
      }

      const { data, error } = await query.select();
      if (error) {
        console.error('Failed to delete product from Supabase:', error);
        return { error };
      }

      if (!data || data.length === 0) {
        const authErr = new Error('Deletion failed. You do not have permission to delete this product or it does not exist in Supabase.');
        return { error: authErr };
      }

      return { error: null };
    } catch (err) {
      console.error('Error in deleteFromSupabase:', err);
      return { error: err };
    }
  },

  /**
   * Toggles product is_available in public.products in Supabase
   */
  async togglePublishInSupabase(id, isAvailable, userId) {
    try {
      let query = supabase
        .from('products')
        .update({
          is_available: Boolean(isAvailable),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (userId) {
        query = query.eq('artisan_id', userId);
      }

      const { data, error } = await query.select().single();
      if (error) {
        console.error('Failed to toggle product status in Supabase:', error);
        return { data: null, error };
      }

      return { data: mapRowToProduct(data), error: null };
    } catch (err) {
      console.error('Error in togglePublishInSupabase:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Local Cache and Demo Data helpers
   */
  getLocalCache() {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  },

  setLocalCache(products) {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Could not write to local products cache:', e);
    }
  },

  getMockProducts() {
    return mockProducts.map(p => ({
      ...p,
      isDemo: true,
      isPublished: p.isPublished ?? true,
      is_available: p.is_available ?? true
    }));
  },

  /**
   * Backwards-compatible synchronous methods
   */
  getAll() {
    const cached = this.getLocalCache();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      const sanitized = cached.filter((p) => {
        if (!p || typeof p !== 'object') return false;
        if (p.isDemo) return true;
        if (mockProducts.some((m) => String(m.id) === String(p.id))) return true;
        if (typeof p.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id)) return true;
        return false;
      });
      if (sanitized.length > 0) {
        return sanitized;
      }
    }
    const demo = this.getMockProducts();
    this.setLocalCache(demo);
    return demo;
  },

  getById(id, productList = null) {
    const list = productList || this.getAll();
    return list.find(p => String(p.id) === String(id) || p.trustTagId === String(id));
  },

  saveProduct(product) {
    console.warn(
      'productService.saveProduct writes to local cache only. For permanent persistence, use createInSupabase or updateInSupabase.'
    );
    const products = this.getAll();
    const existingIndex = products.findIndex(p => String(p.id) === String(product.id));
    let updated;
    if (existingIndex >= 0) {
      updated = products.map((p, idx) => (idx === existingIndex ? { ...p, ...product } : p));
    } else {
      updated = [product, ...products];
    }
    this.setLocalCache(updated);
    return updated;
  },

  deleteProduct(id) {
    const products = this.getAll();
    const filtered = products.filter(p => String(p.id) !== String(id));
    this.setLocalCache(filtered);
    return filtered;
  },

  togglePublish(id) {
    const products = this.getAll();
    const updated = products.map(p => {
      if (String(p.id) === String(id)) {
        const nextState = !p.isPublished;
        return { ...p, isPublished: nextState, is_available: nextState };
      }
      return p;
    });
    this.setLocalCache(updated);
    return updated;
  }
};

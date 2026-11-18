import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { QRCodeView } from '../../components/QRCodeView';
import { formatTrustTagId } from '../../utils/trustTag';

export const MyProducts = () => {
  const { products, togglePublish, deleteProduct, updateProduct } = useProducts();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedTagProduct, setSelectedTagProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Filter to currently authenticated artisan's products or demo products in guest/demo mode
  const isRealArtisan = Boolean(
    user?.id &&
    typeof user.id === 'string' &&
    user.id.length === 36 &&
    user.id.includes('-') &&
    !user.id.startsWith('artisan-')
  );

  const artisanProducts = isRealArtisan
    ? products.filter((p) => p.artisan_id === user.id)
    : products.filter((p) => p.isDemo);

  const filtered = artisanProducts.filter((p) =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        inStock: Number(editingProduct.inStock ?? editingProduct.stock_quantity ?? 1),
        stock_quantity: Number(editingProduct.inStock ?? editingProduct.stock_quantity ?? 1),
        description: editingProduct.description || ''
      });
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product in Supabase:', err);
      setActionError(err.message || 'Could not update product in Supabase. Please verify your connection and permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (product) => {
    setActionError(null);
    setActionLoadingId(product.id);
    try {
      await togglePublish(product.id);
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
      setActionError(err.message || 'Could not update publication status in Supabase.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to remove "${product.name}"?`)) return;
    setActionError(null);
    setActionLoadingId(product.id);
    try {
      await deleteProduct(product.id);
    } catch (err) {
      console.error('Failed to delete product from Supabase:', err);
      setActionError(err.message || 'Could not delete product from Supabase. You can only delete your own products.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            {t('entrepreneur.myProductsTitle', 'Catalog Management')}
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('entrepreneur.myProductsTitle', 'My Products')} ({artisanProducts.length})
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('landing.pillarsSubtitle', 'Manage pricing, inventory, publish state, and QR TrustTags for all your artisanal creations.')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/entrepreneur/voice-create" state={{ isNew: true }} className="btn-primary">
            <span className="material-symbols-outlined">mic</span>
            <span>{t('entrepreneur.voiceStudioBtn', 'Add via Voice Studio')}</span>
          </Link>
        </div>
      </div>

      {/* Action Error Notification */}
      {actionError && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--error-container)',
            color: 'var(--error)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ maxWidth: '360px' }}>
        <input
          type="text"
          placeholder={t('marketplace.searchPlaceholder', 'Filter your products...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-base"
        />
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Craft Item</th>
              <th>Category</th>
              <th>Direct Price</th>
              <th>Stock</th>
              <th>Quality Score</th>
              <th>TrustTag</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--on-surface-variant)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--outline)' }}>
                      inventory_2
                    </span>
                    <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      {searchTerm ? 'No craft items match your search filter.' : 'No products listed yet in your catalog.'}
                    </div>
                    <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: 0 }}>
                      {searchTerm
                        ? 'Try clearing the search box to see all your products.'
                        : 'Use Voice Studio to record and list your authentic handcrafted items.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isLoading = actionLoadingId === product.id;
                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{product.artisan?.village || product.village}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{product.category}</td>
                    <td style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{product.price?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{product.inStock || product.stock_quantity || 1} units</td>
                    <td>
                      <span
                        className="badge-pill"
                        style={{
                          backgroundColor: product.qualityScore >= 90 ? 'var(--success-container)' : 'var(--warning-container)',
                          color: product.qualityScore >= 90 ? 'var(--success)' : 'var(--warning)',
                          fontSize: '0.75rem'
                        }}
                      >
                        {product.qualityScore || 94}% ✓
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedTagProduct(product)}
                        className="badge-pill"
                        style={{
                          backgroundColor: 'var(--surface-container-high)',
                          color: 'var(--secondary)',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: '1px solid var(--border-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="View, download & print QR Trust Tag"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                          qr_code_2
                        </span>
                        <span>{formatTrustTagId(product.id)}</span>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(product)}
                        disabled={isLoading}
                        className="badge-pill"
                        style={{
                          backgroundColor: product.isPublished ? 'var(--primary-fixed)' : 'var(--surface-container-high)',
                          color: product.isPublished ? 'var(--primary)' : 'var(--outline)',
                          cursor: isLoading ? 'wait' : 'pointer',
                          border: 'none',
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        {isLoading ? 'Updating...' : product.isPublished ? 'Live on Market' : 'Draft Only'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedTagProduct(product)}
                          className="btn-cream btn-sm"
                          title="View QR Trust Tag"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            qr_code_2
                          </span>
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          disabled={isLoading}
                          className="btn-cream btn-sm"
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          disabled={isLoading}
                          className="btn-cream btn-sm"
                          style={{ color: 'var(--error)' }}
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 56, 39, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000
          }}
        >
          <div
            className="card-base"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              backgroundColor: 'var(--surface-container-lowest)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                Edit Craft Listing
              </h3>
              <button onClick={() => setEditingProduct(null)} style={{ color: 'var(--outline)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label-field">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="input-base"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="label-field">Direct Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Units in Stock</label>
                  <input
                    type="number"
                    value={editingProduct.inStock ?? editingProduct.stock_quantity ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: Number(e.target.value) })}
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="input-base"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-cream" disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Trust Tag Modal */}
      {selectedTagProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 56, 39, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1100
          }}
          onClick={() => setSelectedTagProduct(null)}
        >
          <div
            className="card-base"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedTagProduct(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--outline)',
                padding: '4px'
              }}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
              {selectedTagProduct.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '1.25rem' }}>
              Official QR Trust Tag for packaging & public provenance.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QRCodeView product={selectedTagProduct} size={200} showActions={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';
import { QRCodeView } from '../../components/QRCodeView';
import {
  formatTrustTagId,
  formatCurrency,
  getProductTrustTagUrl,
  copyTrustTagUrl
} from '../../utils/trustTag';

export const TrustTagPage = () => {
  const { products } = useProducts();
  const { t } = useLanguage();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '1');
  const [copiedId, setCopiedId] = useState(null);

  const activeProduct =
    products.find((p) => String(p.id) === String(selectedProductId)) || products[0];

  const handlePrintSheet = () => {
    window.print();
  };

  const handleCopyLink = async (productId, e) => {
    e?.stopPropagation();
    const ok = await copyTrustTagUrl(productId);
    if (ok) {
      setCopiedId(productId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              qr_code_2
            </span>
            <span>{t('trustTag', 'QR Trust Tag')} • सत्यता टॅग व्यवस्थापक</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            QR Trust Tag Label Studio
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', maxWidth: '680px' }}>
            Generate, download, and print official Gramudyam QR Trust Tag seals. Affix these scannable tags to physical packaging so customers can instantly discover your craft origin and artisan story.
          </p>
        </div>

        <button type="button" onClick={handlePrintSheet} className="btn-primary">
          <span className="material-symbols-outlined">print</span>
          <span>Print Packaging Seal</span>
        </button>
      </div>

      {/* Main Grid: Label Studio & Active Catalog Tags */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'flex-start'
        }}
      >
        {/* Left: Product Selector & TrustTag Packaging Seal Studio */}
        <div
          className="card-base"
          style={{
            padding: '2rem',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ width: '100%', textAlign: 'left' }}>
            <label className="label-field" style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '6px', display: 'block' }}>
              Select Craft to View & Print Tag:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="select-base"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatTrustTagId(p.id)})
                </option>
              ))}
            </select>
          </div>

          {/* Render Vector QR TrustTag */}
          <div
            style={{
              padding: '1rem',
              border: '2px dashed var(--secondary)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-container-low)',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <QRCodeView product={activeProduct} size={180} showActions={true} />
          </div>

          {/* Active Product Summary Box */}
          {activeProduct && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-container-low)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeProduct.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                  {activeProduct.craft || activeProduct.category} • {formatCurrency(activeProduct.price)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontFamily: 'monospace', marginTop: '2px', wordBreak: 'break-all' }}>
                  {getProductTrustTagUrl(activeProduct.id)}
                </div>
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
            Affix this physical label to the exterior of the eco-friendly wrapping or parcel box before handing over to the rural postal carrier.
          </div>
        </div>

        {/* Right: Active TrustTags Inventory Table */}
        <div
          className="card-base"
          style={{
            padding: '1.75rem',
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: 'var(--primary)',
                margin: 0
              }}
            >
              Registered Products & Trust Tags ({products.length})
            </h3>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Trust Tag Ref</th>
                  <th>Record Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isSelected = String(p.id) === String(selectedProductId);
                  const isLive = p.is_available !== false && p.isPublished !== false;
                  const tagId = formatTrustTagId(p.id);

                  return (
                    <tr
                      key={p.id}
                      style={{
                        backgroundColor: isSelected ? 'var(--surface-container-low)' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedProductId(p.id)}
                    >
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                          {p.craft || p.category} • {formatCurrency(p.price)}
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            color: 'var(--secondary)',
                            fontSize: '0.85rem'
                          }}
                        >
                          {tagId}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge-pill ${isLive ? 'badge-success' : 'badge-warning'}`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isLive ? 'Active Record ✓' : 'Draft'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                          {/* View Verification Page */}
                          <Link
                            to={`/trust-tag/${p.id}`}
                            className="btn-cream btn-sm"
                            style={{ padding: '0.3rem 0.55rem', textDecoration: 'none' }}
                            title="Open public verification page"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                              visibility
                            </span>
                          </Link>

                          {/* Copy URL */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyLink(p.id, e)}
                            className="btn-cream btn-sm"
                            style={{ padding: '0.3rem 0.55rem' }}
                            title="Copy Trust Tag URL"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                              {copiedId === p.id ? 'check' : 'content_copy'}
                            </span>
                          </button>

                          {/* Select for printing */}
                          <button
                            type="button"
                            onClick={() => setSelectedProductId(p.id)}
                            className="btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                            title="Select this craft in studio"
                          >
                            Select
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustTagPage;

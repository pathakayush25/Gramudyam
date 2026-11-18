import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useProducts } from '../context/ProductContext';
import {
  getProductTrustTagUrl,
  formatTrustTagId,
  downloadTrustTagPng,
  copyTrustTagUrl
} from '../utils/trustTag';

/**
 * QRCodeView Component
 * Renders an authentic, scannable QR Trust Tag for any product.
 * Encodes the public /trust-tag/:productId destination.
 *
 * Supports:
 * - Real high-contrast vector QR code with generous quiet-zone
 * - High-resolution PNG tag download
 * - Clean packaging print view
 * - One-click public link copying
 * - Direct navigation to the public provenance page
 */
export const QRCodeView = ({
  product: productProp,
  productId: productIdProp,
  trustTagId: trustTagIdProp,
  size = 180,
  showActions = true,
  showDetails = true,
  compact = false
}) => {
  const { products } = useProducts();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrCanvasRef = useRef(null);

  // 1. Resolve product object
  let resolvedProduct = productProp;
  if (!resolvedProduct) {
    const searchKey = productIdProp || trustTagIdProp;
    if (searchKey && products && products.length > 0) {
      resolvedProduct = products.find(
        (p) =>
          String(p.id) === String(searchKey) ||
          p.trustTagId === String(searchKey) ||
          p.supabaseId === String(searchKey)
      );
    }
  }

  // Fallback product stub if only an ID was provided
  const targetId =
    resolvedProduct?.id ||
    productIdProp ||
    (trustTagIdProp ? trustTagIdProp.replace(/^GM-TRUST-/, '') : null);

  const product = resolvedProduct || {
    id: targetId || 'sample',
    name: resolvedProduct?.name || 'Artisan Craft',
    craft: resolvedProduct?.craft || 'Handicrafts',
    village: resolvedProduct?.village || 'Palghar',
    district: resolvedProduct?.district || 'Palghar',
    isPublished: true,
    is_available: true
  };

  // Determine if this is an unsaved product (e.g. temporary draft in memory without stable ID)
  const isUnsaved = !targetId || targetId === 'sample' || product.isDraft === true || product.isPublished === false && !product.id;
  const isDraftOnly = product.is_available === false || product.isPublished === false;

  // 2. Generate canonical public URL
  const destinationUrl = targetId ? getProductTrustTagUrl(targetId) : '';
  const displayTagId = formatTrustTagId(targetId || product.trustTagId);

  // 3. Handlers
  const handleCopyLink = async () => {
    if (!targetId || isUnsaved) return;
    const ok = await copyTrustTagUrl(targetId);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleDownload = async () => {
    if (!targetId || isUnsaved) return;
    setIsDownloading(true);
    try {
      // Find the hidden canvas rendered by QRCodeCanvas
      const canvasEl = qrCanvasRef.current ? qrCanvasRef.current.querySelector('canvas') : null;
      await downloadTrustTagPng({ product, qrCanvas: canvasEl });
    } catch (err) {
      console.error('Failed to download QR Trust Tag image:', err);
      alert('Could not download QR Trust Tag. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Unsaved / invalid state: disable QR generation with friendly explanation
  if (isUnsaved && !productIdProp && !trustTagIdProp) {
    return (
      <div
        className="card-base"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.75rem',
          textAlign: 'center',
          backgroundColor: 'var(--surface-container-low)',
          border: '2px dashed var(--outline-variant)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '360px',
          width: '100%'
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '42px', color: 'var(--outline)', marginBottom: '0.5rem' }}
        >
          qr_code_scanner
        </span>
        <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
          QR Trust Tag Pending
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, margin: 0 }}>
          This craft must be saved to the database before an official, scannable QR Trust Tag can be generated.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Visual Component on Screen */}
      <div
        className="qr-trusttag-card"
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: compact ? '0.75rem' : '1.25rem',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '100%',
          position: 'relative'
        }}
      >
        {/* Decorative Wada Carving Header Border */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: compact ? '0.5rem' : '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img
              src="/logo.png"
              alt="Gramudyam"
              style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '50%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.svg';
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--primary)',
                letterSpacing: '0.04em'
              }}
            >
              GRAMUDYAM TRUST TAG
            </span>
          </div>

          <span
            style={{
              fontSize: '0.65rem',
              color: isDraftOnly ? 'var(--warning)' : 'var(--success)',
              backgroundColor: isDraftOnly ? 'var(--warning-container)' : 'var(--success-container)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}
          >
            {isDraftOnly ? 'Draft Record' : 'Record Verified ✓'}
          </span>
        </div>

        {/* Real Scannable Vector QR Code with Quiet Zone */}
        <div
          style={{
            position: 'relative',
            width: `${size}px`,
            height: `${size}px`,
            padding: '10px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #ECECEC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'
          }}
          title={`Scan with phone camera to open: ${destinationUrl}`}
        >
          <QRCodeSVG
            value={destinationUrl}
            size={size - 20}
            level="M"
            marginSize={2}
            fgColor="#073827"
            bgColor="#FFFFFF"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Hidden high-res canvas used for PNG downloads */}
        <div ref={qrCanvasRef} style={{ display: 'none' }} aria-hidden="true">
          <QRCodeCanvas
            value={destinationUrl}
            size={600}
            level="H"
            marginSize={2}
            fgColor="#073827"
            bgColor="#FFFFFF"
          />
        </div>

        {/* TrustTag ID Label & Instructions */}
        {showDetails && (
          <div style={{ textAlign: 'center', marginTop: compact ? '0.5rem' : '0.75rem', width: '100%' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontWeight: '700',
                fontSize: compact ? '0.8rem' : '0.95rem',
                color: 'var(--primary)',
                letterSpacing: '0.08em'
              }}
            >
              {displayTagId}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--on-surface-variant)',
                marginTop: '3px',
                maxWidth: '220px',
                marginInline: 'auto',
                lineHeight: 1.35
              }}
            >
              Scan with any mobile camera to discover this craft and artisan
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.45rem',
              marginTop: '0.85rem',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            {/* View / Verify Link */}
            <Link
              to={`/trust-tag/${targetId}`}
              className="btn-primary btn-sm"
              style={{
                textDecoration: 'none',
                fontSize: '0.75rem',
                padding: '0.4rem 0.75rem',
                flex: '1 1 110px',
                justifyContent: 'center'
              }}
              title="Open public verification page"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                verified
              </span>
              <span>View Tag</span>
            </Link>

            {/* Download PNG */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-cream btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.4rem 0.75rem',
                flex: '1 1 100px',
                justifyContent: 'center'
              }}
              title="Download high-resolution label as PNG"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                download
              </span>
              <span>{isDownloading ? 'Saving...' : 'PNG Tag'}</span>
            </button>

            {/* Print Tag */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn-cream btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.4rem 0.65rem'
              }}
              title="Print packaging label"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                print
              </span>
              <span>Print</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-cream btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.4rem 0.65rem',
                color: copySuccess ? 'var(--success)' : 'inherit'
              }}
              title="Copy public Trust Tag URL to clipboard"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                {copySuccess ? 'check' : 'content_copy'}
              </span>
              <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Printable Packaging Tag Layout (Appears only when window.print() is executed) */}
      <div className="gramudyam-printable-label" aria-hidden="true">
        <div className="printable-label-border">
          <div className="printable-label-header">
            <div className="printable-brand">GRAMUDYAM TRUST TAG</div>
            <div className="printable-sub">ग्रामोद्योग सत्यता मुद्रा • Authentic Indian Craft</div>
          </div>

          <div className="printable-divider" />

          <div className="printable-product-title">{product.name}</div>
          <div className="printable-craft-meta">
            {product.craft || product.category || 'Handicraft'}
            {(product.village || product.artisan?.village)
              ? ` • ${product.village || product.artisan?.village}, ${product.district || product.artisan?.district || 'Palghar'}`
              : ''}
          </div>

          <div className="printable-qr-box">
            <QRCodeSVG
              value={destinationUrl}
              size={220}
              level="M"
              marginSize={2}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="printable-tag-id">{displayTagId}</div>
          <div className="printable-instruction">
            Scan to discover this product and the artisan behind it.
          </div>
          <div className="printable-url">{destinationUrl}</div>

          <div className="printable-footer">
            Authentic Product Record Stored on Gramudyam • gramudyam.in
          </div>
        </div>
      </div>

      <style>{`
        /* Screen View: Hide printable label element */
        .gramudyam-printable-label {
          display: none;
        }

        /* Print Media Styles: Clean, professional label format for thermal or standard A4 packaging sticker */
        @media print {
          body * {
            visibility: hidden !important;
          }

          .gramudyam-printable-label,
          .gramudyam-printable-label * {
            visibility: visible !important;
          }

          .gramudyam-printable-label {
            display: flex !important;
            position: absolute !important;
            left: 50% !important;
            top: 2rem !important;
            transform: translateX(-50%) !important;
            width: 320px !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 16px !important;
          }

          .printable-label-border {
            border: 3px solid #073827;
            padding: 14px;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
          }

          .printable-brand {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #073827;
          }

          .printable-sub {
            font-size: 9px;
            color: #964826;
            margin-top: 2px;
          }

          .printable-divider {
            height: 1px;
            background: #073827;
            margin: 8px 0;
          }

          .printable-product-title {
            font-size: 14px;
            font-weight: 700;
            color: #073827;
            margin-top: 4px;
            line-height: 1.25;
          }

          .printable-craft-meta {
            font-size: 10px;
            color: #444444;
            margin-top: 2px;
            margin-bottom: 8px;
          }

          .printable-qr-box {
            display: flex;
            justify-content: center;
            margin: 8px 0;
          }

          .printable-tag-id {
            font-family: monospace;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #073827;
          }

          .printable-instruction {
            font-size: 10px;
            font-weight: 600;
            color: #234f3d;
            margin-top: 4px;
          }

          .printable-url {
            font-family: monospace;
            font-size: 8px;
            color: #666666;
            margin-top: 4px;
            word-break: break-all;
          }

          .printable-footer {
            font-size: 7.5px;
            color: #888888;
            border-top: 1px dashed #cccccc;
            padding-top: 6px;
            margin-top: 8px;
          }
        }
      `}</style>
    </>
  );
};

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { QRCodeView } from '../components/QRCodeView';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const product = products.find((p) => String(p.id) === String(id) || p.trustTagId === String(id)) || products[0];

  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="content-top-spacer container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/marketplace" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Marketplace</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const title = (lang === 'mr' && product.nameMr) ? product.nameMr : (lang === 'hi' && product.nameHi) ? product.nameHi : product.name;
  const artisanName = (lang === 'mr' && product.artisan?.nameMr) ? product.artisan.nameMr : (lang === 'hi' && product.artisan?.nameHi) ? product.artisan.nameHi : product.artisan?.name;

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--outline)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--on-surface-variant)' }}>{t('navigation.home', 'Home')}</Link>
          <span>/</span>
          <Link to="/marketplace" style={{ color: 'var(--on-surface-variant)' }}>{t('navigation.marketplace', 'Marketplace')}</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{title}</span>
        </div>

        {/* Top Product Section Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start', marginBottom: '4rem' }}>
          {/* Left: Image Gallery */}
          <div>
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1rem'
              }}
            >
              <img
                src={activeImage || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* GI Tag Overlay */}
              {product.giTagged && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>workspace_premium</span>
                  <span>{product.giTagLabel || 'GI Tagged Heritage'}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Cluster Provenance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="badge-pill badge-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                <span>{product.artisan?.village}, {product.artisan?.district}</span>
              </div>
              <div className="badge-pill badge-secondary">
                <span>{product.category}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="headline-lg" style={{ color: 'var(--primary)', lineHeight: 1.25 }}>
              {title}
            </h1>

            {/* Ratings & Trust Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
                <span style={{ fontWeight: '700', fontSize: '0.9rem', marginLeft: '4px' }}>{product.rating}</span>
              </div>
              <span style={{ color: 'var(--outline-variant)' }}>•</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                {product.reviewsCount} Verified Buyer Reviews
              </span>
              <span style={{ color: 'var(--outline-variant)' }}>•</span>
              <Link to={`/verify/${product.trustTagId}`} style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                QR TrustTag #{product.trustTagId}
              </Link>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.5rem 0' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--outline)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>
                {t('product.retailPrice', 'Direct Village Fair-Trade Price')}
              </span>
            </div>

            {/* Description */}
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: '1.65' }}>
              {product.description}
            </p>

            {/* Quantity Selector & Dual Buy Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-container-high)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' }}
                >
                  -
                </button>
                <span style={{ width: '36px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary"
                style={{ flex: '1 1 180px', height: '48px', fontSize: '0.95rem' }}
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                <span>{t('addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{ flex: '1 1 180px', height: '48px', fontSize: '0.95rem' }}
              >
                <span className="material-symbols-outlined">bolt</span>
                <span>{t('buyNow')}</span>
              </button>
            </div>

            {/* Trust Assurance Bar */}
            <div
              style={{
                backgroundColor: 'var(--surface-container)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--on-surface-variant)',
                marginTop: '0.5rem'
              }}
            >
              <div>
                <strong style={{ color: 'var(--primary)', display: 'block' }}>{t('product.dbtShare', 'Direct Remittance')}</strong>
                {product.remittancePercent || 86}% {t('product.directPayout', 'to Maker')}
              </div>
              <div>
                <strong style={{ color: 'var(--primary)', display: 'block' }}>{t('customer.platformLogistics', 'SpeedPost Rural')}</strong>
                {t('customer.freeShipping', 'Safe Insured Delivery')}
              </div>
              <div>
                <strong style={{ color: 'var(--primary)', display: 'block' }}>{t('trustTag', 'TrustTag Verified')}</strong>
                {t('product.trustTagVerified', '100% Authentic')}
              </div>
            </div>
          </div>
        </div>

        {/* ================= ARTISAN PROVENANCE & STORY BENTO ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
          {/* Artisan Profile Card */}
          <div className="card-base" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={product.artisan?.avatar || "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"}
                alt={artisanName}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--secondary)' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
                  {product.artisan?.role || 'Master Artisan'}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', lineHeight: 1.2 }}>
                  {artisanName}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                  {product.artisan?.shgName}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
              Based in {product.artisan?.village}, {product.artisan?.district}, {artisanName} leads a collaborative self-help craft guild preserving ancestral skills while empowering rural women to achieve financial autonomy.
            </p>

            <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>payments</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {product.remittancePercent || 86.2}% Direct Remittance
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>
                    Deposited directly via Aadhaar-linked SHG Bank Account
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Craft Narrative Story */}
          <div className="card-cream" style={{ padding: '2rem' }}>
            <div className="badge-pill badge-primary" style={{ marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>history_edu</span>
              <span>Craft Narrative • वारसा कथा</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
              How This Piece Was Created
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              {product.story}
            </p>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Key Technical Specifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '3px' }}>
                    <span style={{ color: 'var(--outline)' }}>{key}:</span>
                    <span style={{ fontWeight: '600', color: 'var(--on-surface)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= QR TRUSTTAG INSPECTION DRAWER ================= */}
        <div
          className="card-base"
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div className="badge-pill badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
              <span>Gramudyam Trust Tag</span>
            </div>
            <h2 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
              Product Provenance: {product.trustTagId || `GM-TRUST-${String(product.id).slice(0, 8).toUpperCase()}`}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Each physical package carries this QR seal. Scanning with any smartphone camera instantly displays the verified product record, artisan biography, and cluster origin.
            </p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)', backgroundColor: 'var(--surface-container-high)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
              Record Ref: {product.id}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCodeView product={product} size={160} showActions={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

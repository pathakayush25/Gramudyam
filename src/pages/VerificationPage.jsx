import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { productService } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { QRCodeView } from '../components/QRCodeView';
import {
  getProductTrustTagUrl,
  formatTrustTagId,
  formatCurrency,
  copyTrustTagUrl
} from '../utils/trustTag';
import confetti from 'canvas-confetti';

const DEFAULT_ARTISAN_AVATAR =
  'https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK';

const DEFAULT_PRODUCT_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F';

export const VerificationPage = () => {
  // Support either :productId or :id from route
  const params = useParams();
  const searchKey = params.productId || params.id;
  const { lang } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'not_found' | 'unpublished' | 'network_error' | null
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrustTagProduct() {
      if (!searchKey) {
        if (isMounted) {
          setErrorType('not_found');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setErrorType(null);

      try {
        // 1. First attempt: Query Supabase public.products directly by UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchKey);

        let dbProduct = null;
        let dbError = null;

        if (isUuid) {
          const res = await supabase
            .from('products')
            .select('*, profiles(full_name, avatar_url)')
            .eq('id', searchKey)
            .maybeSingle();

          dbProduct = res.data;
          dbError = res.error;
        }

        // If not found by direct UUID, search Supabase by matching ID or name if needed
        if (!dbProduct && !isUuid) {
          // Check if it's in the local catalog / mockProducts first
          const localMatch = productService.getById(searchKey);
          if (localMatch) {
            dbProduct = localMatch;
          }
        }

        if (!isMounted) return;

        if (dbError) {
          console.error('Error fetching product record from Supabase:', dbError);
          // Fall back to local cache if available
          const cachedMatch = productService.getById(searchKey);
          if (cachedMatch) {
            dbProduct = cachedMatch;
          } else {
            setErrorType('network_error');
            setLoading(false);
            return;
          }
        }

        if (!dbProduct) {
          setErrorType('not_found');
          setProduct(null);
          setLoading(false);
          return;
        }

        // Check publication status: unpublished products must not be publicly visible
        const isPublished = dbProduct.is_available !== false && dbProduct.isPublished !== false;
        if (!isPublished) {
          setErrorType('unpublished');
          setProduct(dbProduct);
          setLoading(false);
          return;
        }

        // Normalize product record format
        const normalized = {
          id: dbProduct.id,
          name: dbProduct.name || 'Untitled Handcrafted Item',
          nameMr: dbProduct.nameMr || dbProduct.name,
          nameHi: dbProduct.nameHi || dbProduct.name,
          description: dbProduct.description || '',
          story: dbProduct.story || dbProduct.description || '',
          price: Number(dbProduct.price) || 0,
          category: dbProduct.category || 'Handicrafts & Tribal Art',
          craft: dbProduct.craft || dbProduct.category || 'Traditional Craft',
          village: dbProduct.village || dbProduct.artisan?.village || 'Palghar',
          district: dbProduct.district || dbProduct.artisan?.district || 'Palghar',
          state: 'Maharashtra',
          image: dbProduct.image_url || dbProduct.image || DEFAULT_PRODUCT_IMAGE,
          created_at: dbProduct.created_at,
          updated_at: dbProduct.updated_at,
          trustTagId: formatTrustTagId(dbProduct.id),
          artisan: {
            name:
              dbProduct.profiles?.full_name ||
              dbProduct.artisan?.name ||
              (dbProduct.village ? `Artisan of ${dbProduct.village}` : 'Master Artisan'),
            avatar: dbProduct.profiles?.avatar_url || dbProduct.artisan?.avatar || DEFAULT_ARTISAN_AVATAR,
            village: dbProduct.village || dbProduct.artisan?.village || 'Palghar',
            district: dbProduct.district || dbProduct.artisan?.district || 'Palghar',
            state: 'Maharashtra',
            shgName: dbProduct.artisan?.shgName || (dbProduct.village ? `${dbProduct.village} Craft Collective` : 'Rural Craft Collective')
          }
        };

        setProduct(normalized);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error loading Trust Tag product:', err);
        if (isMounted) {
          setErrorType('network_error');
          setLoading(false);
        }
      }
    }

    fetchTrustTagProduct();

    return () => {
      isMounted = false;
    };
  }, [searchKey]);

  const handleShare = async () => {
    if (!product?.id) return;
    const url = getProductTrustTagUrl(product.id);

    if (navigator?.share) {
      try {
        await navigator.share({
          title: `${product.name} — Gramudyam Trust Tag`,
          text: `Verified craft provenance for ${product.name} on Gramudyam.`,
          url: url
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Navigator share error, falling back to copy:', err);
        }
      }
    }

    const copied = await copyTrustTagUrl(product.id);
    if (copied) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Format date helper
  const formatRecordDate = (dateString) => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  // =========================================================================
  // 1. LOADING SKELETON STATE
  // =========================================================================
  if (loading) {
    return (
      <div className="content-top-spacer container" style={{ padding: '4rem 1rem', maxWidth: '860px' }}>
        <div
          className="card-base"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div
            className="pulse-dot"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--primary)',
              margin: '0 auto 1.5rem auto',
              borderRadius: '50%'
            }}
          />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Retrieving Gramudyam Trust Tag Record...
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            Connecting to Gramudyam artisan database to verify product provenance.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ERROR & EDGE CASES (NOT FOUND, UNPUBLISHED, NETWORK ERROR)
  // =========================================================================
  if (errorType || !product) {
    return (
      <div className="content-top-spacer container" style={{ padding: '4rem 1rem', maxWidth: '720px' }}>
        <div
          className="card-base"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor:
                errorType === 'unpublished'
                  ? 'var(--warning-container)'
                  : errorType === 'network_error'
                  ? 'var(--surface-container-high)'
                  : 'var(--error-container)',
              color:
                errorType === 'unpublished'
                  ? 'var(--warning)'
                  : errorType === 'network_error'
                  ? 'var(--primary)'
                  : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '38px' }}>
              {errorType === 'unpublished'
                ? 'visibility_off'
                : errorType === 'network_error'
                ? 'wifi_off'
                : 'search_off'}
            </span>
          </div>

          <div
            className="badge-pill"
            style={{
              backgroundColor: 'var(--surface-container-high)',
              color: 'var(--outline)',
              marginBottom: '1rem',
              display: 'inline-flex'
            }}
          >
            Gramudyam Trust Tag Verification
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              color: 'var(--primary)',
              marginBottom: '0.75rem'
            }}
          >
            {errorType === 'unpublished'
              ? 'Product Record Is Currently Unpublished'
              : errorType === 'network_error'
              ? 'Could Not Connect to Database'
              : 'Product Record Not Found'}
          </h1>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--on-surface-variant)',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 auto 1.75rem auto'
            }}
          >
            {errorType === 'unpublished'
              ? 'This craft is currently in draft or has been unpublished by the artisan. Its public provenance profile is inactive.'
              : errorType === 'network_error'
              ? 'A network issue prevented verifying this record. Please check your internet connection and try refreshing.'
              : `No active product record was found in Gramudyam matching reference ID "${searchKey}". The item may have been removed or the QR code was corrupted.`}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/marketplace" className="btn-primary" style={{ textDecoration: 'none' }}>
              <span className="material-symbols-outlined">storefront</span>
              <span>Browse Authentic Marketplace</span>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-cream"
              type="button"
            >
              <span className="material-symbols-outlined">refresh</span>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. SUCCESSFUL PRODUCT PROVENANCE RECORD VIEW
  // =========================================================================
  const localizedTitle =
    lang === 'mr' && product.nameMr ? product.nameMr : lang === 'hi' && product.nameHi ? product.nameHi : product.name;

  const craftStoryText =
    (product.story && product.story.trim().length > 0)
      ? product.story.trim()
      : (product.description && product.description.trim().length > 0)
      ? product.description.trim()
      : null;

  const recordDate = formatRecordDate(product.updated_at || product.created_at);

  return (
    <div className="content-top-spacer trust-tag-page-wrapper" style={{ width: '100%', paddingBottom: '5rem' }}>
      {/* ================= SOVEREIGN TRUST HEADER BANNER ================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 60%, var(--tertiary) 100%)',
          color: 'white',
          padding: '2.5rem 0',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '0.75rem'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: 'var(--primary-fixed)',
                    fontSize: '18px',
                    fontVariationSettings: "'FILL' 1"
                  }}
                >
                  verified
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--primary-fixed)',
                    fontWeight: '700'
                  }}
                >
                  Product record found in Gramudyam
                </span>
              </div>

              <h1 className="headline-lg" style={{ color: 'white', marginBottom: '0.35rem' }}>
                Gramudyam Trust Tag
              </h1>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: 'var(--primary-fixed-dim)',
                  fontSize: '1.05rem'
                }}
              >
                सत्यता व मूळ स्थान नोंदणी • Authentic Product & Artisan Record
              </div>
            </div>

            {/* Right Summary Badge */}
            <div
              style={{
                backgroundColor: 'rgba(255, 249, 235, 0.1)',
                backdropFilter: 'blur(8px)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-fixed)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  qr_code_2
                </span>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                  {product.trustTagId}
                </span>
              </div>
              {recordDate && (
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-fixed-dim)' }}>
                  Record updated: {recordDate}
                </div>
              )}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--secondary-fixed)',
                  marginTop: '2px'
                }}
              >
                <span className="pulse-dot" style={{ backgroundColor: 'var(--secondary-container)' }} />
                <span>Live Database Record Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN VERIFICATION CONTENT ================= */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2.5rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column (7 cols): Product Visuals, Artisan & Craft Narrative */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
            className="cert-left-col"
          >
            {/* Primary Product Card */}
            <div
              className="card-base"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-container-high)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />

                {/* Overlaid Location Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(255,249,235,0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '18px' }}>
                    location_on
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {product.village ? `${product.village}, ` : ''}
                    {product.district || 'Palghar'} ({product.state})
                  </span>
                </div>

                {/* Overlaid Craft Category Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    palette
                  </span>
                  <span>{product.craft}</span>
                </div>

                {/* Bottom Overlay Title & Price */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    background: 'linear-gradient(to top, rgba(7, 56, 39, 0.95) 0%, transparent 100%)',
                    padding: '1.5rem',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--secondary-fixed)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {product.category}
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.65rem',
                        color: 'white',
                        marginTop: '2px'
                      }}
                    >
                      {localizedTitle}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-fixed-dim)', textTransform: 'uppercase' }}>
                      Maker Selling Price
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary-fixed)' }}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Specifications Grid */}
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--surface-container-lowest)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase' }}>
                    Craft Classification
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--primary)', marginTop: '2px' }}>
                    {product.craft}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase' }}>
                    Place of Origin
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--primary)', marginTop: '2px' }}>
                    {product.village ? `${product.village}, ` : ''}{product.district}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase' }}>
                    Provenance Reference
                  </div>
                  <div style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--secondary)', marginTop: '2px' }}>
                    {product.trustTagId}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase' }}>
                    Database Record
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--success)', marginTop: '2px' }}>
                    Verified Stored ✓
                  </div>
                </div>
              </div>
            </div>

            {/* ================= THE STORY BEHIND THIS CRAFT ================= */}
            <div
              className="card-base"
              style={{
                padding: '2rem',
                backgroundColor: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                className="badge-pill badge-primary"
                style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  auto_stories
                </span>
                <span>The Story Behind This Craft • कारागीर वारसा कथा</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  color: 'var(--primary)',
                  marginBottom: '1rem'
                }}
              >
                Traditional Creation Process & Heritage
              </h3>

              {craftStoryText ? (
                <div
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--on-surface)',
                    lineHeight: 1.75,
                    fontStyle: 'normal'
                  }}
                >
                  <p style={{ margin: 0 }}>{craftStoryText}</p>
                </div>
              ) : (
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--on-surface-variant)',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    border: '1px dashed var(--border-subtle)'
                  }}
                >
                  This artisan's story has not been added yet. Gramudyam works continuously with our village clusters to record traditional narratives and creation techniques.
                </div>
              )}
            </div>

            {/* ================= MEET THE ARTISAN ================= */}
            <div
              className="card-base"
              style={{
                padding: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                alignItems: 'center',
                backgroundColor: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={product.artisan?.avatar}
                alt={product.artisan?.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ARTISAN_AVATAR;
                }}
              />

              <div style={{ flex: '1 1 240px' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    letterSpacing: '0.04em'
                  }}
                >
                  Meet the Artisan • कारागीर परिचय
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    color: 'var(--primary)',
                    marginTop: '2px',
                    marginBottom: '4px'
                  }}
                >
                  {product.artisan?.name}
                </h3>

                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                  {product.artisan?.shgName || `${product.artisan?.village || 'Rural'} Craft Collective`}
                </div>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--outline)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '6px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    location_on
                  </span>
                  <span>
                    {product.artisan?.village}, {product.artisan?.district} ({product.artisan?.state})
                  </span>
                </div>
              </div>

              {/* Direct Producer Remittance Transparency */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-container-low)',
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-fixed)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                    Fair Value Remittance to Artisan
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                    When purchased on Gramudyam, proceeds go directly to the rural maker without exploitative middleman cuts.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Sovereign Seal & Certificate Actions */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
            className="cert-right-col"
          >
            {/* Authenticity Seal Card */}
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
              {/* Emblem */}
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface)',
                  border: '3px solid var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <img
                  src="/logo.png"
                  alt="Gramudyam Emblem"
                  style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '50%' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.svg';
                  }}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: 'var(--primary)',
                    marginBottom: '4px'
                  }}
                >
                  Gramudyam Trust Tag
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '700'
                  }}
                >
                  Rural Artisan Provenance Register
                </span>
              </div>

              {/* Status checklist */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textAlign: 'left',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '1rem 0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--outline)' }}>Platform Record:</span>
                  <span style={{ fontWeight: '700', color: 'var(--success)' }}>FOUND IN GRAMUDYAM ✓</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--outline)' }}>Origin Region:</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    {product.village ? `${product.village}, ` : ''}{product.district}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--outline)' }}>Reference Code:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--secondary)' }}>
                    {product.trustTagId}
                  </span>
                </div>

                {recordDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--outline)' }}>Record Date:</span>
                    <span style={{ fontWeight: '600', color: 'var(--on-surface)' }}>{recordDate}</span>
                  </div>
                )}
              </div>

              {/* Notice regarding provenance */}
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--on-surface-variant)',
                  backgroundColor: 'var(--surface-container-low)',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: 1.45,
                  textAlign: 'left',
                  borderLeft: '3px solid var(--primary)'
                }}
              >
                <strong>Provenance Guarantee:</strong> The information displayed on this page is retrieved directly from the product record published by the maker on the Gramudyam platform.
              </div>

              {/* Interactive QR Code Preview */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <QRCodeView product={product} size={150} showActions={false} showDetails={false} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                {/* Marketplace Link */}
                <Link
                  to={`/product/${product.id}`}
                  className="btn-primary"
                  style={{ width: '100%', height: '44px', textDecoration: 'none', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span>View in Marketplace ({formatCurrency(product.price)})</span>
                </Link>

                {/* Print Tag */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-cream"
                  style={{ width: '100%', height: '44px', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined">print</span>
                  <span>Print Packaging Seal</span>
                </button>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="btn-cream"
                  style={{
                    width: '100%',
                    height: '44px',
                    justifyContent: 'center',
                    color: shareSuccess ? 'var(--success)' : 'inherit'
                  }}
                >
                  <span className="material-symbols-outlined">
                    {shareSuccess ? 'check' : 'share'}
                  </span>
                  <span>{shareSuccess ? 'Link Copied to Clipboard!' : 'Share Trust Tag'}</span>
                </button>

                {/* Celebrate */}
                <button
                  type="button"
                  onClick={handleCelebration}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    celebration
                  </span>
                  <span>Celebrate Artisan Craft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .cert-left-col {
            grid-column: span 7 !important;
          }
          .cert-right-col {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VerificationPage;

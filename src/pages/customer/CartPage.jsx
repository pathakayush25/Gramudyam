import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CartPage = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCost,
    fairTradeDonation,
    setFairTradeDonation,
    total
  } = useCart();

  const { t } = useLanguage();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="content-top-spacer container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div className="card-cream" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '54px', color: 'var(--outline)' }}>
            shopping_bag
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary)', margin: '1rem 0 0.5rem' }}>
            {t('customer.emptyCartTitle', 'Your Shopping Cart is Empty')}
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {t('customer.emptyCartSubtitle', 'Explore authentic handlooms, tribal paintings, pottery, and forest foods directly from verified Maharashtra artisans.')}
          </p>
          <Link to="/marketplace" className="btn-secondary btn-lg">
            <span>{t('customer.continueShopping', 'Explore Marketplace')}</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shopping_bag</span>
            <span>Ethical Fair-Trade Cart</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            Products are packaged and dispatched directly from rural artisan studios with verified QR TrustTags.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Left: Cart Items List (8 cols) */}
          <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="cart-left">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-base"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  alignItems: 'center',
                  backgroundColor: 'var(--surface-container-lowest)'
                }}
              >
                {/* Image */}
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--surface-container-high)', flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '600', marginBottom: '2px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                    <span>{item.artisan} • {item.cluster}</span>
                  </div>

                  <Link to={`/product/${item.productId || item.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--primary)', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                      {item.name}
                    </h3>
                  </Link>

                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                    TrustTag: <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{item.trustTagId || 'GM-TRUST-0001'}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-container-high)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}
                  >
                    -
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}
                  >
                    +
                  </button>
                </div>

                {/* Price & Remove */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary Card (4 cols) */}
          <div style={{ gridColumn: 'span 12' }} className="cart-right">
            <div
              className="card-base"
              style={{
                padding: '1.75rem',
                backgroundColor: 'var(--surface-container-lowest)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                {t('customer.orderSummary', 'Order Summary')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>{t('customer.subtotal', 'Subtotal')}</span>
                  <span style={{ fontWeight: '600' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>{t('customer.freeShipping', 'SpeedPost Rural Delivery')}</span>
                  <span style={{ fontWeight: '600', color: shippingCost === 0 ? 'var(--success)' : 'inherit' }}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>

                {/* Fair Trade Voluntary SHG Contribution */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.8rem' }}>
                      Village Women SHG Fund:
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                      ₹{fairTradeDonation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFairTradeDonation(amt)}
                        style={{
                          flex: 1,
                          padding: '4px',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: fairTradeDonation === amt ? '1px solid var(--secondary)' : '1px solid var(--border-subtle)',
                          backgroundColor: fairTradeDonation === amt ? 'var(--secondary-fixed)' : 'var(--surface-container)',
                          color: fairTradeDonation === amt ? 'var(--on-secondary-fixed)' : 'var(--on-surface)'
                        }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('customer.totalAmount', 'Total Amount')}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', height: '50px' }}
              >
                <span>{t('customer.proceedToCheckout', 'Proceed to Secure Checkout')}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {/* Remittance Guarantee Notice */}
              <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                  shield
                </span>
                <span>
                  Over <strong>86%</strong> of this purchase goes directly to the village artisans' SBI bank account.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .cart-left {
            grid-column: span 8 !important;
          }
          .cart-right {
            grid-column: span 4 !important;
          }
        }
      `}</style>
    </div>
  );
};

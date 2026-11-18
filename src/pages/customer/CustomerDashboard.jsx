import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { lang, t } = useLanguage();

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Profile Welcome Header */}
        <div
          className="card-cream"
          style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '700'
              }}
            >
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="badge-pill badge-primary" style={{ marginBottom: '4px' }}>
                {t('getStarted.patronBadge', 'Rural Craft Patron • ग्रामीण कला संरक्षक')}
              </div>
              <h1 className="headline-md" style={{ color: 'var(--primary)', marginBottom: '2px' }}>
                {user?.name || 'Ananya Sharma'}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                {user?.email || 'ananya.sharma@patron.in'} • Pune, Maharashtra
              </div>
            </div>
          </div>

          {/* Direct Impact Badge */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--secondary)' }}>
              12 {lang === 'mr' ? 'कुटुंबे' : lang === 'hi' ? 'परिवार' : 'Families'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontWeight: '600' }}>
              {t('auth.ruralMakersConnected', 'Direct Artisan Livelihoods Supported')}
            </div>
          </div>
        </div>

        {/* Orders History List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="headline-sm" style={{ color: 'var(--primary)' }}>
              {t('customer.myOrdersTitle', 'Recent Orders & Provenance')}
            </h2>
            <Link to="/marketplace" className="btn-secondary btn-sm">
              {t('customer.continueShopping', 'Discover More Crafts')}
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((o) => (
              <div
                key={o.id}
                className="card-base"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {t('customer.orderId', 'Order')} #{o.id}
                    </span>
                    <span
                      className="badge-pill"
                      style={{
                        backgroundColor: o.status === 'Delivered' ? 'var(--success-container)' : 'var(--secondary-fixed)',
                        color: o.status === 'Delivered' ? 'var(--success)' : 'var(--on-secondary-fixed)',
                        fontSize: '0.75rem'
                      }}
                    >
                      {o.status === 'Delivered' ? t('customer.statusDelivered', 'Delivered') : o.status === 'Processing' ? t('customer.statusProcessing', 'Processing') : o.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--outline)' }}>
                    {t('customer.orderDate', 'Date')}: {o.date} • {o.items?.length} item(s) • {t('customer.total', 'Total')}: ₹{o.total?.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to={`/orders`} className="btn-primary btn-sm">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span>
                    <span>{t('customer.trackOrder', 'Track Shipment')}</span>
                  </Link>
                  {o.items?.[0] && (
                    <Link to={`/verify/${o.items[0].trustTagId || o.items[0].productId}`} className="btn-cream btn-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                      <span>{t('customer.viewTrustTagCertificate', 'QR Certificate')}</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useParams } from 'react-router-dom';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const { orders } = useOrders();
  const { lang, t } = useLanguage();

  // Selected order or first order
  const [selectedOrderId, setSelectedOrderId] = useState(id || orders[0]?.id || 'ORD-9481');
  const activeOrder = orders.find((o) => o.id === selectedOrderId || o.trackingNumber === selectedOrderId) || orders[0];

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>local_shipping</span>
            <span>{t('customer.trackLiveDelivery', 'Live Parcel Tracking')} • महाराष्ट्र ग्रामीण पोस्ट</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('customer.trackOrder', 'Track Your Artisanal Parcel')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('customer.packagingNote', 'Real-time milestone tracking directly from village handloom and pottery collectives to your doorstep.')}
          </p>
        </div>

        {/* Order Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: o.id === activeOrder?.id ? '700' : '500',
                backgroundColor: o.id === activeOrder?.id ? 'var(--primary)' : 'var(--surface-container)',
                color: o.id === activeOrder?.id ? 'white' : 'var(--on-surface)',
                border: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap'
              }}
            >
              {t('customer.orderId', 'Order')} #{o.id} ({o.status === 'Delivered' ? t('customer.statusDelivered', 'Delivered') : o.status === 'Processing' ? t('customer.statusProcessing', 'Processing') : o.status})
            </button>
          ))}
        </div>

        {activeOrder ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
            {/* Left: Stepper Timeline & Courier Card (7 cols) */}
            <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="track-left">
              {/* Courier Status Card */}
              <div
                className="card-base"
                style={{
                  padding: '1.75rem',
                  backgroundColor: 'var(--surface-container-lowest)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Carrier & Tracking Waybill
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: '700', color: 'var(--primary)', marginTop: '2px' }}>
                    {activeOrder.courier || 'India Post Rural SpeedPost'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '700', marginTop: '4px' }}>
                    Waybill: {activeOrder.trackingNumber}
                  </div>
                </div>

                <div
                  className="badge-pill"
                  style={{
                    backgroundColor: activeOrder.status === 'Delivered' ? 'var(--success-container)' : 'var(--secondary-fixed)',
                    color: activeOrder.status === 'Delivered' ? 'var(--success)' : 'var(--on-secondary-fixed)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {activeOrder.status === 'Delivered' ? 'check_circle' : 'hourglass_top'}
                  </span>
                  <span>{activeOrder.status}</span>
                </div>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="card-cream" style={{ padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  Shipment Journey
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
                  {activeOrder.trackingSteps?.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                      {/* Step Indicator Dot */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: step.completed ? 'var(--primary)' : 'var(--surface-container-high)',
                          color: step.completed ? 'white' : 'var(--outline)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: step.completed ? 'var(--shadow-sm)' : 'none',
                          zIndex: 1
                        }}
                      >
                        {step.completed ? (
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                        ) : (
                          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: step.completed ? 'var(--primary)' : 'var(--outline)' }}>
                            {step.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{step.date}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                          {step.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Items & Address (5 cols) */}
            <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="track-right">
              {/* Product Items in Parcel */}
              <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Items in Parcel ({activeOrder.items?.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeOrder.items?.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={it.image} alt={it.name} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                          {it.name}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                          {it.artisan || 'Artisan Direct'}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', marginTop: '2px' }}>
                          Qty: {it.quantity} • ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--primary)' }}>
                  <span>Total Paid:</span>
                  <span>₹{activeOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Delivery Destination
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{activeOrder.shippingAddress?.fullName}</div>
                  <div>{activeOrder.shippingAddress?.street}</div>
                  <div>{activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} - {activeOrder.shippingAddress?.pincode}</div>
                  <div style={{ marginTop: '4px' }}>Phone: {activeOrder.phone}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .track-left {
            grid-column: span 7 !important;
          }
          .track-right {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </div>
  );
};

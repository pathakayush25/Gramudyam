import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';

export const Logistics = () => {
  const { orders } = useOrders();
  const { lang, t } = useLanguage();
  const [pickupRequested, setPickupRequested] = useState(false);

  const handleRequestPickup = () => {
    setPickupRequested(true);
    setTimeout(() => {
      setPickupRequested(false);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>route</span>
            <span>{t('navigation.logistics', 'Logistics')} • महाराष्ट्र ग्रामीण पोस्ट</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('navigation.logistics', 'Logistics & Carrier Network')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('landing.pillarsSubtitle', 'Integrated with India Post Rural SpeedPost and Delhivery Rural Network for village doorstep pickups.')}
          </p>
        </div>

        <button onClick={handleRequestPickup} className="btn-secondary">
          <span className="material-symbols-outlined">local_shipping</span>
          <span>{t('customer.trackOrder', 'Request Village Pickup')}</span>
        </button>
      </div>

      {pickupRequested && (
        <div style={{ backgroundColor: 'var(--success-container)', color: 'var(--success)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
          <span className="material-symbols-outlined">check_circle</span>
          <span>Postal Carrier Van scheduled for pickup today at 4:30 PM from Ganjad / Dahanu SHG Centre!</span>
        </div>
      )}

      {/* 3 Logistics Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined">schedule</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Next Postal Van</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
            Today, 04:30 PM
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            India Post Dahanu Sub-Post Office
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined">local_shipping</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Parcels in Transit</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
            8 Active Shipments
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            En route to Pune, Mumbai & Nashik
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined">verified</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Damage-Free Delivery</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
            99.4%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Muslin wrap & straw cushion packaging
          </div>
        </div>
      </div>

      {/* Active Shipments Tracking Table */}
      <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>
          Outgoing Consignments & Tracking
        </h3>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Waybill / Consignment #</th>
                <th>Destination</th>
                <th>Carrier</th>
                <th>Status</th>
                <th>Expected Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--secondary)' }}>
                    {o.trackingNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{o.shippingAddress?.city}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{o.shippingAddress?.fullName}</div>
                  </td>
                  <td>{o.courier}</td>
                  <td>
                    <span
                      className="badge-pill"
                      style={{
                        backgroundColor: o.status === 'Delivered' ? 'var(--success-container)' : 'var(--info-container)',
                        color: o.status === 'Delivered' ? 'var(--success)' : 'var(--info)',
                        fontSize: '0.75rem'
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                    {o.status === 'Delivered' ? 'Delivered' : 'Within 48 hours'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

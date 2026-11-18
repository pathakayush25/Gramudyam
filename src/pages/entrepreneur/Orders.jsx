import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';

export const Orders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { lang, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            {t('entrepreneur.ordersTitle', 'Fulfillment Center')}
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('entrepreneur.ordersTitle', 'Customer Orders')} ({orders.length})
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('customer.packagingNote', 'Manage parcel packaging, QR TrustTag affixation, and carrier handovers for nationwide delivery.')}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: statusFilter === st ? '700' : '500',
                backgroundColor: statusFilter === st ? 'var(--primary)' : 'var(--surface-container)',
                color: statusFilter === st ? 'white' : 'var(--on-surface-variant)',
                border: '1px solid var(--border-subtle)',
                textTransform: 'capitalize'
              }}
            >
              {st === 'all' ? t('common.all', 'All Orders') : st === 'Processing' ? t('customer.statusProcessing', 'Processing') : st === 'Delivered' ? t('customer.statusDelivered', 'Delivered') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Craft Item</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Fulfillment Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>
                  #{order.id}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--outline)' }}>
                  {order.date}
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{order.customer}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--on-surface)' }}>
                    {order.items?.[0]?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                    Qty: {order.items?.[0]?.quantity || 1}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-serif)', fontWeight: '700', color: 'var(--primary)' }}>
                  ₹{order.total?.toLocaleString('en-IN')}
                </td>
                <td>
                  <span className="badge-pill badge-success" style={{ fontSize: '0.7rem' }}>
                    {order.paymentStatus || 'Paid (UPI)'}
                  </span>
                </td>
                <td>
                  <span
                    className="badge-pill"
                    style={{
                      backgroundColor: order.status === 'Delivered' ? 'var(--success-container)' : order.status === 'Shipped' ? 'var(--info-container)' : 'var(--secondary-fixed)',
                      color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Shipped' ? 'var(--info)' : 'var(--on-secondary-fixed)',
                      fontSize: '0.75rem'
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Shipped')}
                        className="btn-secondary btn-sm"
                      >
                        Dispatch Shipped
                      </button>
                    )}
                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="btn-primary btn-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="btn-cream btn-sm"
                      title="View Address & Details"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              backgroundColor: 'var(--surface-container-lowest)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                Order #{selectedOrderDetails.id} Details
              </h3>
              <button onClick={() => setSelectedOrderDetails(null)} style={{ color: 'var(--outline)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <strong>Shipping Address:</strong>
                <div>{selectedOrderDetails.shippingAddress?.fullName}</div>
                <div>{selectedOrderDetails.shippingAddress?.street}</div>
                <div>{selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} - {selectedOrderDetails.shippingAddress?.pincode}</div>
                <div>Phone: {selectedOrderDetails.phone}</div>
              </div>

              <div>
                <strong>Assigned Carrier:</strong> {selectedOrderDetails.courier}
                <div style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>
                  Tracking Waybill: {selectedOrderDetails.trackingNumber}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

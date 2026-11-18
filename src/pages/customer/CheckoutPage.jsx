import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';

export const CheckoutPage = () => {
  const { items, subtotal, shippingCost, fairTradeDonation, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Ananya Sharma',
    phone: user?.phone || '+91 98230 45678',
    email: user?.email || 'ananya.sharma@patron.in',
    street: 'Flat 402, Rohan Viti, Baner Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiApp, setUpiApp] = useState('gpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = placeOrder({
        customer: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        shippingAddress,
        items: [...items],
        subtotal,
        shippingCost,
        fairTradeDonation,
        total,
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
      });

      clearCart();
      setIsSubmitting(false);
      setOrderComplete(newOrder);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  if (orderComplete) {
    return (
      <div className="content-top-spacer container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div
          className="card-base"
          style={{
            maxWidth: '640px',
            width: '100%',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-container)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>check_circle</span>
          </div>

          <h1 className="headline-lg" style={{ color: 'var(--primary)', lineHeight: 1.2 }}>
            {t('customer.orderPlacedSuccess', 'Order Placed Successfully!')}
          </h1>
          <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '700' }}>
            {t('customer.orderId', 'Order ID')}: {orderComplete.id} • {t('customer.trackingNo', 'Tracking')}: {orderComplete.trackingNumber}
          </div>

          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', maxWidth: '440px' }}>
            {t('customer.orderThanksMessage', { amount: orderComplete.total?.toLocaleString('en-IN') })}
          </p>

          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-container)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              {t('customer.dispatchStatus', 'Dispatch Status:')}
            </div>
            <div style={{ color: 'var(--on-surface)' }}>
              {t('customer.carrier', 'Carrier')}: <strong>{orderComplete.courier}</strong>
            </div>
            <div style={{ color: 'var(--on-surface-variant)', marginTop: '2px' }}>
              {t('customer.packagingNote', 'Village artisan studio packaging with QR TrustTag certification label.')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
            <Link to="/orders" className="btn-primary" style={{ flex: '1 1 180px' }}>
              <span className="material-symbols-outlined">local_shipping</span>
              <span>{t('customer.trackLiveDelivery', 'Track Live Delivery')}</span>
            </Link>
            <Link to="/marketplace" className="btn-cream" style={{ flex: '1 1 180px' }}>
              <span>{t('customer.continueShopping', 'Continue Shopping')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
            <span>{t('customer.secureCheckoutBadge', 'Secure Fair-Trade Checkout')}</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('customer.completeYourOrder', 'Complete Your Order')}
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
            {/* Left: Shipping & Payment (7 cols) */}
            <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="checkout-left">
              {/* Step 1: Shipping Address */}
              <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>local_shipping</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    {t('customer.deliveryAddressStep', '1. Delivery Address')}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label-field">{t('customer.fullName', 'Full Name')} *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-field">{t('customer.phoneRequired', 'Phone Number *')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        className="input-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">{t('customer.streetAndLandmark', 'Street Address & Landmark *')}</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className="input-base"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label className="label-field">{t('customer.city', 'City *')}</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-field">{t('customer.state', 'State *')}</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-field">{t('customer.pincode', 'Pincode *')}</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleAddressChange}
                        className="input-base"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>payment</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    {t('customer.paymentMethodStep', '2. Payment Method')}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: paymentMethod === 'upi' ? 'var(--surface-container-low)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>qr_code</span>
                    <div style={{ flex: 1 }}>
                      <strong>{t('customer.instantUpi', 'Instant UPI / QR (Google Pay, PhonePe, Paytm, BHIM)')}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        {t('customer.instantUpiDesc', 'Recommended • Zero transaction fee & instant deposit into artisan account')}
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: paymentMethod === 'card' ? 'var(--surface-container-low)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>credit_card</span>
                    <div style={{ flex: 1 }}>
                      <strong>{t('customer.cardsNetBanking', 'Credit / Debit Card / Net Banking')}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        {t('customer.cardsDesc', 'Visa, Mastercard, RuPay, Maestro')}
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: paymentMethod === 'cod' ? 'var(--surface-container-low)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>local_atm</span>
                    <div style={{ flex: 1 }}>
                      <strong>{t('customer.cod', 'Cash on Delivery (COD)')}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        {t('customer.codDesc', 'Pay when your SpeedPost parcel reaches your doorstep')}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sticky Box (5 cols) */}
            <div style={{ gridColumn: 'span 12' }} className="checkout-right">
              <div
                className="card-base"
                style={{
                  padding: '1.75rem',
                  backgroundColor: 'var(--surface-container-lowest)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'sticky',
                  top: '6rem'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {t('customer.reviewOrderCount', { count: items.length })}
                </h3>

                {/* Items Mini List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img src={it.image} alt={it.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {it.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                          {t('customer.itemQuantity', 'Qty')}: {it.quantity} × ₹{it.price}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>{t('customer.subtotal', 'Subtotal')}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>{t('customer.deliveryCost', 'Delivery')}</span>
                    <span style={{ color: shippingCost === 0 ? 'var(--success)' : 'inherit' }}>
                      {shippingCost === 0 ? t('customer.free', 'FREE') : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary)' }}>
                    <span>{t('customer.shgFund', 'SHG Community Fund')}</span>
                    <span>₹{fairTradeDonation}</span>
                  </div>
                  <div style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                    <span>{t('customer.total', 'Total')}</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', height: '52px' }}
                >
                  {isSubmitting ? (
                    <span>{t('customer.processingOrder', 'Processing Order...')}</span>
                  ) : (
                    <>
                      <span>{t('customer.confirmAndPlaceOrder', 'Confirm & Place Order')}</span>
                      <span className="material-symbols-outlined">verified</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .checkout-left {
            grid-column: span 7 !important;
          }
          .checkout-right {
            grid-column: span 5 !important;
          }
        }
      `}</style>
    </div>
  );
};

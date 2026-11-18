import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';
import { demoArtisan } from '../../data/mockData';

export const Dashboard = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { products } = useProducts();
  const { lang, t, getLocalizedField } = useLanguage();
  const navigate = useNavigate();

  const artisanData = user || demoArtisan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner & Artisan Identity */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge-pill badge-primary">
              Dahanu SHG Certified • {lang === 'mr' ? 'स्वावलंबी महिला गट' : lang === 'hi' ? 'स्वावलंबी महिला समूह' : 'Self-Reliant SHG'}
            </span>
            <span className="badge-pill badge-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
              {t('marketplace.giCertified', 'GI & Khadi Verified')}
            </span>
          </div>

          <h1 className="headline-lg" style={{ color: 'var(--primary)', lineHeight: 1.2 }}>
            {t('entrepreneur.welcomeGreeting', 'Namaste, {{name}}', { name: artisanData.name?.split(' ')[0] || 'Savita' })} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            {t('navigation.brandSubtitle', 'Here is what\'s happening with your rural craft enterprise today in Dahanu cluster, Palghar.')}
          </p>
        </div>

        {/* Live Status & Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              backgroundColor: 'var(--surface-container)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span className="pulse-dot" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
                E-Khata UPI Status
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                {t('verification.verifiedBadge', 'Linked to SBI SHG Account')}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/entrepreneur/voice-create', { state: { isNew: true } })}
            className="btn-primary"
            style={{ padding: '0.65rem 1.25rem', gap: '0.5rem' }}
          >
            <span className="material-symbols-outlined">mic</span>
            <span>{t('entrepreneur.voiceStudioBtn', 'Voice Product Creation')}</span>
          </button>
        </div>
      </div>

      {/* 4 Bento Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Metric 1: Total Sales */}
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-container)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                  {t('entrepreneur.totalEarnings', 'Total Sales')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{t('landing.metricEarningsLabel', 'Total Gross Sales')}</span>
              </div>
            </div>
            <span className="badge-pill badge-primary" style={{ fontSize: '0.68rem' }}>+18.4%</span>
          </div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
            ₹42,580
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>trending_up</span>
            <span>+₹6,620 {t('landing.liveOrdersToday', 'higher than last month')}</span>
          </div>
        </div>

        {/* Metric 2: Orders Received */}
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-container)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">local_mall</span>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                  {t('entrepreneur.ordersFulfilled', 'Orders Received')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{t('entrepreneur.ordersTitle', 'Orders')}</span>
              </div>
            </div>
            <span className="badge-pill badge-secondary" style={{ fontSize: '0.68rem' }}>8 to dispatch</span>
          </div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
            128
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>hourglass_top</span>
            <span>{t('product.dispatchWindow', 'Avg. fulfillment')}: 2.1 days</span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-container)', color: 'var(--tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                  {t('entrepreneur.activeListings', 'Active Products')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{t('entrepreneur.myProductsTitle', 'Catalog Live')}</span>
              </div>
            </div>
            <span className="badge-pill badge-primary" style={{ fontSize: '0.68rem' }}>{t('verification.verifiedBadge', 'All Verified')}</span>
          </div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
            {products.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--success)' }}>verified</span>
            <span>{t('entrepreneur.avgQualityScore', 'Average AI Quality Score')}: 94%</span>
          </div>
        </div>

        {/* Metric 4: Direct Remittance */}
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-container)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                  {t('verification.directRemittance', 'Direct Remittance')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{t('product.artisanNetShare', 'Direct Margin')}</span>
              </div>
            </div>
            <span className="badge-pill badge-primary" style={{ fontSize: '0.68rem' }}>Aadhaar UPI</span>
          </div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
            86.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            {t('landing.metricLeakage', '0%')} {t('landing.metricLeakageLabel', 'middleman deduction on Gramudyam')}
          </div>
        </div>
      </div>

      {/* Recent Orders Management Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className="headline-sm" style={{ color: 'var(--primary)' }}>
              {t('entrepreneur.ordersTitle', 'Recent Orders To Fulfill')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
              {t('customer.packagingNote', 'Affix TrustTags and hand over to SpeedPost carrier pickup.')}
            </p>
          </div>
          <Link to="/entrepreneur/orders" className="btn-cream btn-sm">
            {t('common.seeAll', 'View All Orders →')}
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('customer.orderId', 'Order ID')}</th>
                <th>{t('admin.tableColCraft', 'Product & Customer')}</th>
                <th>{t('customer.total', 'Amount')}</th>
                <th>{t('customer.orderDate', 'Date')}</th>
                <th>{t('customer.orderStatus', 'Status')}</th>
                <th>{t('admin.tableColAction', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>
                    #{order.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{getLocalizedField(order.items?.[0], 'name') || order.items?.[0]?.name || 'Artisanal Craft'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                      {t('admin.tableColArtisan', 'Customer')}: {order.customer} ({order.shippingAddress?.city})
                    </div>
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    ₹{order.total?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--outline)' }}>
                    {order.date}
                  </td>
                  <td>
                    <span
                      className="badge-pill"
                      style={{
                        backgroundColor: order.status === 'Delivered' ? 'var(--success-container)' : order.status === 'Shipped' ? 'var(--info-container)' : 'var(--warning-container)',
                        color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Shipped' ? 'var(--info)' : 'var(--warning)'
                      }}
                    >
                      {order.status === 'Delivered' ? t('customer.statusDelivered', 'Delivered') : order.status === 'Processing' ? t('customer.statusProcessing', 'Processing') : order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Shipped')}
                        className="btn-secondary btn-sm"
                      >
                        {t('customer.statusDispatched', 'Mark Shipped')}
                      </button>
                    )}
                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="btn-primary btn-sm"
                      >
                        {t('customer.statusDelivered', 'Mark Delivered')}
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>
                        {t('verification.verifiedBadge', 'Completed ✓')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Quick Actions & Live TrustTag Generator Link */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Voice studio quick card */}
        <div className="card-cream" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="badge-pill badge-secondary" style={{ width: 'fit-content' }}>
            {t('entrepreneur.voiceStudioTitle', 'Gramin Voice Studio')}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>
            {t('entrepreneur.voiceStudioTitle', 'Have a new craft ready to list?')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
            {t('entrepreneur.voiceStudioDesc', 'Speak in Marathi or Hindi. Our rural AI will convert your voice into a product title, price, description, and e-commerce listing in 60 seconds.')}
          </p>
          <Link to="/entrepreneur/voice-create" state={{ isNew: true }} className="btn-primary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span className="material-symbols-outlined">mic</span>
            <span>{t('entrepreneur.voiceStudioBtn', 'Voice Product Creation')}</span>
          </Link>
        </div>

        {/* Quality Score & Branding */}
        <div className="card-cream" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="badge-pill badge-primary" style={{ width: 'fit-content' }}>
            {t('entrepreneur.brandingTitle', 'AI Branding & TrustTag')}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>
            {t('entrepreneur.trustTagTitle', 'Improve Visibility & Trust')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
            {t('entrepreneur.voiceStudioDesc', 'Run the AI Quality Score audit to verify compliance and generate catchy social media taglines or print QR packaging seals.')}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
            <Link to="/entrepreneur/quality-score" className="btn-cream btn-sm">
              {t('qualityScore', 'AI Quality Score')}
            </Link>
            <Link to="/entrepreneur/branding" className="btn-cream btn-sm">
              {t('brandingSuggestions', 'AI Branding')}
            </Link>
            <Link to="/entrepreneur/trusttag" className="btn-cream btn-sm">
              {t('trustTag', 'Print TrustTags')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

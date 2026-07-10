import { memo } from 'react';
import { motion } from 'framer-motion';
import { CONCESSION_OFFERS } from '../../../constants';

interface OrderItem {
  id: string;
  item: string;
  price: number;
  status: string;
}

interface ConcessionOffersProps {
  orders: OrderItem[];
  onOrder: (item: string, price: number) => void;
}

export const ConcessionOffers = memo(function ConcessionOffers({ orders, onOrder }: ConcessionOffersProps) {
  return (
    <motion.div
      key="offers"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      role="tabpanel"
      aria-label="Smart Concession Pre-orders Panel"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Personalized Concession Offers</h2>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Based on preferences</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} role="list" aria-label="Available concessions special combos">
        {CONCESSION_OFFERS.map((offer) => (
          <div key={offer.id} className="rec-card" role="listitem">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>🔥 {offer.discount}% DISCOUNT</span>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '2px 0 4px' }}>{offer.title}</h3>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>${offer.price.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              {offer.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ {offer.eta}</span>
              <button
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '11px' }}
                onClick={() => onOrder(offer.title, offer.price)}
                aria-label={`Pre-Order ${offer.title} for $${offer.price.toFixed(2)}`}
              >
                Pre-Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Active Digital Orders</h3>
          <div role="list" aria-label="Preordered tickets list">
            {orders.map((ord, idx) => (
              <div key={idx} role="listitem" style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '8px', marginBottom: '6px', fontSize: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{ord.item}</div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ticket ID: #{ord.id}</span>
                </div>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{ord.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
});

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Flag, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ReportModal = ({ isOpen, onClose, product }) => {
  const [reason, setReason] = useState('Inappropriate Content / Prohibited Item');
  const [details, setDetails] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Report submitted! Our safety team will review this listing within 2 hours.', 'success');
    setDetails('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Listing"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="report-form" className="btn btn-danger">
            <Flag size={16} /> Submit Report
          </button>
        </>
      }
    >
      <form id="report-form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          <AlertTriangle size={20} style={{ minWidth: '20px' }} />
          <span>Help keep CampusMart safe! Submitting a report alerts student campus moderators.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-control" value={product?.name || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Reason for Report</label>
          <select className="form-control" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="Inappropriate Content / Prohibited Item">Inappropriate Content / Prohibited Item</option>
            <option value="Fake / Counterfeit Product">Fake / Counterfeit Product</option>
            <option value="Misleading Price or Description">Misleading Price or Description</option>
            <option value="Suspected Fraud / Scam Seller">Suspected Fraud / Scam Seller</option>
            <option value="Sold Item Still Listed">Sold Item Still Listed</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Additional Details</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe the issue with this listing..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

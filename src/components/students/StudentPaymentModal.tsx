import React, { useState } from 'react';
import { StudentProfile, StudentPayment } from '../../types';
import { CreditCard, X, Check, AlertCircle } from 'lucide-react';

interface StudentPaymentModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  currency?: string;
  onClose: () => void;
  onAddPayment: (studentId: string, payment: Partial<StudentPayment>) => Promise<void>;
}

export const StudentPaymentModal: React.FC<StudentPaymentModalProps> = ({
  isOpen,
  student,
  currency = 'SAR',
  onClose,
  onAddPayment,
}) => {
  const [title, setTitle] = useState('Tuition Fee Installment');
  const [amount, setAmount] = useState<number>(1500);
  const [status, setStatus] = useState<'paid' | 'partial' | 'unpaid'>('paid');
  const [method, setMethod] = useState('Credit Card / Mada');
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Payment title is required');
      return;
    }
    if (amount <= 0) {
      setError('Payment amount must be greater than zero');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onAddPayment(student.id, {
        title,
        amount: Number(amount),
        currency,
        status,
        method,
        invoiceNumber,
        notes: notes.trim() || undefined,
        date: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record tuition payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="student-payment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="student-payment-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Record Tuition Payment</h3>
              <p className="text-xs text-slate-500">
                Log billing for {student.fullName} ({student.studentAdmissionNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Title / Description <span className="text-rose-500">*</span>
            </label>
            <input
              id="payment-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="e.g. Intensive B2 Term Tuition, IELTS Exam Prep Fee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ({currency}) <span className="text-rose-500">*</span>
              </label>
              <input
                id="payment-amount-input"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="payment-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="paid">Paid (Fully Collected)</option>
                <option value="partial">Partial Payment</option>
                <option value="unpaid">Unpaid / Invoiced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                id="payment-method-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Credit Card / Mada">Credit Card / Mada</option>
                <option value="Bank Wire / Transfer">Bank Wire / Transfer</option>
                <option value="Cash at Desk">Cash at Desk</option>
                <option value="Apple Pay / STC Pay">Apple Pay / STC Pay</option>
                <option value="Installment Plan (Tabby/Tamara)">Tabby / Tamara</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Number
              </label>
              <input
                id="payment-invoice-input"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Finance Notes (Optional)
            </label>
            <input
              id="payment-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Receipt #8899 issued by accountant"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              id="submit-payment-btn"
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              {submitting ? (
                <>Recording...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Payment Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

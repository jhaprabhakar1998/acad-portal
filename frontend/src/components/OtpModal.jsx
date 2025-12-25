import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button } from './ui';
import './OtpModal.css';

/**
 * OTP Modal Component
 * Handles OTP input and verification
 */
const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  rollNumber,
  mobileNumber,
  loading = false,
  error = '',
}) => {
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset OTP when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp('');
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  /**
   * Handle OTP verification
   */
  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      await onResend();
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      console.error('Resend OTP error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Please verify OTP for Login."
      showCloseButton={!loading}
    >
      <form className="otp-modal" onSubmit={handleVerify}>
        <div className="otp-modal__content">
          <label className="otp-modal__label">Enter OTP -</label>
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleOtpChange}
            error={error}
            disabled={loading}
            required
            autoFocus
            maxLength={6}
            className="otp-modal__input"
          />

          <div className="otp-modal__resend">
            <span className="otp-modal__resend-text">
              (If OTP not received Please{' '}
              <button
                type="button"
                className="otp-modal__resend-link"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendLoading
                  ? 'Sending...'
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'click here'}
              </button>
              )
            </span>
          </div>
        </div>

        <div className="otp-modal__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="otp-modal__cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || otp.length !== 6}
            className="otp-modal__verify"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

OtpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  rollNumber: PropTypes.string.isRequired,
  mobileNumber: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default OtpModal;


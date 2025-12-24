import React, { useState } from 'react';
import { Button, Input, Card } from '../components/ui';
import Logo from '../components/Logo';
import RadioGroup from '../components/RadioGroup';
import { studentApi } from '../services/api';
import { parsePhoneNumbers } from '../utils/htmlParser';
import './LoginPage.css';

/**
 * Login Page Component
 * Handles student/parent login with OTP flow
 */
const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [rollNumberSubmitted, setRollNumberSubmitted] = useState(false);

  /**
   * Handle roll number submission
   */
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!rollNumber.trim()) {
      setError('Please enter a roll number');
      setLoading(false);
      return;
    }

    try {
      const response = await studentApi.getMobileForOtp(rollNumber.trim());

      if (response.errcode === 0 && response.rtadioHtml) {
        const phones = parsePhoneNumbers(response.rtadioHtml);
        
        if (phones.length > 0) {
          setPhoneNumbers(phones);
          setSelectedPhone(phones.find(p => p.checked)?.value || phones[0].value);
          setRollNumberSubmitted(true);
        } else {
          setError('No phone numbers found for this roll number');
        }
      } else {
        setError(response.msg || 'Roll number not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle phone number selection
   */
  const handlePhoneChange = (e) => {
    setSelectedPhone(e.target.value);
  };

  /**
   * Handle OTP send
   */
  const handleSendOtp = () => {
    if (!selectedPhone) {
      setError('Please select a phone number');
      return;
    }

    // TODO: Implement OTP sending logic
    console.log('Sending OTP to:', selectedPhone);
    alert(`OTP will be sent to ${selectedPhone}`);
  };

  /**
   * Handle back to roll number input
   */
  const handleBack = () => {
    setRollNumberSubmitted(false);
    setPhoneNumbers([]);
    setSelectedPhone('');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-page__backdrop" />
      <div className="login-page__content">
        <Logo />

        <Card
          title={rollNumberSubmitted ? undefined : "Student/Parent's Login"}
          header={
            rollNumberSubmitted ? (
              <div className="card-header-custom">
                <button
                  type="button"
                  onClick={handleBack}
                  className="card-header__back"
                  aria-label="Back"
                >
                  ←
                </button>
                <div className="card-header__title">Student/Parent's Login</div>
              </div>
            ) : undefined
          }
        >
          {!rollNumberSubmitted ? (
            <form className="login-form" onSubmit={handleRequestOtp}>
              <Input
                label="Roll Number"
                placeholder="Enter roll number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                error={error}
                disabled={loading}
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Requesting...' : 'Request OTP'}
              </Button>
            </form>
          ) : (
            <div className="phone-selection">
              <div className="phone-selection__info">
                <p className="phone-selection__roll">
                  Roll Number: <strong>{rollNumber}</strong>
                </p>
                <p className="phone-selection__instruction">
                  Choose Mobile Number for OTP
                </p>
              </div>

              <RadioGroup
                name="selected_phone"
                options={phoneNumbers.map((phone) => ({
                  value: phone.value,
                  label: phone.masked,
                }))}
                value={selectedPhone}
                onChange={handlePhoneChange}
              />

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleSendOtp}
                className="phone-selection__button"
              >
                Send OTP
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;


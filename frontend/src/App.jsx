import React, { useState } from 'react';
import TextInput from './components/TextInput.jsx';
import PrimaryButton from './components/PrimaryButton.jsx';

const App = () => {
  const [roll, setRoll] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // OTP request placeholder
    alert(`Requesting OTP for roll: ${roll || 'N/A'}`);
  };

  return (
    <div className="page">
      <div className="page__backdrop" />
      <div className="page__content">
        <header className="logo">
          <div className="logo__mark">VMC</div>
          <div className="logo__text">
            <span className="logo__title">Vidyamandir Classes</span>
            <span className="logo__subtitle">Since 1986</span>
          </div>
        </header>

        <main className="card">
          <div className="card__header">
            <div className="card__label">Student/Parent&apos;s Login</div>
          </div>
          <form className="card__form" onSubmit={handleSubmit}>
            <TextInput
              label="Roll Number"
              placeholder="Enter roll number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />
            <PrimaryButton type="submit">Request OTP</PrimaryButton>
          </form>
        </main>
      </div>
    </div>
  );
};

export default App;



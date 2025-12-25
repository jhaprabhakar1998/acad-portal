import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import './StudentProfile.css';

/**
 * Student Profile Page
 * Placeholder page after successful login
 */
const StudentProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout (clear session)
    navigate('/');
  };

  return (
    <div className="student-profile-page">
      <div className="student-profile-page__backdrop" />
      <div className="student-profile-page__content">
        <Logo />
        <div className="student-profile-card">
          <h1>Welcome to Student Profile</h1>
          <p>You have successfully logged in!</p>
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;


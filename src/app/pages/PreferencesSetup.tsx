import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PreferencesModal } from '../components/PreferencesModal';
import { ThumbsUpAnimation } from '../components/ThumbsUpAnimation';

export function PreferencesSetup() {
  const [showAnimation, setShowAnimation] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handlePreferencesComplete = (preferences: string[]) => {
    updateUser({ preferences });
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    navigate('/feed');
  };

  return (
    <>
      {!showAnimation ? (
        <PreferencesModal onComplete={handlePreferencesComplete} />
      ) : (
        <ThumbsUpAnimation onComplete={handleAnimationComplete} />
      )}
    </>
  );
}

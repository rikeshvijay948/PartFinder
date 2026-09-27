import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/landing/HeroSection';
import { SearchPreviewCard } from '../components/landing/SearchPreviewCard';
import { StatsSection } from '../components/landing/StatsSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { CTASection } from '../components/landing/CTASection';
import { PartSearchResult } from '../types';

interface LandingPageProps {
  onOpenModal?: (type: string) => void;
  onReservePart?: (part: PartSearchResult) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenModal,
  onReservePart,
}) => {
  const navigate = useNavigate();

  const handleNavigateToSearch = () => {
    navigate('/find-part');
  };

  const handleListShop = () => {
    if (onOpenModal) {
      onOpenModal('list-shop');
    } else {
      navigate('/register?role=shop');
    }
  };

  const handleReserve = (part: PartSearchResult) => {
    if (onReservePart) {
      onReservePart(part);
    } else {
      navigate(`/reservation?partName=${encodeURIComponent(part.partName)}&shopName=${encodeURIComponent(part.shopName)}&price=${part.price}`);
    }
  };

  return (
    <main className="flex-1">
      {/* 1. Hero Section */}
      <HeroSection
        onFindPartClick={handleNavigateToSearch}
        onListShopClick={handleListShop}
      />

      {/* 2. Interactive Search Preview Card */}
      <SearchPreviewCard
        onReservePart={handleReserve}
      />

      {/* 3. Statistics Section */}
      <StatsSection />

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* 6. CTA Section */}
      <CTASection
        onFindPartClick={handleNavigateToSearch}
        onListShopClick={handleListShop}
      />
    </main>
  );
};


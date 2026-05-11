'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'demo-disclaimer-dismissed';

export default function DemoDisclaimerPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was already dismissed in this session
    const isDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClose();
    }
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed top-20 right-4 z-[60] max-w-sm bg-red-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg border border-red-500/30 p-3 text-sm"
      role="dialog"
      aria-labelledby="demo-disclaimer-title"
      aria-describedby="demo-disclaimer-description"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div id="demo-disclaimer-title" className="sr-only">
            Demo Disclaimer
          </div>
          <div id="demo-disclaimer-description" className="leading-relaxed">
            This site is an AI-generated demo to showcase the backend idea. The frontend may be slow or imperfect and bugs may exist. Hosted on free services so performance not guaranteed.
          </div>
        </div>
        <button
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-red-600"
          aria-label="Close demo disclaimer"
          tabIndex={0}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
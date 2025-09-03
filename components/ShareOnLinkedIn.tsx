"use client";
import { useMemo, useCallback, useState } from "react";

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
  onShareClick?: () => void;
  onCopyClick?: () => void;
};

export function ShareOnLinkedIn({ title, description, imageUrl, onShareClick, onCopyClick }: Props = {}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Build the *current* page URL on the client
  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://staituned.com";
    // Ensure we get the full URL including pathname
    const fullUrl = window.location.href;
    console.log('ShareOnLinkedIn - Current page URL:', fullUrl);
    return fullUrl;
  }, []);

  // Optional: add UTM for LinkedIn
  const urlWithUtm = useMemo(() => {
    const u = new URL(pageUrl);
    u.searchParams.set("utm_source", "linkedin");
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", "share_article");
    const finalUrl = u.toString();
    console.log('ShareOnLinkedIn - URL with UTM:', finalUrl);
    return finalUrl;
  }, [pageUrl]);

  // LinkedIn endpoint with article data
  const liUrl = useMemo(() => {
    // Use the classic shareArticle endpoint which works better across platforms
    // This is what Medium and other major sites use
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(urlWithUtm)}`;
    console.log('ShareOnLinkedIn - Final LinkedIn URL:', linkedinUrl);
    return linkedinUrl;
  }, [urlWithUtm]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setShowDropdown(false);
      if (onCopyClick) onCopyClick();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [pageUrl, onCopyClick]);

  const handleLinkedInShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're on mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileDevice) {
      // On mobile, just navigate to the LinkedIn share URL
      // This will open in the LinkedIn app if installed, or browser otherwise
      window.location.href = liUrl;
    } else {
      // Desktop behavior - use window.open with _blank instead of popup
      // This ensures better URL handling
      window.open(liUrl, '_blank');
    }
    
    setShowDropdown(false);
    if (onShareClick) onShareClick();
  }, [liUrl, onShareClick]);

  return (
    <div className="relative">
      {/* Main Share Button - More subtle design */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200"
        aria-label="Share article"
        title="Share article"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span className="text-sm">Share</span>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {/* Copy Link Option */}
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copySuccess ? "Copied!" : "Copy Link"}
            </button>

            {/* LinkedIn Share Option */}
            <button
              onClick={handleLinkedInShare}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5v-9h3v9zM6.5 8.71A1.75 1.75 0 1 1 6.5 5.21a1.75 1.75 0 0 1 0 3.5zM20 19h-3v-4.5c0-1.08-.02-2.47-1.5-2.47s-1.73 1.17-1.73 2.39V19h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56V19z"/>
              </svg>
              Share on LinkedIn
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

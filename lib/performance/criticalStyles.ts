// Critical CSS for immediate render - server-side safe
export const CRITICAL_CSS = `
  /* Critical styles for immediate render */
  .hero-section, .nav-header, .article-header {
    display: block;
    visibility: visible;
  }
  
  /* Prevent layout shift */
  .article-content img {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    background: #f3f4f6;
  }
  
  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* TOC specific critical styles */
  .toc-container {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
  
  .toc-item {
    transition: all 0.2s ease;
  }
  
  .toc-item.active {
    background-color: #f3f4f6;
    border-left: 3px solid #3b82f6;
  }
`

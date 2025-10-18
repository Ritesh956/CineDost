import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-logo">🎬</span>
            <span className="footer-text">CineDost</span>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-credit">
            <span className="made-by">Made with</span>
            <span className="heart">❤️</span>
            <span className="made-by">by</span>
            <span className="creator-name">Ritesh</span>
          </div>
        </div>
        
        <div className="footer-year">
          <span>© {currentYear} All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

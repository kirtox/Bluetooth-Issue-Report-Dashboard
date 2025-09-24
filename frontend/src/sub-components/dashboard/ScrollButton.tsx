import React from "react";

interface ScrollButtonProps {
  direction: "up" | "down";
  className?: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ direction, className }) => {
  const handleClick = () => {
    if (direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".scroll-section"));
      const scrollTop = window.scrollY;
      const nextSection = sections.find(section => section.offsetTop > scrollTop + 10);
      if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const svgPath = direction === "up" ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6";

  return (
    <button
      onClick={handleClick}
      className={`btn d-flex align-items-center justify-content-center text-white border-0 ${className}`}
      style={{
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        padding: 0,
        background: direction === "up" 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '20px',
        fontWeight: 'bold',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
      }}
      title={direction === "up" ? "Back to Top" : "Scroll Down"}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d={svgPath}/>
      </svg>
    </button>
  );
};

export default ScrollButton;

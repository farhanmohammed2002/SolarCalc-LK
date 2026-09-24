import React from 'react';

interface AIIconProps {
  className?: string;
  size?: number;
}

export const SolarCalcAiIcon: React.FC<AIIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="solarAiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="0.5" stopColor="#0284c7" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Central Solar Core */}
      <circle cx="12" cy="12" r="4.5" stroke="url(#solarAiGrad)" strokeWidth="1.8" fill="rgba(245, 158, 11, 0.15)" />
      
      {/* Micro PV Cell Grid Lines */}
      <line x1="9.5" y1="12" x2="14.5" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />

      {/* Radial Circuit Traces & Nodes (Solar Rays + PCB Traces) */}
      <path d="M12 2V5.5M12 18.5V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 12H5.5M18.5 12H22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      
      {/* Diagonal Circuit Lines with Terminal Logic Nodes */}
      <path d="M4.93 4.93L7.4 7.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4.93" cy="4.93" r="1.2" fill="#f59e0b" />
      
      <path d="M19.07 4.93L16.6 7.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19.07" cy="4.93" r="1.2" fill="#0284c7" />
      
      <path d="M4.93 19.07L7.4 16.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4.93" cy="19.07" r="1.2" fill="#059669" />
      
      <path d="M19.07 19.07L16.6 16.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19.07" cy="19.07" r="1.2" fill="#f59e0b" />
    </svg>
  );
};

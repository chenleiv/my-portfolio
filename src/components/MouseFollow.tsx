import { useEffect, useState } from 'react';

const MouseFollow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update CSS variables for gradient effects (as percentage)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="mouse-follow"
      style={{
        transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
      }}
    />
  );
};

export default MouseFollow; 
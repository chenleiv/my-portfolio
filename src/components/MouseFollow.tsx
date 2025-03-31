import { useEffect, useState } from 'react';

const MouseFollow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update mouse position for gradient effects (as percentage)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      
      // Update CSS variables for gradient effects
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
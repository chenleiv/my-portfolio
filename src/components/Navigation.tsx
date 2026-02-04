// import { useState, useEffect } from 'react';
// import '../styles/components/_navigation.scss';
// import { useFocus } from '../utils/FocusContext';

// const Navigation = () => {
//   const [activeSection, setActiveSection] = useState('home');
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (isScrolling) return;

//       const sections = ['home', 'about', 'projects'];
//       const scrollPosition = window.scrollY + window.innerHeight / 2;

//       for (const section of sections) {
//         const element = document.getElementById(section);
//         if (element) {
//           const { top, bottom } = element.getBoundingClientRect();
//           const elementTop = top + window.scrollY;
//           const elementBottom = bottom + window.scrollY;

//           if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
//             setActiveSection(section);
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [isScrolling]);

//   const scrollToSection = (sectionId: string) => {
//     setIsScrolling(true);
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//       setActiveSection(sectionId);
//       setIsMenuOpen(false);
//     }
//     setTimeout(() => setIsScrolling(false), 1000);
//   };

//   const { focusConsoleInput } = useFocus();

//   const handleStartClick = () => {
//     focusConsoleInput();
//   };
  
//   return (
//     <nav className="nav">
//       <div className="container">
//         <button 
//           className="menu-toggle"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           <span className={`toggle-icon ${isMenuOpen ? 'open' : ''}`}></span>
//         </button>
        
//         <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
//               onClick={() => {
//                 scrollToSection('about');
//                 handleStartClick();
//               }}
//             >
//               About
//             </button>
//           </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
//               onClick={() => scrollToSection('projects')}
//             >
//               Projects
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navigation; 
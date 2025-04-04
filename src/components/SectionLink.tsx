import React from 'react';

interface SectionLinkProps {
  href: string;
  children: React.ReactNode;
}

const SectionLink: React.FC<SectionLinkProps> = ({ href, children }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    // Logic to navigate to the section
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

export default SectionLink; 
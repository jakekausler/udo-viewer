import { Box, Center, Loader } from '@mantine/core';
import React, { useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface FlipBookViewerProps {
  section: { title: string; content: string } | null;
  margin: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const widthLookup = {
  xs: '90%',
  sm: '75%',
  md: '60%',
  lg: '45%',
  xl: '30%',
};

const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ margin, section }) => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    if (!section) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(section.content, 'text/html');

    doc.querySelectorAll('img').forEach(img => {
      img.src = img.src.replace('http://192.168.2.148:5176/', 'https://udo.raleighnc.gov/');
      img.loading = 'lazy';
    });

    return doc.body.innerHTML;
  }, [section]);

  // Intercept anchor clicks
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only intercept left-click anchor clicks
      if (
        target.tagName === 'A' &&
        target instanceof HTMLAnchorElement &&
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const href = target.getAttribute('href');
        if (href?.startsWith('/')) {
          e.preventDefault();
          navigate(href);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [navigate, processedHtml]);

  if (!section) {
    return (
      <Center py="xl">
        <Loader size="sm" />
      </Center>
    );
  }

  return (
    <Box
      style={{
        width: widthLookup[margin],
        maxWidth: '100%',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      <h2>{section.title}</h2>
      <div
        className="flipbook-content"
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </Box>
  );
};

export default FlipBookViewer;

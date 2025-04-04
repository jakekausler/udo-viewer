import { Box } from '@mantine/core';
import React from 'react';

interface FlipBookViewerProps {
  section: { title: string; content: string };
  margin: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const widthLookup = {
  'xs': '90%',
  'sm': '75%',
  'md': '60%',
  'lg': '45%',
  'xl': '30%',
};

const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ margin, section }) => {
  const processContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      img.src = img.src.replace('http://localhost:5175/', 'https://udo.raleighnc.gov/');
    });
    return doc.body.innerHTML;
  };

  const [processedContent, setProcessedContent] = React.useState('');

  React.useEffect(() => {
    setProcessedContent(processContent(section.content));
  }, [section.content]);

  return (
    <Box style={{ width: `${widthLookup[margin] || '90%'}`, margin: '0 auto' }}>
      <h2>{section.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
    </Box>
  );
};

export default FlipBookViewer; 
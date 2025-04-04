import { Group, Button } from "@mantine/core";

export default function Header({ margin, setMargin }: { margin: 'xs' | 'sm' | 'md' | 'lg' | 'xl', setMargin: (margin: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => void }) {

  const marginSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const marginSizeLabels = {
    xs: 'Extra Small',
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large'
  };

  return (
    <Group justify="space-around" align="center" style={{ width: '100%' }}>
      <Button
        onClick={() => {
          const currentIndex = marginSizes.indexOf(margin);
          const nextIndex = (currentIndex + 1) % marginSizes.length;
          setMargin(marginSizes[nextIndex] as 'xs' | 'sm' | 'md' | 'lg' | 'xl');
        }}
      >
        {marginSizeLabels[margin as keyof typeof marginSizeLabels] || 'Unknown'}
      </Button>
    </Group>
  );
}

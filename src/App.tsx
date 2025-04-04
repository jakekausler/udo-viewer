import { useState } from 'react';
import { AppShell } from '@mantine/core';
import NavigationMenu from './components/NavigationMenu';
import FlipBookViewer from './components/FlipBookViewer';
import './App.css';
import Header from './components/Header';

function App() {
  const [selectedSection, setSelectedSection] = useState<{ title: string; content: string } | null>(null);
  const [margin, setMargin] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  const handleSectionSelect = (section: { title: string; content: string }) => {
    setSelectedSection(section);
  };

  return (
    <AppShell
      padding="md"
      navbar={{ width: 300, breakpoint: 'sm' }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Header
          margin={margin}
          setMargin={setMargin}
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <NavigationMenu onSelectSection={handleSectionSelect} />
      </AppShell.Navbar>
      <AppShell.Main>
        {selectedSection ? <FlipBookViewer section={selectedSection} margin={margin} /> : <div>Select a section to view its content</div>}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;

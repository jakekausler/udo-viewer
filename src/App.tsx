import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@mantine/core";
import NavigationMenu from "./components/NavigationMenu";
import FlipBookViewer from "./components/FlipBookViewer";
import "./App.css";
import Header from "./components/Header";
import { useLocation } from "react-router-dom";
import { fetchUDOData } from "./services/dataFetcher";
import { Chapter } from "./types";
import ScrollToHashOrTop from "./components/scrollToHashOrTop";

function App() {
  const location = useLocation();
  const [udoData, setUdoData] = useState<{ chapters: Chapter[] } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUDOData();
      setUdoData(data);
    };
    loadData();
  }, []);

  const selectedSection = useMemo(() => {
    const sectionUrl = location.pathname.split("/").filter(Boolean).at(-1);
    if (!sectionUrl || !udoData) return null;

    for (const chapter of udoData.chapters) {
      if (chapter.url === sectionUrl) {
        return chapter.articles[0]?.sections[0] ?? null;
      }
      for (const article of chapter.articles) {
        if (article.url === sectionUrl) {
          return article.sections[0] ?? null;
        }
        for (const section of article.sections) {
          if (section.url === sectionUrl) {
            return section;
          }
        }
      }
    }

    return null;
  }, [udoData, location.pathname]);

  const [navbarOpened, setNavbarOpened] = useState(false);

  const [margin, setMargin] = useState<"xs" | "sm" | "md" | "lg" | "xl">("xs");
  // TODO: Save margin and color scheme in local storage

  const toggleNavbar = () => {
    setNavbarOpened((prev) => !prev);
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpened },
      }}
      header={{ height: 30 }}
      style={{ width: "100%" }}
    >
      <ScrollToHashOrTop />
      <AppShell.Header>
        <Header
          margin={margin}
          setMargin={setMargin}
          toggleNavbar={toggleNavbar}
          navbarOpen={navbarOpened}
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <NavigationMenu udoData={udoData} toggleNavbar={toggleNavbar} />
      </AppShell.Navbar>
      <AppShell.Main
        style={{ flex: 1, display: "flex", justifyContent: "center" }}
      >
        {selectedSection ? (
          <FlipBookViewer section={selectedSection} margin={margin} />
        ) : (
          <div>Select a section to view its content</div>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;

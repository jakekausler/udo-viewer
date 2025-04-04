import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ActionIcon, Anchor, Box, Button, Collapse, Group, Stack } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Article, Chapter, Section } from '../types';

interface NavigationMenuProps {
  udoData: { chapters: Chapter[] } | null;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ udoData }) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!udoData) return;

    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return;

    const sectionUrl = path[path.length - 1];
    for (const [chapterIndex, chapter] of udoData.chapters.entries()) {
      for (const article of chapter.articles) {
        for (const section of article.sections) {
          if (section.url === sectionUrl) {
            setExpandedChapters(prev => {
              if (prev.has(chapterIndex)) return prev;
              const newSet = new Set(prev);
              newSet.add(chapterIndex);
              return newSet;
            });
            setExpandedArticles(prev => {
              if (prev.has(article.title)) return prev;
              const newSet = new Set(prev);
              newSet.add(article.title);
              return newSet;
            });
          }
        }
      }
    }
  }, [location, udoData]);

  const toggleChapter = useCallback((index: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  }, []);

  const toggleArticle = useCallback((title: string) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      newSet.has(title) ? newSet.delete(title) : newSet.add(title);
      return newSet;
    });
  }, []);

  const expandAll = () => {
    if (!udoData) return;
    setExpandedChapters(new Set(udoData.chapters.map((_, idx) => idx)));
    setExpandedArticles(
      new Set(udoData.chapters.flatMap(ch => ch.articles.map(a => a.title)))
    );
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
    setExpandedArticles(new Set());
  };

  const chapters = useMemo(() => {
    return udoData?.chapters.map((chapter, chapterIndex) => (
      <ChapterItem
        key={chapterIndex}
        chapter={chapter}
        chapterIndex={chapterIndex}
        isExpanded={expandedChapters.has(chapterIndex)}
        toggleChapter={toggleChapter}
        expandedArticles={expandedArticles}
        toggleArticle={toggleArticle}
        navigate={navigate}
      />
    ));
  }, [udoData, expandedChapters, expandedArticles, toggleChapter, toggleArticle, navigate]);

  return (
    <Stack align="center" style={{ overflowY: 'auto' }}>
      <Group align="center" p="md">
        <Button onClick={expandAll}>Expand All</Button>
        <Button onClick={collapseAll}>Collapse All</Button>
      </Group>
      {udoData ? (
        <Stack px="xs" style={{ overflowY: 'auto' }}>
          {chapters}
        </Stack>
      ) : (
        <p>Loading...</p>
      )}
    </Stack>
  );
};

export default NavigationMenu;

// -------------------------
// Memoized Child Components
// -------------------------

interface ChapterItemProps {
  chapter: Chapter;
  chapterIndex: number;
  isExpanded: boolean;
  toggleChapter: (index: number) => void;
  expandedArticles: Set<string>;
  toggleArticle: (title: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const ChapterItem: React.FC<ChapterItemProps> = React.memo(({
  chapter,
  chapterIndex,
  isExpanded,
  toggleChapter,
  expandedArticles,
  toggleArticle,
  navigate
}) => (
  <Stack>
    <Group gap="xs" style={{ display: 'flex', alignItems: 'center' }}>
      <ActionIcon variant="subtle" size="xs" onClick={() => toggleChapter(chapterIndex)}>
        {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
      </ActionIcon>
      <Box style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleChapter(chapterIndex)}>
        <strong>{chapter.title}</strong>
      </Box>
    </Group>
    <Collapse in={isExpanded}>
      <Stack>
        {chapter.articles.map((article, index) => (
          <ArticleItem
            key={index}
            article={article}
            isExpanded={expandedArticles.has(article.title)}
            toggleArticle={toggleArticle}
            navigate={navigate}
          />
        ))}
      </Stack>
    </Collapse>
  </Stack>
));

interface ArticleItemProps {
  article: Article;
  isExpanded: boolean;
  toggleArticle: (title: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const ArticleItem: React.FC<ArticleItemProps> = React.memo(({
  article,
  isExpanded,
  toggleArticle,
  navigate
}) => (
  <Stack>
    <Group gap="xs" style={{ display: 'flex', alignItems: 'center' }}>
      <ActionIcon variant="subtle" size="xs" onClick={() => toggleArticle(article.title)}>
        {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
      </ActionIcon>
      <Box style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleArticle(article.title)}>
        <span>{article.title}</span>
      </Box>
    </Group>
    <Collapse in={isExpanded}>
      <Stack>
        {article.sections.map((section, idx) => (
          <SectionItem
            key={idx}
            section={section}
            navigate={navigate}
          />
        ))}
      </Stack>
    </Collapse>
  </Stack>
));

interface SectionItemProps {
  section: Section;
  navigate: ReturnType<typeof useNavigate>;
}

const SectionItem: React.FC<SectionItemProps> = React.memo(({
  section,
  navigate
}) => (
  <Box pl="xl">
    <Anchor
      size="sm"
      href={`/${section.url}`}
      onClick={(e) => {
        if (e.type === 'click' && e.button === 0 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          navigate(`/${section.url}`);
        }
      }}
      style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'normal' }}
    >
      {section.title}
    </Anchor>
  </Box>
));

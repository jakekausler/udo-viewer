import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ActionIcon, Anchor, Box, Button, Collapse, Group, Stack } from '@mantine/core';
import { fetchUDOData } from '../services/dataFetcher';
import { Article, Chapter, Section } from '../types';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationMenuProps {
  onSelectSection: (section: { title: string; content: string }) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onSelectSection }) => {
  const [udoData, setUdoData] = useState<{ chapters: Chapter[] } | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Map<number, boolean>>(new Map());
  const [expandedArticles, setExpandedArticles] = useState<Map<string, boolean>>(new Map());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUDOData();
      setUdoData(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (udoData) {
      const path = location.pathname.split('/').filter(Boolean);
      if (path.length > 0) {
        const sectionUrl = path[path.length - 1];
        udoData.chapters.forEach((chapter, chapterIndex) => {
          chapter.articles.forEach(article => {
            article.sections.forEach(section => {
              if (section.url === sectionUrl) {
                setExpandedChapters(new Map(expandedChapters.set(chapterIndex, true)));
                setExpandedArticles(new Map(expandedArticles.set(article.title, true)));
                onSelectSection(section);
              }
            });
          });
        });
      }
    }
  }, [location, udoData, onSelectSection]);

  const toggleChapter = useCallback((index: number) => {
    setExpandedChapters(prev => new Map(prev).set(index, !prev.get(index)));
  }, []);

  const toggleArticle = useCallback((key: string) => {
    setExpandedArticles(prev => new Map(prev).set(key, !prev.get(key)));
  }, []);

  const expandAll = () => {
    if (udoData) {
      const allChapters = new Map(udoData.chapters.map((_, index) => [index, true]));
      const allArticles = new Map(udoData.chapters.flatMap(chapter => chapter.articles.map(article => [article.title, true])));
      setExpandedChapters(allChapters);
      setExpandedArticles(allArticles);
    }
  };

  const collapseAll = () => {
    setExpandedChapters(new Map());
    setExpandedArticles(new Map());
  };

  const ChapterItem = React.memo(({ chapter, chapterIndex }: { chapter: Chapter, chapterIndex: number }) => (
    <Stack key={chapterIndex}>
      <Group key={chapterIndex} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap="xs">
        <ActionIcon variant="subtle" size="xs" onClick={() => toggleChapter(chapterIndex)}>
          {expandedChapters.get(chapterIndex) ? <IconChevronRight /> : <IconChevronDown />}
        </ActionIcon>
        <Box style={{ flex: 1, cursor: 'pointer' }}>
          <strong onClick={() => toggleChapter(chapterIndex)}>{chapter.title}</strong>
        </Box>
      </Group>
      <Collapse in={expandedChapters.get(chapterIndex)}>
        <Stack>
          {chapter.articles.map((article, articleIndex) => (
            <ArticleItem key={articleIndex} article={article} />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  ));

  const ArticleItem = React.memo(({ article }: { article: Article }) => (
    <Stack>
      <Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap="xs">
        <ActionIcon variant="subtle" size="xs" onClick={() => toggleArticle(article.title)}>
          {expandedArticles.get(article.title) ? <IconChevronRight /> : <IconChevronDown />}
        </ActionIcon>
        <Box style={{ flex: 1, cursor: 'pointer' }}>
          <span onClick={() => toggleArticle(article.title)}>{article.title}</span>
        </Box>
      </Group>
      <Collapse in={expandedArticles.get(article.title)}>
        <Stack>
          {article.sections.map((section, sectionIndex) => (
            <SectionItem key={sectionIndex} section={section} />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  ));

  const SectionItem = React.memo(({ section }: { section: Section }) => (
    <Stack>
      <Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap="xs">
        <Box style={{ flex: 1, cursor: 'pointer' }} pl="xl">
          <Anchor
            size="sm"
            href={`/${section.url}`}
            onClick={(e) => {
              if (e.type === 'click' && e.button === 0 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                navigate(`/${section.url}`);
                onSelectSection(section);
              }
            }}
            style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'normal' }}
          >
            {section.title}
          </Anchor>
        </Box>
      </Group>
    </Stack>
  ));

  const chapters = useMemo(() => {
    return udoData ? udoData.chapters.map((chapter, chapterIndex) => (
      <ChapterItem key={chapterIndex} chapter={chapter} chapterIndex={chapterIndex} />
    )) : null;
  }, [udoData, expandedChapters, expandedArticles]);

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
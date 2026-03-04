import { useMemo, useState, useCallback } from 'react';
import {
  autocompleteDictionary,
  SectionKey,
} from '../app/autocomplete-dictionary';

export const useAutocomplete = (sectionLabel: string, query: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Находим позицию последней запятой
  const lastCommaIndex = useMemo(() => {
    return query.lastIndexOf(',');
  }, [query]);

  // Получаем последнее слово после запятой для поиска
  const lastWord = useMemo(() => {
    if (!query.trim()) return '';

    if (lastCommaIndex === -1) {
      return query.trim();
    }

    // Берем всё после последней запятой и trim-им
    const afterComma = query.substring(lastCommaIndex + 1);
    return afterComma.trim();
  }, [query, lastCommaIndex]);

  const suggestions = useMemo(() => {
    const key = sectionLabel as SectionKey;
    const dictionary = autocompleteDictionary[key];

    if (!dictionary) return [];
    if (!lastWord.trim()) {
      if (key === 'Диагноз') {
        return dictionary;
      } else {
        return [];
      }
    }

    return dictionary
      .filter((term) => term.toLowerCase().includes(lastWord.toLowerCase()))
      .slice(0, 7);
  }, [sectionLabel, lastWord]);

  // ✅ ИСПРАВЛЕНИЕ: Сохраняем оригинальный текст до последнего слова
  const prefixText = useMemo(() => {
    if (lastCommaIndex === -1) return '';

    // Возвращаем всё до последней запятой + сама запятая
    // Пробел после запятой берем из оригинального текста
    return query.substring(0, lastCommaIndex + 1);
  }, [query, lastCommaIndex]);

  // ✅ ИСПРАВЛЕНИЕ: Сохраняем пробел после запятой из оригинального текста
  const spaceAfterComma = useMemo(() => {
    if (lastCommaIndex === -1) return '';
    if (lastCommaIndex >= query.length - 1) return '';

    // Проверяем, есть ли пробел сразу после запятой
    const charAfterComma = query[lastCommaIndex + 1];
    return charAfterComma === ' ' ? ' ' : '';
  }, [query, lastCommaIndex]);

  const handleSelect = useCallback((suggestion: string) => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // ✅ ИСПРАВЛЕНИЕ: Корректно собираем полное значение
  const getFullValueAfterSelect = useCallback(
    (suggestion: string) => {
      if (prefixText) {
        // Если есть запятая, добавляем пробел только если его не было
        const hasSpace = spaceAfterComma === ' ';
        const hasLastWord = lastWord.trim().length > 0;

        if (hasLastWord) {
          // Если пользователь уже что-то ввел после запятой - заменяем это слово
          return `${prefixText}${hasSpace ? ' ' : ''}${suggestion}`;
        } else {
          // Если после запятой ничего нет - просто добавляем пробел и слово
          return `${prefixText} ${suggestion}`;
        }
      }
      return suggestion;
    },
    [prefixText, spaceAfterComma, lastWord],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onSelect: (value: string) => void) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            const fullValue = getFullValueAfterSelect(
              suggestions[highlightedIndex],
            );
            onSelect(fullValue);
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [
      isOpen,
      suggestions,
      highlightedIndex,
      handleSelect,
      getFullValueAfterSelect,
    ],
  );

  return {
    suggestions,
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleSelect,
    handleKeyDown,
    getFullValueAfterSelect,
    lastWord,
    prefixText,
    spaceAfterComma,
  };
};

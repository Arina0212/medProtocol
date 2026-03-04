'use client';

import { useState, ChangeEvent } from 'react';
import { SectionInput } from '@/components/SectionInput';

interface SectionData {
  id: number;
  label: string;
  value: string;
}

export default function Home() {
  const [templateTitle, setTemplateTitle] = useState<string>(
    'Протокол консультации терапевта №1',
  );

  const [sections, setSections] = useState<SectionData[]>([
    { id: 1, label: 'Жалобы', value: '' },
    { id: 2, label: 'Состояние пациента', value: '' },
    { id: 3, label: 'Анамнез заболевания', value: '' },
    { id: 4, label: 'Экспертный анамнез', value: '' },
    { id: 5, label: 'Анамнез жизни', value: '' },
    { id: 6, label: 'Вредные привычки и зависимости', value: '' },
    { id: 7, label: 'Объективно', value: '' },
    { id: 8, label: 'Диагноз', value: '' },
    { id: 9, label: 'Уточнённый диагноз', value: '' },
    { id: 10, label: 'Патологии', value: '' },
    { id: 11, label: 'Рекомендации', value: '' },
    { id: 12, label: 'Заключение', value: '' },
  ]);

  const handleLabelChange = (id: number, newLabel: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, label: newLabel } : section,
      ),
    );
  };

  const handleValueChange = (id: number, newValue: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, value: newValue } : section,
      ),
    );
  };

  const handleSave = () => {
    const sectionsData: Record<string, string> = Object.fromEntries(
      sections.map((section) => [section.label, section.value]),
    );

    const dataToSave = {
      templateTitle,
      timestamp: new Date().toISOString(),
      ...sectionsData,
    };

    console.log('Сохраненные данные:', dataToSave);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-12 px-auto py-15 bg-white">
        <input
          type="text"
          value={templateTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTemplateTitle(e.target.value)
          }
          className="text-[40px] pl-6 font-semibold leading-[150%] bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
        />

        <div className="flex gap-9 flex-col">
          {sections.map((section) => (
            <SectionInput
              key={section.id}
              id={section.id}
              label={section.label}
              value={section.value}
              onLabelChange={handleLabelChange}
              onValueChange={handleValueChange}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          className="hover:bg-[#9b44dd] text-white rounded-xl h-13 ml-6 cursor-pointer bg-[#9C50D8] px-6 transition-colors"
        >
          Сохранить
        </button>
      </main>
    </div>
  );
}

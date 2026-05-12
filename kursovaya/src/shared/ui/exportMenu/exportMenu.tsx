'use client';

import { useState } from 'react';
import styles from './styles/exportMenu.module.scss';
import { InstituteExport } from '@/src/lib/export/excel';

interface ExportMenuProps {
  data: InstituteExport[];
  filename: string;
}

type ExportFormat = 'excel' | 'word' | 'pdf' | 'print';

export function ExportMenu({ data, filename }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setIsOpen(false);

    try {
      switch (format) {
        case 'excel':
          const { exportToExcel } = await import('@/src/lib/export/excel');
          exportToExcel(data, filename);
          break;
        case 'word':
          const { exportToWord } = await import('@/src/lib/export/word');
          await exportToWord(data, filename);
          break;
        case 'pdf':
          const { exportToPDF } = await import('@/src/lib/export/pdf');
          exportToPDF(data, filename);
          break;
        case 'print':
          window.print();
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.exportMenu}>
      <button
        className={styles.exportButton}
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
      >
        {exporting ? (
          <>
            <span className={styles.spinner}></span>
            Экспорт...
          </>
        ) : (
          <>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Экспорт
          </>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button onClick={() => handleExport('excel')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Excel (.xlsx)
          </button>
          <button onClick={() => handleExport('word')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            Word (.docx)
          </button>
          <button onClick={() => handleExport('pdf')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            PDF
          </button>
          <hr className={styles.divider} />
          <button onClick={() => handleExport('print')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Печать
          </button>
        </div>
      )}
    </div>
  );
}

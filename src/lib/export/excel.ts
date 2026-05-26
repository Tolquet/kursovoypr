import * as XLSX from 'xlsx';

export interface InstituteExport {
  name: string;
  description: string;
  types: string;
  location: string;
  rating: number;
  tuition: string;
  categories: string[];
}

export function exportToExcel(data: InstituteExport[], filename: string): void {
  const worksheetData = data.map(item => ({
    'Название': item.name,
    'Описание': item.description,
    'Тип': item.types,
    'Город': item.location,
    'Рейтинг': item.rating,
    'Стоимость': item.tuition,
    'Категории': item.categories.join(', '),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 50 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Учебные заведения');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToExcelStyled(data: InstituteExport[], filename: string): void {
  const workbook = XLSX.utils.book_new();
  
  const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
    'Название': item.name,
    'Тип': item.types,
    'Город': item.location,
    'Рейтинг': item.rating,
    'Стоимость': item.tuition,
  })));

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddr]) {
      worksheet[cellAddr].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '0657F9' } },
        alignment: { horizontal: 'center' },
      };
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

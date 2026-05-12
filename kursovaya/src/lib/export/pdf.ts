import jsPDF from 'jspdf';

export interface InstituteExport {
  name: string;
  description: string;
  types: string;
  location: string;
  rating: number;
  tuition: string;
}

export function exportToPDF(data: InstituteExport[], filename: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.setTextColor(6, 87, 249);
  doc.text('Список учебных заведений', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, 28, { align: 'center' });

  let yPosition = 40;

  doc.setFillColor(6, 87, 249);
  doc.rect(10, yPosition, pageWidth - 20, 8, 'F');
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  const headers = ['Название', 'Тип', 'Город', 'Рейтинг', 'Стоимость'];
  const colWidths = [50, 25, 30, 20, 25];
  let xPosition = 12;

  headers.forEach((header) => {
    doc.text(header, xPosition, yPosition + 5.5);
    xPosition += colWidths[headers.indexOf(header)];
  });

  yPosition += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);

  data.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(10, yPosition - 4, pageWidth - 20, 8, 'F');
    }

    doc.setFontSize(8);
    xPosition = 12;

    const rowData = [
      item.name.substring(0, 25) + (item.name.length > 25 ? '...' : ''),
      item.types,
      item.location,
      item.rating.toFixed(1),
      item.tuition,
    ];

    rowData.forEach((cell) => {
      doc.text(cell, xPosition, yPosition);
      xPosition += colWidths[rowData.indexOf(cell)];
    });

    yPosition += 8;

    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Страница ${i} из ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
  }

  doc.save(`${filename}.pdf`);
}

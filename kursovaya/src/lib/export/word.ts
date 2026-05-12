import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';

export interface InstituteExport {
  name: string;
  description: string;
  types: string;
  location: string;
  rating: number;
  tuition: string;
}

export async function exportToWord(data: InstituteExport[], filename: string): Promise<void> {
  const title = new Paragraph({
    children: [
      new TextRun({
        text: 'Список учебных заведений',
        bold: true,
        size: 32,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  });

  const tableRows = [
    new TableRow({
      children: [
        createHeaderCell('Название'),
        createHeaderCell('Тип'),
        createHeaderCell('Город'),
        createHeaderCell('Рейтинг'),
        createHeaderCell('Стоимость'),
      ],
    }),
    ...data.map(item => new TableRow({
      children: [
        createDataCell(item.name),
        createDataCell(item.types),
        createDataCell(item.location),
        createDataCell(item.rating.toString()),
        createDataCell(item.tuition),
      ],
    })),
  ];

  const table = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [title, table],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  downloadFile(buffer, `${filename}.docx`);
}

function createHeaderCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true })],
      alignment: AlignmentType.CENTER,
    })],
    shading: { fill: '0657F9' },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
}

function createDataCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({
      text,
      alignment: AlignmentType.LEFT,
    })],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
}

function downloadFile(buffer: Uint8Array, filename: string): void {
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import * as XLSX from 'xlsx';

export const exporter = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Calculate column widths dynamically based on content
  const columnWidths = Object.keys(data[0]).map((key) => ({
    wch: Math.max(
      key.length, // Header width
      ...data.map((row) => (row[key] ? row[key].toString().length : 0)) // Content width
    ),
  }));

  worksheet['!cols'] = columnWidths; // Set dynamic column widths

  // Create a binary Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Trigger file download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'data.xlsx'); // File name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

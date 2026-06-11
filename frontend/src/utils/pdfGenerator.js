import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a branded PDF report.
 * @param {string} title - Title of the report (e.g., "Book Inventory Report")
 * @param {Array<string>} columns - Column headers
 * @param {Array<Array<any>>} data - Rows of data corresponding to columns
 * @param {Object} summaryStats - Key-value pairs for summary statistics
 * @param {string} filename - Output filename
 */
export const generatePDFReport = ({ title, columns, data, summaryStats = {}, filename = 'report.pdf' }) => {
    // Initialize jsPDF (portrait, points, A4)
    const doc = new jsPDF('p', 'pt', 'a4');

    const pageWidth = doc.internal.pageSize.width;
    const marginX = 40;
    let cursorY = 40;

    // --- 1. Branding & Header ---
    // Background header bar
    doc.setFillColor(7, 17, 31); // #07111F
    doc.rect(0, 0, pageWidth, 80, 'F');

    // Title / Logo Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('Nexus', marginX, 50);
    
    // Accent Cyan for "Lib"
    const titleWidth = doc.getTextWidth('Nexus');
    doc.setTextColor(0, 212, 200); // #00D4C8
    doc.text('Lib', marginX + titleWidth, 50);

    // Report Type (right-aligned)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const reportTypeWidth = doc.getTextWidth(title);
    doc.text(title, pageWidth - marginX - reportTypeWidth, 50);

    cursorY = 110;

    // --- 2. Date Generated ---
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, marginX, cursorY);
    cursorY += 20;

    // --- 3. Statistical Summary ---
    const statKeys = Object.keys(summaryStats);
    if (statKeys.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text('Summary', marginX, cursorY);
        cursorY += 15;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85); // Slate 700

        let statX = marginX;
        statKeys.forEach((key, index) => {
            const statText = `${key}: ${summaryStats[key]}`;
            // Simple inline flow for stats
            if (statX + doc.getTextWidth(statText) > pageWidth - marginX) {
                statX = marginX;
                cursorY += 15;
            }
            doc.text(statText, statX, cursorY);
            statX += doc.getTextWidth(statText) + 30;
        });
        cursorY += 25;
    }

    // --- 4. Data Table ---
    autoTable(doc, {
        startY: cursorY,
        head: [columns],
        body: data,
        theme: 'striped',
        headStyles: {
            fillColor: [12, 28, 46], // #0C1C2E
            textColor: 255,
            fontStyle: 'bold',
        },
        bodyStyles: {
            textColor: 50,
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252] // Slate 50
        },
        margin: { top: 40, right: 40, bottom: 40, left: 40 },
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 6,
        },
    });

    // --- 5. Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.height - 20,
            { align: 'center' }
        );
    }

    // --- 6. Save ---
    doc.save(filename);
};

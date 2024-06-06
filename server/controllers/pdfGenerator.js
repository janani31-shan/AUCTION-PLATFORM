const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generateInvoicePdf(ad, winner) {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Pipe the PDF into a writable stream (save to a file)
  const stream = doc.pipe(fs.createWriteStream('invoice.pdf'));

  // Build your PDF content using doc functions
  doc.text('Invoice for Auction Winning', { align: 'center' });

  // Create a table-like structure using manual positioning and formatting
  const tableData = [
    ['Item', ad.productName],
    ['Description', ad.description],
    ['Category', ad.category],
    ['Price', `${ad.currentPrice} INR`],
    ['Winner', winner.name], // Replace with the actual winner's name
    // Add more rows as needed
  ];

  let startX = 100; // Use 'let' instead of 'const' to allow reassignment
  let startY = 250; // Use 'let' instead of 'const' to allow reassignment
  const rowHeight = 20; // Adjust the row height as needed

  for (const [label, value] of tableData) {
    doc.text(label, startX, startY, { width: 100 });

    // Check if the label is "Description" to create a sub-table
    if (label === 'Description') {
      const descriptionTableData = [
        ['Detail 1', 'Value 1'],
        ['Detail 2', 'Value 2'],
        // Add more details as needed
      ];

      // Move down for the sub-table
      startY += 20;

      // Loop through sub-table data
      for (const [subLabel, subValue] of descriptionTableData) {
        doc.text(subLabel, startX + 20, startY, { width: 100 });
        doc.text(subValue, startX + 120, startY, { width: 300 });
        startY += rowHeight;
      }
    } else {
      // If it's not "Description," simply add the value
      doc.text(value, startX + 120, startY, { width: 300 });
      startY += rowHeight;
    }
  }

  // ... other content ...

  // Finalize PDF
  doc.end();

  // Return a Promise to indicate when the PDF generation is complete
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve('invoice.pdf'));
    stream.on('error', (error) => reject(error));
  });
}

module.exports = generateInvoicePdf;

// Usage example:
// const ad = {
//   productName: 'Product 1',
//   description: 'Product Description',
//   category: 'Category',
//   currentPrice: 100,
// };
// const winner = {
//   name: 'John Doe',
// };

// generateInvoicePdf(ad, winner)
//   .then((pdfFilename) => {
//     console.log(`PDF saved as: ${pdfFilename}`);
//   })
//   .catch((error) => {
//     console.error(`Error generating PDF: ${error}`);
//   });

document.getElementById('convertButton').addEventListener('click', async () => {
    const files = document.getElementById('imageUpload').files;

    if (files.length === 0) {
        alert('Please upload at least one image.');
        return;
    }

    // Initialize a new PDF document
    const pdfDoc = await PDFLib.PDFDocument.create();

    for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let pdfImage;

        if (file.type === 'image/jpeg') {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png') {
            pdfImage = await pdfDoc.embedPng(imageBytes);
        }

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: pdfImage.width,
            height: pdfImage.height,
        });
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Create a download link for the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'converted.pdf';
    downloadLink.style.display = 'block';
    downloadLink.textContent = 'Download PDF';
});

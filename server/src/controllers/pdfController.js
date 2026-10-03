import { compileLandscapePdf } from '../services/pdfService.js';

export async function generatePdf(req, res) {
  try {
    const { students, visibility } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        error: 'فهرست دانش‌آموزان خالی است یا ارسال نشده است.',
      });
    }

    const startTime = Date.now();
    console.log(`[PDF] Generating multi-page landscape PDF for ${students.length} students...`);

    const pdfBuffer = await compileLandscapePdf(students, visibility);

    const duration = Date.now() - startTime;
    console.log(`[PDF] Generated successfully in ${duration}ms (${pdfBuffer.length} bytes).`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="student-report-cards-${Date.now()}.pdf"`
    );

    return res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error('[PDF Generation Error]:', error);
    return res.status(500).json({
      error: 'خطای سیستمی در ساخت و کامپایل فایل PDF رخ داد.',
      details: error.message,
    });
  }
}

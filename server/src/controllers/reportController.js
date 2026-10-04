import { studentReportQueries } from '../db/database.js';

export const saveBatchReports = async (req, res) => {
  try {
    const { reports } = req.body;
    if (!reports || !Array.isArray(reports)) {
      return res.status(400).json({ error: 'reports array is required in request body.' });
    }

    studentReportQueries.upsertBatch(reports);
    res.json({ success: true, count: reports.length, message: 'گزارش‌ها با موفقیت در پایگاه‌داده ذخیره شدند.' });
  } catch (err) {
    console.error('[Report Controller Error]', err);
    res.status(500).json({ error: err.message || 'خطا در ذخیره‌سازی اطلاعات در پایگاه‌داده.' });
  }
};

export const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required.' });
    }

    const history = studentReportQueries.getStudentHistory(studentId);
    res.json({ studentId, history });
  } catch (err) {
    console.error('[Student History Controller Error]', err);
    res.status(500).json({ error: err.message || 'خطا در دریافت سوابق تاریخی دانش‌آموز.' });
  }
};

export const getReports = async (req, res) => {
  try {
    const { className, year, month } = req.query;
    const reports = studentReportQueries.getAllReports({ className, year, month });
    res.json({ reports });
  } catch (err) {
    console.error('[Get Reports Error]', err);
    res.status(500).json({ error: err.message || 'خطا در جستجوی گزارش‌ها.' });
  }
};

export const getPeriods = async (req, res) => {
  try {
    const periods = studentReportQueries.getUniquePeriods();
    res.json({ periods });
  } catch (err) {
    console.error('[Get Periods Error]', err);
    res.status(500).json({ error: err.message || 'خطا در دریافت لیست دوره‌ها.' });
  }
};

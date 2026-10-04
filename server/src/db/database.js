import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'reports.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance and concurrency
db.pragma('journal_mode = WAL');

// Persian months in school calendar chronological order (Mehr = 1, Aban = 2, ...)
export const PERSIAN_SCHOOL_MONTHS = [
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند',
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور'
];

export const getMonthOrder = (monthStr = '') => {
  const clean = String(monthStr).replace(/\u200C/g, '').replace('ماه', '').trim();
  const index = PERSIAN_SCHOOL_MONTHS.findIndex(m => m.includes(clean) || clean.includes(m));
  return index !== -1 ? index + 1 : 99;
};

/**
 * Initialize SQLite Database Schema
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_reports (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      year TEXT NOT NULL,
      month TEXT NOT NULL,
      exam_period TEXT,
      curr_total REAL DEFAULT 0,
      prev_total REAL DEFAULT 0,
      curr_math REAL DEFAULT 0,
      prev_math REAL DEFAULT 0,
      absences INTEGER DEFAULT 0,
      tardies INTEGER DEFAULT 0,
      discipline TEXT DEFAULT 'خوب',
      homework_submitted INTEGER DEFAULT 0,
      homework_total INTEGER DEFAULT 0,
      homework_rate REAL DEFAULT 0,
      advisor_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_student_reports_timeline 
    ON student_reports (student_id, year, month, created_at);

    CREATE INDEX IF NOT EXISTS idx_student_reports_scope 
    ON student_reports (class_name, year, month);
  `);

  seedInitialData();
}

/**
 * Seed sample historical longitudinal data across multiple months
 */
function seedInitialData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM student_reports').get();
  if (countRow.count > 0) return;

  const insertStmt = db.prepare(`
    INSERT INTO student_reports (
      id, student_id, student_name, class_name, year, month, exam_period,
      curr_total, prev_total, curr_math, prev_math, absences, tardies,
      discipline, homework_submitted, homework_total, homework_rate,
      advisor_note, created_at
    ) VALUES (
      @id, @student_id, @student_name, @class_name, @year, @month, @exam_period,
      @curr_total, @prev_total, @curr_math, @prev_math, @absences, @tardies,
      @discipline, @homework_submitted, @homework_total, @homework_rate,
      @advisor_note, @created_at
    )
  `);

  const initialRecords = [
    // Alireza Hosseini (Mehr, Aban, Azar)
    {
      id: 'rep-ali-1403-mehr',
      student_id: 'std-001',
      student_name: 'علیرضا حسینی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'مهر',
      exam_period: 'آزمون شماره ۱ - مهر ۱۴۰۳',
      curr_total: 82,
      prev_total: 75,
      curr_math: 78,
      prev_math: 70,
      absences: 1,
      tardies: 1,
      discipline: 'عالی',
      homework_submitted: 26,
      homework_total: 30,
      homework_rate: 87,
      advisor_note: 'ورود پرانرژی به سال تحصیلی و شروع مناسب در تکالیف.',
      created_at: '2024-10-15 10:00:00'
    },
    {
      id: 'rep-ali-1403-aban',
      student_id: 'std-001',
      student_name: 'علیرضا حسینی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'آبان',
      exam_period: 'آزمون شماره ۲ - آبان ۱۴۰۳',
      curr_total: 87,
      prev_total: 82,
      curr_math: 86,
      prev_math: 78,
      absences: 1,
      tardies: 2,
      discipline: 'عالی',
      homework_submitted: 28,
      homework_total: 30,
      homework_rate: 93,
      advisor_note: 'رشد محسوس در هندسه و حساب. استمرار تلاش‌ها قابل تحسین است.',
      created_at: '2024-11-15 10:00:00'
    },
    {
      id: 'rep-ali-1403-azar',
      student_id: 'std-001',
      student_name: 'علیرضا حسینی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'آذر',
      exam_period: 'آزمون جامع نوبت اول - آذر ۱۴۰۳',
      curr_total: 91,
      prev_total: 87,
      curr_math: 94,
      prev_math: 86,
      absences: 1,
      tardies: 2,
      discipline: 'عالی',
      homework_submitted: 29,
      homework_total: 30,
      homework_rate: 97,
      advisor_note: 'پیشرفت چشمگیر در درس ریاضی و استمرار عالی در ارسال تکالیف هفتگی.',
      created_at: '2024-12-15 10:00:00'
    },

    // Mohammad Sadeghi (Mehr, Aban, Azar)
    {
      id: 'rep-moh-1403-mehr',
      student_id: 'std-002',
      student_name: 'محمد صادقی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'مهر',
      exam_period: 'آزمون شماره ۱ - مهر ۱۴۰۳',
      curr_total: 78,
      prev_total: 80,
      curr_math: 74,
      prev_math: 76,
      absences: 2,
      tardies: 3,
      discipline: 'خوب',
      homework_submitted: 22,
      homework_total: 30,
      homework_rate: 73,
      advisor_note: 'نیاز به هماهنگی بیشتر با کلاس و تحویل سر وقت پروژه‌ها.',
      created_at: '2024-10-15 10:00:00'
    },
    {
      id: 'rep-moh-1403-aban',
      student_id: 'std-002',
      student_name: 'محمد صادقی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'آبان',
      exam_period: 'آزمون شماره ۲ - آبان ۱۴۰۳',
      curr_total: 74,
      prev_total: 78,
      curr_math: 70,
      prev_math: 74,
      absences: 3,
      tardies: 4,
      discipline: 'نیاز به توجه',
      homework_submitted: 18,
      homework_total: 30,
      homework_rate: 60,
      advisor_note: 'کاهش انگیزه در تکالیف تحلیلی ریاضی.',
      created_at: '2024-11-15 10:00:00'
    },
    {
      id: 'rep-moh-1403-azar',
      student_id: 'std-002',
      student_name: 'محمد صادقی',
      class_name: 'هفتم ۱',
      year: '1403',
      month: 'آذر',
      exam_period: 'آزمون جامع نوبت اول - آذر ۱۴۰۳',
      curr_total: 67,
      prev_total: 74,
      curr_math: 58,
      prev_math: 70,
      absences: 4,
      tardies: 5,
      discipline: 'نیاز به توجه',
      homework_submitted: 16,
      homework_total: 30,
      homework_rate: 53,
      advisor_note: 'افت در مباحث پایه ریاضی به همراه غیبت‌های مکرر. جلسه حضوری با اولیا ضروری است.',
      created_at: '2024-12-15 10:00:00'
    },

    // Sara Rahimi (Mehr, Aban, Azar)
    {
      id: 'rep-sara-1403-mehr',
      student_id: 'std-003',
      student_name: 'سارا رحیمی',
      class_name: 'هفتم ۲',
      year: '1403',
      month: 'مهر',
      exam_period: 'آزمون شماره ۱ - مهر ۱۴۰۳',
      curr_total: 86,
      prev_total: 84,
      curr_math: 82,
      prev_math: 80,
      absences: 0,
      tardies: 0,
      discipline: 'عالی',
      homework_submitted: 30,
      homework_total: 30,
      homework_rate: 100,
      advisor_note: 'نظم و دقت تحسین‌برانگیز در کلیه دروس.',
      created_at: '2024-10-15 10:00:00'
    },
    {
      id: 'rep-sara-1403-aban',
      student_id: 'std-003',
      student_name: 'سارا رحیمی',
      class_name: 'هفتم ۲',
      year: '1403',
      month: 'آبان',
      exam_period: 'آزمون شماره ۲ - آبان ۱۴۰۳',
      curr_total: 89,
      prev_total: 86,
      curr_math: 85,
      prev_math: 82,
      absences: 0,
      tardies: 1,
      discipline: 'عالی',
      homework_submitted: 30,
      homework_total: 30,
      homework_rate: 100,
      advisor_note: 'تسلط بالا در مفاهیم و مشارکت فعال در کلاس.',
      created_at: '2024-11-15 10:00:00'
    },
    {
      id: 'rep-sara-1403-azar',
      student_id: 'std-003',
      student_name: 'سارا رحیمی',
      class_name: 'هفتم ۲',
      year: '1403',
      month: 'آذر',
      exam_period: 'آزمون جامع نوبت اول - آذر ۱۴۰۳',
      curr_total: 90,
      prev_total: 89,
      curr_math: 86,
      prev_math: 85,
      absences: 0,
      tardies: 1,
      discipline: 'عالی',
      homework_submitted: 30,
      homework_total: 30,
      homework_rate: 100,
      advisor_note: 'عملکرد باثبات و رضایت‌بخش در تمامی دروس.',
      created_at: '2024-12-15 10:00:00'
    }
  ];

  const transaction = db.transaction((records) => {
    for (const record of records) {
      insertStmt.run(record);
    }
  });

  transaction(initialRecords);
}

/**
 * DB Query Functions
 */
export const studentReportQueries = {
  upsertReport(report) {
    const stmt = db.prepare(`
      INSERT INTO student_reports (
        id, student_id, student_name, class_name, year, month, exam_period,
        curr_total, prev_total, curr_math, prev_math, absences, tardies,
        discipline, homework_submitted, homework_total, homework_rate,
        advisor_note
      ) VALUES (
        @id, @student_id, @student_name, @class_name, @year, @month, @exam_period,
        @curr_total, @prev_total, @curr_math, @prev_math, @absences, @tardies,
        @discipline, @homework_submitted, @homework_total, @homework_rate,
        @advisor_note
      )
      ON CONFLICT(id) DO UPDATE SET
        student_name = excluded.student_name,
        class_name = excluded.class_name,
        year = excluded.year,
        month = excluded.month,
        exam_period = excluded.exam_period,
        curr_total = excluded.curr_total,
        prev_total = excluded.prev_total,
        curr_math = excluded.curr_math,
        prev_math = excluded.prev_math,
        absences = excluded.absences,
        tardies = excluded.tardies,
        discipline = excluded.discipline,
        homework_submitted = excluded.homework_submitted,
        homework_total = excluded.homework_total,
        homework_rate = excluded.homework_rate,
        advisor_note = excluded.advisor_note
    `);
    return stmt.run(report);
  },

  upsertBatch(reports = []) {
    const tx = db.transaction((items) => {
      for (const item of items) {
        studentReportQueries.upsertReport(item);
      }
    });
    return tx(reports);
  },

  getStudentHistory(studentId) {
    const stmt = db.prepare(`
      SELECT * FROM student_reports
      WHERE student_id = ?
      ORDER BY year ASC, created_at ASC
    `);
    const records = stmt.all(studentId);
    // Sort chronologically using Persian school calendar months
    return records.sort((a, b) => {
      const yearComp = String(a.year).localeCompare(String(b.year));
      if (yearComp !== 0) return yearComp;
      return getMonthOrder(a.month) - getMonthOrder(b.month);
    });
  },

  getAllReports({ className, year, month } = {}) {
    let sql = 'SELECT * FROM student_reports WHERE 1=1';
    const params = [];

    if (className && className !== 'ALL') {
      sql += ' AND class_name = ?';
      params.push(className);
    }
    if (year && year !== 'ALL') {
      sql += ' AND year = ?';
      params.push(year);
    }
    if (month && month !== 'ALL') {
      sql += ' AND month = ?';
      params.push(month);
    }

    sql += ' ORDER BY year DESC, class_name ASC, student_name ASC';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  getUniquePeriods() {
    return db.prepare(`
      SELECT DISTINCT year, month 
      FROM student_reports 
      ORDER BY year DESC
    `).all();
  }
};

export default db;

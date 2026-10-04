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
  },

  clearAllReports() {
    return db.prepare('DELETE FROM student_reports').run();
  }
};

export default db;

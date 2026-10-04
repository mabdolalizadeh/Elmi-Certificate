import * as XLSX from 'xlsx';

export const EXCEL_HEADERS = {
  UUID: 'شناسه (UUID)',
  NAME: 'نام و نام خانوادگی',
  CLASS: 'کلاس',
  YEAR: 'سال',
  MONTH: 'ماه',
  TOTAL_SCORE: 'درصد کل',
  MATH_SCORE: 'درصد ریاضی',
  ABSENCES: 'غیبت',
  TARDIES: 'تاخیر',
  DISCIPLINE: 'وضعیت انضباط',
  HOMEWORK_SUBMITTED: 'تکالیف تحویل شده',
  HOMEWORK_TOTAL: 'کل تکالیف',
  PREV_TOTAL: 'درصد کل (قبلی)',
  CURR_TOTAL: 'درصد کل (فعلی)',
  PREV_MATH: 'درصد ریاضی (قبلی)',
  CURR_MATH: 'درصد ریاضی (فعلی)',
  ADVISOR_NOTE: 'نکته مشاورهای',
};

export const DYNAMIC_TEMPLATE_HEADERS = [
  'شناسه (UUID)',
  'نام و نام خانوادگی',
  'سال',
  'ماه',
  'درصد کل',
  'درصد ریاضی',
  'غیبت',
  'تاخیر',
  'وضعیت انضباط',
  'تکالیف تحویل شده',
  'کل تکالیف',
  'نکته مشاورهای',
];

export const SCHOOL_PERSIAN_MONTHS = [
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند',
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور'
];

export const getMonthOrderIndex = (mStr = '') => {
  const clean = String(mStr).replace(/\u200C/g, '').replace('ماه', '').trim();
  const idx = SCHOOL_PERSIAN_MONTHS.findIndex(m => m.includes(clean) || clean.includes(m));
  return idx !== -1 ? idx : 99;
};

// Normalize Persian text (remove invisible characters, handle نیم‌فاصله, etc.)
export const normalizeKey = (key = '') => {
  return String(key)
    .replace(/\u200C/g, '') // Zero-width non-joiner
    .replace(/\s+/g, ' ')
    .trim();
};

// Convert English numbers to Persian digits
export const toPersianDigits = (num) => {
  if (num === null || num === undefined || num === '') return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
};

export const SAMPLE_STUDENTS = [
  {
    id: 'std-001',
    name: 'علیرضا حسینی',
    className: 'هفتم ۱',
    year: '1403',
    month: 'آذر',
    absences: 1,
    tardies: 2,
    discipline: 'عالی',
    homeworkSubmitted: 28,
    homeworkTotal: 30,
    homeworkRate: 93,
    prevTotal: 82,
    currTotal: 91,
    prevMath: 78,
    currMath: 94,
    advisorNote: 'پیشرفت چشمگیر در درس ریاضی و استمرار عالی در ارسال تکالیف هفتگی. تمرکز بر تحلیل تست‌های زمان‌دار پیشنهاد می‌شود.',
    history: [
      { month: 'مهر', year: '1403', total: 75, math: 70 },
      { month: 'آبان', year: '1403', total: 82, math: 78 },
      { month: 'آذر', year: '1403', total: 91, math: 94 },
    ],
  },
  {
    id: 'std-002',
    name: 'محمد صادقی',
    className: 'هفتم ۱',
    year: '1403',
    month: 'آذر',
    absences: 4,
    tardies: 5,
    discipline: 'نیاز به توجه',
    homeworkSubmitted: 16,
    homeworkTotal: 30,
    homeworkRate: 53,
    prevTotal: 74,
    currTotal: 67,
    prevMath: 70,
    currMath: 58,
    advisorNote: 'افت در مباحث پایه ریاضی به همراه غیبت‌های مکرر. جلسه حضوری با اولیا جهت تنظیم برنامه مطالعاتی ضروری است.',
    history: [
      { month: 'مهر', year: '1403', total: 80, math: 76 },
      { month: 'آبان', year: '1403', total: 74, math: 70 },
      { month: 'آذر', year: '1403', total: 67, math: 58 },
    ],
  },
  {
    id: 'std-003',
    name: 'سارا رحیمی',
    className: 'هفتم ۲',
    year: '1403',
    month: 'آذر',
    absences: 0,
    tardies: 1,
    discipline: 'عالی',
    homeworkSubmitted: 30,
    homeworkTotal: 30,
    homeworkRate: 100,
    prevTotal: 89,
    currTotal: 90,
    prevMath: 85,
    currMath: 86,
    advisorNote: 'عملکرد باثبات و رضایت‌بخش در تمامی دروس. برنامه‌ریزی برای آزمون‌های آزمایشی مرحله بعدی توصیه می‌شود.',
    history: [
      { month: 'مهر', year: '1403', total: 84, math: 80 },
      { month: 'آبان', year: '1403', total: 89, math: 85 },
      { month: 'آذر', year: '1403', total: 90, math: 86 },
    ],
  },
  {
    id: 'std-004',
    name: 'امیررضا کریمی',
    className: 'هفتم ۱',
    year: '1403',
    month: 'آذر',
    absences: 2,
    tardies: 3,
    discipline: 'خوب',
    homeworkSubmitted: 24,
    homeworkTotal: 30,
    homeworkRate: 80,
    prevTotal: 78,
    currTotal: 84,
    prevMath: 65,
    currMath: 79,
    advisorNote: 'رشد مثبت در درصد ریاضی نسبت به دوره قبل. استمرار در حل تمرین‌های تشریحی باعث تثبیت نمرات خواهد شد.',
    history: [
      { month: 'مهر', year: '1403', total: 72, math: 60 },
      { month: 'آبان', year: '1403', total: 78, math: 65 },
      { month: 'آذر', year: '1403', total: 84, math: 79 },
    ],
  },
  {
    id: 'std-005',
    name: 'فاطمه نوری',
    className: 'هفتم ۲',
    year: '1403',
    month: 'آذر',
    absences: 1,
    tardies: 0,
    discipline: 'عالی',
    homeworkSubmitted: 27,
    homeworkTotal: 30,
    homeworkRate: 90,
    prevTotal: 85,
    currTotal: 81,
    prevMath: 80,
    currMath: 72,
    advisorNote: 'کاهش تمرکز در بخش محاسباتی درس ریاضی. مرور خلاصه درس‌ها و شرکت در کلاس رفع اشکال پیشنهاد می‌گردد.',
    history: [
      { month: 'مهر', year: '1403', total: 88, math: 85 },
      { month: 'آبان', year: '1403', total: 85, math: 80 },
      { month: 'آذر', year: '1403', total: 81, math: 72 },
    ],
  },
  {
    id: 'std-006',
    name: 'پارسا مرادی',
    className: 'هفتم ۳',
    year: '1403',
    month: 'آذر',
    absences: 6,
    tardies: 8,
    discipline: 'ضعیف',
    homeworkSubmitted: 11,
    homeworkTotal: 30,
    homeworkRate: 37,
    prevTotal: 62,
    currTotal: 54,
    prevMath: 55,
    currMath: 45,
    advisorNote: 'عدم ارسال به موقع تکالیف و غیبت‌های غیرموجه مکرر. نیاز فوری به پیگیری مشاوره تحصیلی و اخلاقی.',
    history: [
      { month: 'مهر', year: '1403', total: 68, math: 62 },
      { month: 'آبان', year: '1403', total: 62, math: 55 },
      { month: 'آذر', year: '1403', total: 54, math: 45 },
    ],
  },
];

/**
 * Trend Analysis:
 * Improvement: Diff > +2% => 'improvement' (پیشرفت)
 * Stable: -2% <= Diff <= +2% => 'stable' (ثابت)
 * Decline: Diff < -2% => 'decline' (پسرفت)
 */
export const calculateTrend = (curr = 0, prev = 0) => {
  const diff = Math.round((Number(curr) - Number(prev)) * 10) / 10;
  if (diff > 2) {
    return { status: 'improvement', label: 'پیشرفت', diff, color: '#10B981', bgColor: '#ECFDF5' };
  } else if (diff < -2) {
    return { status: 'decline', label: 'پسرفت', diff, color: '#F43F5E', bgColor: '#FFF1F2' };
  } else {
    return { status: 'stable', label: 'ثابت', diff, color: '#64748B', bgColor: '#F8FAFC' };
  }
};

/**
 * Discipline status color mapping
 */
export const getDisciplineStyle = (status = '') => {
  const normalized = String(status).trim();
  switch (normalized) {
    case 'عالی':
      return { label: 'عالی', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' };
    case 'خوب':
      return { label: 'خوب', color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' };
    case 'نیاز به توجه':
      return { label: 'نیاز به توجه', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
    case 'ضعیف':
      return { label: 'ضعیف', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' };
    default:
      return { label: normalized || 'نامشخص', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' };
  }
};

/**
 * Compute student analytics
 */
export const enrichStudentData = (rawStudent, index = 0) => {
  const submitted = Number(
    rawStudent[EXCEL_HEADERS.HOMEWORK_SUBMITTED] ??
    rawStudent['تکالیف تحویل شده'] ??
    0
  );
  const total = Number(
    rawStudent[EXCEL_HEADERS.HOMEWORK_TOTAL] ??
    rawStudent['کل تکالیف'] ??
    30
  ) || 1;
  const homeworkRate = Math.min(100, Math.max(0, Math.round((submitted / total) * 100)));

  // Scores
  let currTotal = Number(
    rawStudent[EXCEL_HEADERS.CURR_TOTAL] ??
    rawStudent['درصد کل (فعلی)'] ??
    rawStudent['درصد کل'] ??
    rawStudent.currTotal ??
    0
  );

  let prevTotal = Number(
    rawStudent[EXCEL_HEADERS.PREV_TOTAL] ??
    rawStudent['درصد کل (قبلی)'] ??
    rawStudent.prevTotal ??
    0
  );

  let currMath = Number(
    rawStudent[EXCEL_HEADERS.CURR_MATH] ??
    rawStudent['درصد ریاضی (فعلی)'] ??
    rawStudent['درصد ریاضی'] ??
    rawStudent.currMath ??
    0
  );

  let prevMath = Number(
    rawStudent[EXCEL_HEADERS.PREV_MATH] ??
    rawStudent['درصد ریاضی (قبلی)'] ??
    rawStudent.prevMath ??
    0
  );

  const overallTrend = calculateTrend(currTotal, prevTotal);
  const mathTrend = calculateTrend(currMath, prevMath);

  const year = String(
    rawStudent[EXCEL_HEADERS.YEAR] ||
    rawStudent['سال'] ||
    rawStudent['سال تحصیلی'] ||
    rawStudent.year ||
    '1403'
  ).trim();

  const month = String(
    rawStudent[EXCEL_HEADERS.MONTH] ||
    rawStudent['ماه'] ||
    rawStudent['ماه آزمون'] ||
    rawStudent.month ||
    'آبان'
  ).trim();

  // History timeline: if already present, sort chronologically; otherwise create 2-point history
  let history = rawStudent.history;
  if (!history || !Array.isArray(history) || history.length === 0) {
    if (prevTotal > 0 || prevMath > 0) {
      history = [
        { month: 'دوره قبل', year, total: prevTotal, math: prevMath },
        { month, year, total: currTotal, math: currMath },
      ];
    } else {
      history = [
        { month, year, total: currTotal, math: currMath }
      ];
    }
  }

  const id = String(
    rawStudent[EXCEL_HEADERS.UUID] ||
    rawStudent['شناسه (UUID)'] ||
    rawStudent['شناسه'] ||
    rawStudent.id ||
    `std-${String(index + 1).padStart(3, '0')}`
  ).trim();

  return {
    id,
    name: String(rawStudent[EXCEL_HEADERS.NAME] || rawStudent.name || 'بدون نام').trim(),
    className: String(rawStudent[EXCEL_HEADERS.CLASS] || rawStudent.className || 'هفتم ۱').trim(),
    year,
    month,
    absences: Number(rawStudent[EXCEL_HEADERS.ABSENCES] ?? rawStudent['غیبت'] ?? rawStudent['تعداد غیبت'] ?? rawStudent.absences ?? 0),
    tardies: Number(rawStudent[EXCEL_HEADERS.TARDIES] ?? rawStudent['تاخیر'] ?? rawStudent['تعداد تاخیر'] ?? rawStudent.tardies ?? 0),
    discipline: String(rawStudent[EXCEL_HEADERS.DISCIPLINE] || rawStudent.discipline || 'خوب').trim(),
    homeworkSubmitted: submitted,
    homeworkTotal: total,
    homeworkRate,
    prevTotal,
    currTotal,
    overallTrend,
    prevMath,
    currMath,
    mathTrend,
    advisorNote: String(rawStudent[EXCEL_HEADERS.ADVISOR_NOTE] || rawStudent['نکته مشاورهای'] || rawStudent.advisorNote || '').trim(),
    history,
    selected: true,
  };
};

/**
 * Generate and download an Excel template populated with:
 * 1. شناسه (UUID) (pre-filled)
 * 2. نام و نام خانوادگی (pre-filled)
 * 3. سال (pre-filled with selected year, e.g., 1403)
 * 4. ماه (pre-filled with selected month, e.g., آبان)
 * 5. درصد کل
 * 6. درصد ریاضی
 * 7. غیبت
 * 8. تاخیر
 * 9. وضعیت انضباط
 * 10. تکالیف تحویل شده
 * 11. کل تکالیف
 * 12. نکته مشاورهای
 */
export const downloadExcelTemplate = ({
  className = '',
  year = '1403',
  month = 'آبان',
  studentList = [],
} = {}) => {
  let rows = [];

  if (studentList && studentList.length > 0) {
    // If the user has defined/registered students, populate their UUID and Name with empty score fields
    rows = studentList.map((s, idx) => ({
      'شناسه (UUID)': s.id || `std-${String(idx + 1).padStart(3, '0')}`,
      'نام و نام خانوادگی': s.name || '',
      'سال': year,
      'ماه': month,
      'درصد کل': '',
      'درصد ریاضی': '',
      'غیبت': '',
      'تاخیر': '',
      'وضعیت انضباط': '',
      'تکالیف تحویل شده': '',
      'کل تکالیف': '',
      'نکته مشاورهای': '',
    }));
  } else {
    // Completely clean, empty starter template (15 blank rows) - ZERO mock students or fake scores
    rows = Array.from({ length: 15 }, () => ({
      'شناسه (UUID)': '',
      'نام و نام خانوادگی': '',
      'سال': year,
      'ماه': month,
      'درصد کل': '',
      'درصد ریاضی': '',
      'غیبت': '',
      'تاخیر': '',
      'وضعیت انضباط': '',
      'تکالیف تحویل شده': '',
      'کل تکالیف': '',
      'نکته مشاورهای': '',
    }));
  }

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: DYNAMIC_TEMPLATE_HEADERS,
  });

  // Set explicit, comfortable column widths
  worksheet['!cols'] = [
    { wch: 18 }, // شناسه (UUID)
    { wch: 24 }, // نام و نام خانوادگی
    { wch: 10 }, // سال
    { wch: 12 }, // ماه
    { wch: 14 }, // درصد کل
    { wch: 14 }, // درصد ریاضی
    { wch: 10 }, // غیبت
    { wch: 10 }, // تاخیر
    { wch: 16 }, // وضعیت انضباط
    { wch: 18 }, // تکالیف تحویل شده
    { wch: 12 }, // کل تکالیف
    { wch: 45 }, // نکته مشاورهای
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `کارنامه ${month} ${year}`);

  // Generate clean filename with selected month and year
  const safeFilename = className
    ? `قالب_کارنامه_${className.replace(/\s+/g, '_')}_${month}_${year}.xlsx`
    : `قالب_کارنامه_${month}_${year}.xlsx`;
  XLSX.writeFile(workbook, safeFilename);
};

/**
 * Parse uploaded Excel file, grouping by student to build longitudinal timelines
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          return reject(new Error('فایل اکسل انتخاب شده هیچ صفحه‌ای (Sheet) ندارد.'));
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          return reject(new Error('هیچ ردیف داده‌ای در فایل اکسل یافت نشد.'));
        }

        // Canonical mapping
        const canonicalHeaderMap = {
          'شناسه': 'شناسه (UUID)',
          'شناسه (UUID)': 'شناسه (UUID)',
          'uuid': 'شناسه (UUID)',
          'id': 'شناسه (UUID)',
          'نام و نام خانوادگی': 'نام و نام خانوادگی',
          'نام': 'نام و نام خانوادگی',
          'کلاس': 'کلاس',
          'سال': 'سال',
          'سال تحصیلی': 'سال',
          'ماه': 'ماه',
          'ماه آزمون': 'ماه',
          'درصد کل': 'درصد کل',
          'درصد کل (فعلی)': 'درصد کل (فعلی)',
          'درصد کل (قبلی)': 'درصد کل (قبلی)',
          'درصد ریاضی': 'درصد ریاضی',
          'درصد ریاضی (فعلی)': 'درصد ریاضی (فعلی)',
          'درصد ریاضی (قبلی)': 'درصد ریاضی (قبلی)',
          'غیبت': 'غیبت',
          'تعداد غیبت': 'غیبت',
          'تاخیر': 'تاخیر',
          'تعداد تاخیر': 'تاخیر',
          'وضعیت انضباط': 'وضعیت انضباط',
          'انضباط': 'وضعیت انضباط',
          'تکالیف تحویل شده': 'تکالیف تحویل شده',
          'کل تکالیف': 'کل تکالیف',
          'نکته مشاورهای': 'نکته مشاورهای',
          'نکته مشاور': 'نکته مشاورهای',
          'یادداشت مشاور': 'نکته مشاورهای',
        };

        const normalizedRows = rawRows.map((row) => {
          const res = {};
          Object.keys(row).forEach((key) => {
            const normKey = normalizeKey(key);
            const matchedKey = canonicalHeaderMap[normKey] || key;
            res[matchedKey] = row[key];
          });
          return res;
        });

        // Group rows by student (using ID or Name) to track longitudinal monthly timeline
        const studentGroups = new Map();
        normalizedRows.forEach((row, idx) => {
          const studentKey = String(row['شناسه (UUID)'] || row['نام و نام خانوادگی'] || `student-${idx}`).trim();
          if (!studentGroups.has(studentKey)) {
            studentGroups.set(studentKey, []);
          }
          studentGroups.get(studentKey).push(row);
        });

        const students = [];
        let sIdx = 0;
        studentGroups.forEach((rows) => {
          // Sort chronologically by year and school calendar month
          rows.sort((a, b) => {
            const yrA = String(a['سال'] || '1403');
            const yrB = String(b['سال'] || '1403');
            const yrComp = yrA.localeCompare(yrB);
            if (yrComp !== 0) return yrComp;
            return getMonthOrderIndex(a['ماه']) - getMonthOrderIndex(b['ماه']);
          });

          // History across all available exams
          const history = rows.map((r) => ({
            month: String(r['ماه'] || 'نامشخص').trim(),
            year: String(r['سال'] || '1403').trim(),
            total: Number(r['درصد کل'] ?? r['درصد کل (فعلی)'] ?? 0),
            math: Number(r['درصد ریاضی'] ?? r['درصد ریاضی (فعلی)'] ?? 0),
          }));

          // The latest row is the active/current exam
          const latestRow = rows[rows.length - 1];
          const prevRow = rows.length > 1 ? rows[rows.length - 2] : null;

          if (prevRow) {
            latestRow['درصد کل (قبلی)'] = Number(prevRow['درصد کل'] ?? prevRow['درصد کل (فعلی)'] ?? 0);
            latestRow['درصد ریاضی (قبلی)'] = Number(prevRow['درصد ریاضی'] ?? prevRow['درصد ریاضی (فعلی)'] ?? 0);
          }

          latestRow.history = history;
          students.push(enrichStudentData(latestRow, sIdx++));
        });

        resolve({ students, totalRows: students.length });
      } catch (err) {
        reject(new Error(`خطا در پردازش فایل اکسل: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('امکان خواندن فایل اکسل به دلیل خطای سیستمی وجود ندارد.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

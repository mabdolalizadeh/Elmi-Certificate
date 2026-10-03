import * as XLSX from 'xlsx';

export const EXCEL_HEADERS = {
  NAME: 'نام و نام خانوادگی',
  CLASS: 'کلاس',
  ABSENCES: 'تعداد غیبت',
  TARDIES: 'تعداد تاخیر',
  DISCIPLINE: 'وضعیت انضباط',
  HOMEWORK_SUBMITTED: 'تکالیف تحویل شده',
  HOMEWORK_TOTAL: 'کل تکالیف',
  PREV_TOTAL: 'درصد کل (قبلی)',
  CURR_TOTAL: 'درصد کل (فعلی)',
  PREV_MATH: 'درصد ریاضی (قبلی)',
  CURR_MATH: 'درصد ریاضی (فعلی)',
  ADVISOR_NOTE: 'نکته مشاورهای',
};

// Normalize Persian text (remove invisible characters, handle نیم‌فاصله, etc.)
export const normalizeKey = (key = '') => {
  return String(key)
    .replace(/\u200C/g, '') // Zero-width non-joiner
    .replace(/\s+/g, ' ')
    .trim();
};

export const SAMPLE_STUDENTS = [
  {
    [EXCEL_HEADERS.NAME]: 'علیرضا حسینی',
    [EXCEL_HEADERS.CLASS]: 'دهم ریاضی ۱',
    [EXCEL_HEADERS.ABSENCES]: 1,
    [EXCEL_HEADERS.TARDIES]: 2,
    [EXCEL_HEADERS.DISCIPLINE]: 'عالی',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 28,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 82,
    [EXCEL_HEADERS.CURR_TOTAL]: 91,
    [EXCEL_HEADERS.PREV_MATH]: 78,
    [EXCEL_HEADERS.CURR_MATH]: 94,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'پیشرفت چشمگیر در درس ریاضی و استمرار عالی در ارسال تکالیف هفتگی. تمرکز بر تحلیل تست‌های زمان‌دار پیشنهاد می‌شود.',
  },
  {
    [EXCEL_HEADERS.NAME]: 'محمد صادقی',
    [EXCEL_HEADERS.CLASS]: 'دهم ریاضی ۱',
    [EXCEL_HEADERS.ABSENCES]: 4,
    [EXCEL_HEADERS.TARDIES]: 5,
    [EXCEL_HEADERS.DISCIPLINE]: 'نیاز به توجه',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 16,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 74,
    [EXCEL_HEADERS.CURR_TOTAL]: 67,
    [EXCEL_HEADERS.PREV_MATH]: 70,
    [EXCEL_HEADERS.CURR_MATH]: 58,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'افت در مباحث پایه ریاضی به همراه غیبت‌های مکرر. جلسه حضوری با اولیا جهت تنظیم برنامه مطالعاتی ضروری است.',
  },
  {
    [EXCEL_HEADERS.NAME]: 'سارا رحیمی',
    [EXCEL_HEADERS.CLASS]: 'دهم تجربی ۲',
    [EXCEL_HEADERS.ABSENCES]: 0,
    [EXCEL_HEADERS.TARDIES]: 1,
    [EXCEL_HEADERS.DISCIPLINE]: 'عالی',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 30,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 89,
    [EXCEL_HEADERS.CURR_TOTAL]: 90,
    [EXCEL_HEADERS.PREV_MATH]: 85,
    [EXCEL_HEADERS.CURR_MATH]: 86,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'عملکرد باثبات و رضایت‌بخش در تمامی دروس. برنامه‌ریزی برای آزمون‌های آزمایشی مرحله بعدی توصیه می‌شود.',
  },
  {
    [EXCEL_HEADERS.NAME]: 'امیررضا کریمی',
    [EXCEL_HEADERS.CLASS]: 'دهم ریاضی ۱',
    [EXCEL_HEADERS.ABSENCES]: 2,
    [EXCEL_HEADERS.TARDIES]: 3,
    [EXCEL_HEADERS.DISCIPLINE]: 'خوب',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 24,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 78,
    [EXCEL_HEADERS.CURR_TOTAL]: 84,
    [EXCEL_HEADERS.PREV_MATH]: 65,
    [EXCEL_HEADERS.CURR_MATH]: 79,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'رشد مثبت در درصد ریاضی نسبت به دوره قبل. استمرار در حل تمرین‌های تشریحی باعث تثبیت نمرات خواهد شد.',
  },
  {
    [EXCEL_HEADERS.NAME]: 'فاطمه نوری',
    [EXCEL_HEADERS.CLASS]: 'دهم تجربی ۲',
    [EXCEL_HEADERS.ABSENCES]: 1,
    [EXCEL_HEADERS.TARDIES]: 0,
    [EXCEL_HEADERS.DISCIPLINE]: 'عالی',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 27,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 85,
    [EXCEL_HEADERS.CURR_TOTAL]: 81,
    [EXCEL_HEADERS.PREV_MATH]: 80,
    [EXCEL_HEADERS.CURR_MATH]: 72,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'کاهش تمرکز در بخش محاسباتی درس ریاضی. مرور خلاصه درس‌ها و شرکت در کلاس رفع اشکال پیشنهاد می‌گردد.',
  },
  {
    [EXCEL_HEADERS.NAME]: 'پارسا مرادی',
    [EXCEL_HEADERS.CLASS]: 'یازدهم ریاضی ۱',
    [EXCEL_HEADERS.ABSENCES]: 6,
    [EXCEL_HEADERS.TARDIES]: 8,
    [EXCEL_HEADERS.DISCIPLINE]: 'ضعیف',
    [EXCEL_HEADERS.HOMEWORK_SUBMITTED]: 11,
    [EXCEL_HEADERS.HOMEWORK_TOTAL]: 30,
    [EXCEL_HEADERS.PREV_TOTAL]: 62,
    [EXCEL_HEADERS.CURR_TOTAL]: 54,
    [EXCEL_HEADERS.PREV_MATH]: 55,
    [EXCEL_HEADERS.CURR_MATH]: 45,
    [EXCEL_HEADERS.ADVISOR_NOTE]: 'عدم ارسال به موقع تکالیف و غیبت‌های غیرموجه مکرر. نیاز فوری به پیگیری مشاوره تحصیلی و اخلاقی.',
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
  const submitted = Number(rawStudent[EXCEL_HEADERS.HOMEWORK_SUBMITTED]) || 0;
  const total = Number(rawStudent[EXCEL_HEADERS.HOMEWORK_TOTAL]) || 1;
  const homeworkRate = Math.min(100, Math.max(0, Math.round((submitted / (total || 1)) * 100)));

  const prevTotal = Number(rawStudent[EXCEL_HEADERS.PREV_TOTAL]) || 0;
  const currTotal = Number(rawStudent[EXCEL_HEADERS.CURR_TOTAL]) || 0;
  const overallTrend = calculateTrend(currTotal, prevTotal);

  const prevMath = Number(rawStudent[EXCEL_HEADERS.PREV_MATH]) || 0;
  const currMath = Number(rawStudent[EXCEL_HEADERS.CURR_MATH]) || 0;
  const mathTrend = calculateTrend(currMath, prevMath);

  return {
    id: `student-${index + 1}`,
    name: String(rawStudent[EXCEL_HEADERS.NAME] || 'بدون نام').trim(),
    className: String(rawStudent[EXCEL_HEADERS.CLASS] || 'عمومی').trim(),
    absences: Number(rawStudent[EXCEL_HEADERS.ABSENCES]) || 0,
    tardies: Number(rawStudent[EXCEL_HEADERS.TARDIES]) || 0,
    discipline: String(rawStudent[EXCEL_HEADERS.DISCIPLINE] || 'خوب').trim(),
    homeworkSubmitted: submitted,
    homeworkTotal: total,
    homeworkRate,
    prevTotal,
    currTotal,
    overallTrend,
    prevMath,
    currMath,
    mathTrend,
    advisorNote: String(rawStudent[EXCEL_HEADERS.ADVISOR_NOTE] || '').trim(),
    selected: true,
  };
};

/**
 * Generate and download an Excel template populated with sample rows
 */
export const downloadExcelTemplate = () => {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_STUDENTS, {
    header: Object.values(EXCEL_HEADERS),
  });

  // Set nice column widths
  worksheet['!cols'] = [
    { wch: 22 }, // نام و نام خانوادگی
    { wch: 15 }, // کلاس
    { wch: 12 }, // تعداد غیبت
    { wch: 12 }, // تعداد تاخیر
    { wch: 16 }, // وضعیت انضباط
    { wch: 16 }, // تکالیف تحویل شده
    { wch: 12 }, // کل تکالیف
    { wch: 16 }, // درصد کل (قبلی)
    { wch: 16 }, // درصد کل (فعلی)
    { wch: 18 }, // درصد ریاضی (قبلی)
    { wch: 18 }, // درصد ریاضی (فعلی)
    { wch: 45 }, // نکته مشاورهای
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'کارنامه دانش‌آموزان');

  // Generate file and trigger download
  XLSX.writeFile(workbook, 'قالب_اکسل_کارنامه_دانش‌آموزی.xlsx');
};

/**
 * Parse uploaded Excel file
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

        // Map column variations to canonical headers
        const headerMap = {};
        const firstRow = rawRows[0];
        const expectedHeaders = Object.entries(EXCEL_HEADERS);

        Object.keys(firstRow).forEach((rawKey) => {
          const normRaw = normalizeKey(rawKey);
          for (const [key, canonical] of expectedHeaders) {
            if (normRaw === normalizeKey(canonical)) {
              headerMap[rawKey] = canonical;
              break;
            }
          }
        });

        // Convert rows with canonical keys
        const students = rawRows.map((row, idx) => {
          const normalizedRow = {};
          Object.keys(row).forEach((key) => {
            const canonicalKey = headerMap[key] || key;
            normalizedRow[canonicalKey] = row[key];
          });
          return enrichStudentData(normalizedRow, idx);
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

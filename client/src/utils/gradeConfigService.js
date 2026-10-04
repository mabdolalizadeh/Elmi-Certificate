/**
 * Grade-Specific Customization Settings Engine
 * Manages branding, titles, logos, and watermarks per educational grade / class.
 */

export const DEFAULT_GRADE_CONFIG = {
  title: 'مجتمع آموزشی و دبیرستان نمونه رشد',
  subtitle: 'کارنامه رسمی عملکرد تحصیلی، رفتار کلاسی و تحلیل رشد مستمر دانش‌آموز',
  examPeriod: 'سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم',
  logoUrl: '/logo.svg', // base64 or image URL
  logoAlignment: 'right', // 'right' | 'center' | 'left'
  logoSize: 54, // in px (36 to 80)
  watermark: {
    enabled: false,
    type: 'text', // 'text' | 'logo'
    text: 'دبیرستان رشد',
    logoUrl: '/logo.svg',
    opacity: 0.08, // 0.05 to 0.30
    rotation: -30, // degrees (-45 to 45)
  },
};

const STORAGE_KEY = 'elmi_grade_customization_configs_v1';

/**
 * Extract broad grade from class name (e.g. "هفتم ۱" -> "پایه هفتم")
 */
export const detectGradeFromClassName = (className = '') => {
  const norm = String(className).trim();
  if (norm.includes('هفتم')) return 'پایه هفتم';
  if (norm.includes('هشتم')) return 'پایه هشتم';
  if (norm.includes('نهم')) return 'پایه نهم';
  if (norm.includes('دهم')) return 'پایه دهم';
  if (norm.includes('یازدهم')) return 'پایه یازدهم';
  if (norm.includes('دوازدهم')) return 'پایه دوازدهم';
  return norm || 'پایه عمومی';
};

/**
 * Extract all unique grades and classes from a student dataset
 */
export const extractUniqueScopes = (students = []) => {
  const grades = new Set();
  const classes = new Set();

  students.forEach((s) => {
    if (s.className) {
      classes.add(s.className);
      grades.add(detectGradeFromClassName(s.className));
    }
  });

  return {
    grades: Array.from(grades),
    classes: Array.from(classes),
  };
};

/**
 * Load all grade configs from localStorage with fallback to default
 */
export const loadGradeConfigs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        DEFAULT: { ...DEFAULT_GRADE_CONFIG },
        'پایه هفتم': {
          ...DEFAULT_GRADE_CONFIG,
          title: 'مجتمع آموزشی و دبیرستان نمونه رشد',
          subtitle: 'کارنامه جامع دوره اول متوسطه - پایه هفتم',
          watermark: {
            enabled: true,
            type: 'text',
            text: 'دبیرستان رشد • پایه هفتم',
            opacity: 0.07,
            rotation: -30,
          },
        },
      };
    }
    const parsed = JSON.parse(raw);
    if (!parsed.DEFAULT) {
      parsed.DEFAULT = { ...DEFAULT_GRADE_CONFIG };
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load grade configs from localStorage:', err);
    return { DEFAULT: { ...DEFAULT_GRADE_CONFIG } };
  }
};

/**
 * Save configs map to localStorage
 */
export const saveGradeConfigs = (configs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (err) {
    console.error('Failed to save grade configs to localStorage:', err);
  }
};

/**
 * Resolve effective config for a given student:
 * 1. Checks specific class name (e.g. "هفتم ۱")
 * 2. Checks detected grade (e.g. "پایه هفتم")
 * 3. Falls back to "DEFAULT"
 */
export const resolveConfigForStudent = (student, configs = {}) => {
  const fallback = configs.DEFAULT || DEFAULT_GRADE_CONFIG;
  if (!student) return fallback;

  // 1. Check exact class
  if (student.className && configs[student.className]) {
    return { ...fallback, ...configs[student.className] };
  }

  // 2. Check grade
  const grade = detectGradeFromClassName(student.className);
  if (grade && configs[grade]) {
    return { ...fallback, ...configs[grade] };
  }

  return fallback;
};

/**
 * Export current configs to JSON download
 */
export const exportConfigsToJson = (configs) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(configs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `تنظیمات_کارنامه_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Import configs from JSON file
 */
export const importConfigsFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (typeof json !== 'object' || json === null) {
          throw new Error('فرمت فایل تنظیمات نامعتبر است.');
        }
        resolve(json);
      } catch (err) {
        reject(new Error(`خطا در بازخوانی فایل JSON: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsText(file);
  });
};

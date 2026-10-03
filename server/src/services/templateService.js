/**
 * Generates standalone, self-contained HTML for multi-page A4 Landscape PDF.
 * Each student card is wrapped in a container with strict page breaks.
 */
export function generatePdfHtml(students = [], visibility = {}) {
  const vis = {
    academic: visibility.academic !== false,
    attendance: visibility.attendance !== false,
    discipline: visibility.discipline !== false,
    homework: visibility.homework !== false,
    advisor: visibility.advisor !== false,
  };

  const getDisciplineDetails = (status = '') => {
    const s = String(status).trim();
    switch (s) {
      case 'عالی':
        return { label: 'عالی', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' };
      case 'خوب':
        return { label: 'خوب', color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' };
      case 'نیاز به توجه':
        return { label: 'نیاز به توجه', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
      case 'ضعیف':
        return { label: 'ضعیف', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' };
      default:
        return { label: s || 'نامشخص', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' };
    }
  };

  const renderTrendBadge = (trend) => {
    if (!trend) return '';
    const diffSign = trend.diff > 0 ? `+${trend.diff}%` : `${trend.diff}%`;
    const arrowSymbol = trend.status === 'improvement' ? '▲' : trend.status === 'decline' ? '▼' : '▬';

    return `
      <div style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; background:${trend.bgColor}; color:${trend.color}; border:1px solid ${trend.color}40; font-size:12px; font-weight:700;">
        <span>${arrowSymbol}</span>
        <span>${trend.label}</span>
        <span style="direction:ltr; font-size:11px;">(${diffSign})</span>
      </div>
    `;
  };

  const studentPages = students
    .map((student, idx) => {
      const discipline = getDisciplineDetails(student.discipline);
      const isLast = idx === students.length - 1;

      return `
      <div class="page-container ${isLast ? 'last-page' : ''}">
        <div class="card-wrapper">
          <!-- Top decorative gradient strip -->
          <div class="card-strip"></div>

          <!-- HEADER -->
          <div class="card-header">
            <div class="school-info">
              <div class="school-icon">🎓</div>
              <div>
                <div class="school-name">مجتمع آموزشی و دبیرستان نمونه رشد</div>
                <div class="school-sub">کارنامه عملکرد تحصیلی، انضباطی و تحلیل رشد مستمر</div>
              </div>
            </div>

            <div class="student-info">
              <div class="report-meta">سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم</div>
              <div class="student-meta">
                <span class="student-name">${student.name || 'دانش‌آموز'}</span>
                <span class="class-badge">${student.className || 'عمومی'}</span>
              </div>
            </div>
          </div>

          <!-- 3-COLUMN BODY -->
          <div class="card-body">
            <!-- RIGHT COLUMN: ACADEMIC -->
            ${
              vis.academic
                ? `
            <div class="column-card">
              <div class="column-title">
                <span>📚</span>
                <span>تحلیل وضعیت آموزشی و روند نمرات</span>
              </div>

              <!-- Total Score -->
              <div class="metric-box">
                <div class="metric-head">
                  <span class="metric-label">میانگین درصد کل دروس</span>
                  ${renderTrendBadge(student.overallTrend)}
                </div>
                <div class="bar-group">
                  <div class="bar-info">
                    <span>دوره فعلی</span>
                    <span style="font-weight:800; color:#4F46E5;">%${student.currTotal}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill total-curr" style="width: ${Math.min(100, Math.max(0, student.currTotal))}%;"></div>
                  </div>
                </div>
                <div class="bar-group" style="margin-top:8px;">
                  <div class="bar-info">
                    <span>دوره قبلی</span>
                    <span style="font-weight:700; color:#64748B;">%${student.prevTotal}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill total-prev" style="width: ${Math.min(100, Math.max(0, student.prevTotal))}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Math Score -->
              <div class="metric-box" style="margin-top:10px;">
                <div class="metric-head">
                  <span class="metric-label">عملکرد تخصصی درس ریاضی</span>
                  ${renderTrendBadge(student.mathTrend)}
                </div>
                <div class="bar-group">
                  <div class="bar-info">
                    <span>درصد فعلی ریاضی</span>
                    <span style="font-weight:800; color:#0284C7;">%${student.currMath}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill math-curr" style="width: ${Math.min(100, Math.max(0, student.currMath))}%;"></div>
                  </div>
                </div>
                <div class="bar-group" style="margin-top:8px;">
                  <div class="bar-info">
                    <span>درصد قبلی ریاضی</span>
                    <span style="font-weight:700; color:#64748B;">%${student.prevMath}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill math-prev" style="width: ${Math.min(100, Math.max(0, student.prevMath))}%;"></div>
                  </div>
                </div>
              </div>
            </div>
            `
                : ''
            }

            <!-- CENTER COLUMN: ATTENDANCE & DISCIPLINE -->
            <div class="column-card">
              <div class="column-title">
                <span>🛡️</span>
                <span>انضباط، تکالیف و حضور و غیاب</span>
              </div>

              ${
                vis.attendance
                  ? `
              <div class="attendance-grid">
                <div class="att-card">
                  <div class="att-title">غیبت‌ها</div>
                  <div class="att-value">${student.absences} <span class="att-unit">روز</span></div>
                </div>
                <div class="att-card">
                  <div class="att-title">تاخیرها</div>
                  <div class="att-value">${student.tardies} <span class="att-unit">مورد</span></div>
                </div>
              </div>
              `
                  : ''
              }

              ${
                vis.discipline
                  ? `
              <div class="metric-box" style="margin-top:10px;">
                <div class="discipline-label">ارزیابی انضباط و رفتار کلاسی</div>
                <div class="discipline-status" style="background:${discipline.bg}; color:${discipline.color}; border:1px solid ${discipline.border};">
                  وضعیت: ${discipline.label}
                </div>
              </div>
              `
                  : ''
              }

              ${
                vis.homework
                  ? `
              <div class="metric-box" style="margin-top:10px;">
                <div class="metric-head">
                  <span class="metric-label">نرخ تحویل تکالیف</span>
                  <span style="font-weight:800; color:#4F46E5; font-size:13px;">${student.homeworkSubmitted} از ${student.homeworkTotal} (%${student.homeworkRate})</span>
                </div>
                <div class="progress-track" style="margin-top:8px; height:10px;">
                  <div class="progress-fill" style="width:${student.homeworkRate}%; background:${
                      student.homeworkRate >= 80 ? '#10B981' : student.homeworkRate >= 60 ? '#F59E0B' : '#F43F5E'
                    };"></div>
                </div>
              </div>
              `
                  : ''
              }
            </div>

            <!-- LEFT COLUMN: ADVISOR & STAMPS -->
            ${
              vis.advisor
                ? `
            <div class="column-card">
              <div class="column-title">
                <span>💬</span>
                <span>نظر و راهکار مشاوره تحصیلی</span>
              </div>

              <div class="advisor-quote">
                «${
                  student.advisorNote ||
                  'ارزیابی مستمر دانش‌آموز نشان‌دهنده نیاز به تمرکز بیشتر بر تعهد به برنامه‌ریزی هفتگی و تقویت دروس تخصصی است.'
                }»
              </div>

              <div class="stamps-box">
                <div class="stamp-item">
                  <div class="stamp-label">مهر و امضای مشاور</div>
                  <div class="stamp-placeholder">مهر رسمی</div>
                </div>
                <div class="stamp-item">
                  <div class="stamp-label">امضای معاونت آموزشی</div>
                  <div class="stamp-placeholder">تایید نهایی</div>
                </div>
              </div>
            </div>
            `
                : ''
            }
          </div>

          <!-- FOOTER -->
          <div class="card-footer">
            <div>کد یکتای پرونده: ELMI-${(student.id || 'STD01').toUpperCase()} • ثبت شده در سامانه یکپارچه رشد</div>
            <div>تاریخ صدور: مهرماه ۱۴۰۵ • صفحه ۱ از ۱</div>
          </div>
        </div>
      </div>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>کارنامه افقی دانش‌آموزان</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Vazirmatn', sans-serif;
      direction: rtl;
      background: #FFFFFF;
      color: #0F172A;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-container {
      width: 297mm;
      height: 210mm;
      padding: 12mm 15mm;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      background: #FFFFFF;
    }
    .page-container.last-page {
      page-break-after: avoid;
      break-after: avoid;
    }
    .card-wrapper {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .card-strip {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #4F46E5 0%, #0EA5E9 50%, #10B981 100%);
    }
    /* Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .school-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .school-icon {
      width: 44px;
      height: 44px;
      background: #EEF2FF;
      border: 1.5px solid #C7D2FE;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .school-name {
      font-size: 18px;
      font-weight: 800;
      color: #1E1B4B;
    }
    .school-sub {
      font-size: 12px;
      color: #64748B;
      margin-top: 2px;
    }
    .student-info {
      text-align: left;
    }
    .report-meta {
      font-size: 11px;
      color: #94A3B8;
    }
    .student-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    .student-name {
      font-size: 17px;
      font-weight: 800;
      color: #0F172A;
    }
    .class-badge {
      background: #EEF2FF;
      color: #4338CA;
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid #C7D2FE;
    }
    /* Body & Columns */
    .card-body {
      display: flex;
      gap: 14px;
      flex: 1;
      align-items: stretch;
    }
    .column-card {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .column-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 800;
      color: #1E293B;
      margin-bottom: 10px;
    }
    .metric-box {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 12px;
    }
    .metric-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .metric-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }
    .bar-group {
      margin-bottom: 4px;
    }
    .bar-info {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748B;
      margin-bottom: 3px;
    }
    .progress-track {
      width: 100%;
      height: 7px;
      background: #F1F5F9;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
    }
    .total-curr { background: #4F46E5; }
    .total-prev { background: #94A3B8; }
    .math-curr { background: #0284C7; }
    .math-prev { background: #94A3B8; }
    /* Attendance */
    .attendance-grid {
      display: flex;
      gap: 8px;
    }
    .att-card {
      flex: 1;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 8px;
      text-align: center;
    }
    .att-title {
      font-size: 11px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 4px;
    }
    .att-value {
      font-size: 18px;
      font-weight: 800;
      color: #1E293B;
    }
    .att-unit {
      font-size: 11px;
      color: #94A3B8;
      font-weight: 400;
    }
    .discipline-label {
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .discipline-status {
      text-align: center;
      padding: 6px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 800;
    }
    /* Advisor */
    .advisor-quote {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-right: 4px solid #F59E0B;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 11.5px;
      line-height: 1.6;
      color: #334155;
      font-style: italic;
      flex: 1;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .stamps-box {
      background: #FFFFFF;
      border: 1px dashed #CBD5E1;
      border-radius: 10px;
      padding: 8px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .stamp-label {
      font-size: 10.5px;
      color: #94A3B8;
      margin-bottom: 4px;
    }
    .stamp-placeholder {
      font-size: 11px;
      color: #CBD5E1;
      border: 1px dashed #E2E8F0;
      border-radius: 6px;
      padding: 4px 10px;
    }
    /* Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #F1F5F9;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 10.5px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  ${studentPages}
</body>
</html>
  `;
}

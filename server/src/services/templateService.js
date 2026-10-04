/**
 * Generates standalone, self-contained HTML for multi-page A4 Landscape PDF.
 * Calibrated for zero dead space, rich visual charts, and exact print proportions.
 */
const toPersianDigits = (num) => {
  if (num === null || num === undefined || num === '') return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
};

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
        return { label: 'عالی', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0', lvl: 4 };
      case 'خوب':
        return { label: 'خوب', color: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE', lvl: 3 };
      case 'نیاز به توجه':
        return { label: 'نیاز به توجه', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', lvl: 2 };
      case 'ضعیف':
        return { label: 'ضعیف', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', lvl: 1 };
      default:
        return { label: s || 'نامشخص', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1', lvl: 3 };
    }
  };

  const renderTrendBadge = (trend) => {
    if (!trend) return '';
    const diffAbs = Math.abs(trend.diff);
    const diffSign = trend.diff > 0 ? `+${toPersianDigits(diffAbs)}٪` : trend.diff < 0 ? `-${toPersianDigits(diffAbs)}٪` : `${toPersianDigits(0)}٪`;
    const arrowSymbol = trend.status === 'improvement' ? '▲' : trend.status === 'decline' ? '▼' : '▬';

    return `
      <div style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; background:${trend.bgColor}; color:${trend.color}; border:1px solid ${trend.color}40; font-size:11px; font-weight:800;">
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

      // Homework gauge calculations
      const hwRate = Math.min(100, Math.max(0, student.homeworkRate || 0));
      const hwColor = hwRate >= 80 ? '#10B981' : hwRate >= 60 ? '#F59E0B' : '#F43F5E';
      const hwColorEnd = hwRate >= 80 ? '#059669' : hwRate >= 60 ? '#D97706' : '#DC2626';
      const archLength = 169.65;
      const strokeOffset = archLength - (archLength * hwRate) / 100;

      // 4 Discipline Levels
      const disciplineLevels = [
        { label: 'ضعیف', lvl: 1, color: '#EF4444', bg: '#FEE2E2', border: '#FCA5A5' },
        { label: 'نیاز به توجه', lvl: 2, color: '#F59E0B', bg: '#FEF3C7', border: '#FCD34D' },
        { label: 'خوب', lvl: 3, color: '#3B82F6', bg: '#DBEAFE', border: '#93C5FD' },
        { label: 'عالی', lvl: 4, color: '#10B981', bg: '#D1FAE5', border: '#6EE7B7' },
      ];

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
                <div class="school-name">
                  <span>مجتمع آموزشی و دبیرستان نمونه رشد</span>
                  <span class="grade-pill">پایه هفتم</span>
                </div>
                <div class="school-sub">کارنامه رسمی عملکرد تحصیلی، رفتار کلاسی و تحلیل رشد مستمر دانش‌آموز</div>
              </div>
            </div>

            <div class="student-info">
              <div class="report-meta">سال تحصیلی ۱۴۰۵-۱۴۰۴ • نوبت دوم</div>
              <div class="student-meta">
                <span class="student-name">${student.name || 'دانش‌آموز'}</span>
                <span class="class-badge">کلاس ${student.className || 'عمومی'}</span>
              </div>
            </div>
          </div>

          <!-- 3-COLUMN BODY (ZERO DEAD SPACE) -->
          <div class="card-body">

            <!-- RIGHT COLUMN: ACADEMIC (BULLET TARGET CHARTS) -->
            ${
              vis.academic
                ? `
            <div class="column-card">
              <div class="column-title">
                <span class="col-icon">📚</span>
                <span>تحلیل مقایسه‌ای نمرات و آزمون‌ها</span>
              </div>

              <!-- Total Score Bullet Card -->
              <div class="metric-box">
                <div class="metric-head">
                  <span class="metric-label">درصد آزمون جامع (میانگین کل)</span>
                  ${renderTrendBadge(student.overallTrend)}
                </div>
                <div class="score-row">
                  <span class="curr-score" style="color:#4F46E5;">٪${toPersianDigits(student.currTotal)}</span>
                  <span class="prev-score">دوره قبلی: ٪${toPersianDigits(student.prevTotal)}</span>
                </div>

                <!-- Stacked Bullet Chart -->
                <div class="bullet-track-wrap">
                  <div class="bullet-track">
                    <div class="bullet-target" style="width: ${Math.min(100, Math.max(0, student.prevTotal))}%;"></div>
                    <div class="bullet-actual" style="width: ${Math.min(100, Math.max(0, student.currTotal))}%; background: linear-gradient(90deg, #4338CA, #4F46E5);"></div>
                    <div class="bullet-tick" style="right: 25%;"></div>
                    <div class="bullet-tick" style="right: 50%;"></div>
                    <div class="bullet-tick" style="right: 75%;"></div>
                  </div>
                  <div class="bullet-legend">
                    <div class="legend-items">
                      <span class="legend-item"><span class="dot" style="background:#4F46E5;"></span>آزمون فعلی</span>
                      <span class="legend-item"><span class="dot" style="background:rgba(99, 102, 241, 0.35); border-left:2px solid #6366F1;"></span>تارگت / قبلی</span>
                    </div>
                    <span class="scale-label">مقیاس: ۰ تا ۱۰۰</span>
                  </div>
                </div>
              </div>

              <!-- Math Score Bullet Card -->
              <div class="metric-box" style="margin-top:10px;">
                <div class="metric-head">
                  <span class="metric-label">درصد درس ریاضی (تخصصی)</span>
                  ${renderTrendBadge(student.mathTrend)}
                </div>
                <div class="score-row">
                  <span class="curr-score" style="color:#0284C7;">٪${toPersianDigits(student.currMath)}</span>
                  <span class="prev-score">دوره قبلی: ٪${toPersianDigits(student.prevMath)}</span>
                </div>

                <!-- Stacked Bullet Chart -->
                <div class="bullet-track-wrap">
                  <div class="bullet-track">
                    <div class="bullet-target" style="width: ${Math.min(100, Math.max(0, student.prevMath))}%; background:rgba(2, 132, 199, 0.16); border-left-color:#0284C7;"></div>
                    <div class="bullet-actual" style="width: ${Math.min(100, Math.max(0, student.currMath))}%; background: linear-gradient(90deg, #0369A1, #0EA5E9);"></div>
                    <div class="bullet-tick" style="right: 25%;"></div>
                    <div class="bullet-tick" style="right: 50%;"></div>
                    <div class="bullet-tick" style="right: 75%;"></div>
                  </div>
                  <div class="bullet-legend">
                    <div class="legend-items">
                      <span class="legend-item"><span class="dot" style="background:#0284C7;"></span>آزمون فعلی</span>
                      <span class="legend-item"><span class="dot" style="background:rgba(2, 132, 199, 0.35); border-left:2px solid #0284C7;"></span>تارگت / قبلی</span>
                    </div>
                    <span class="scale-label">مقیاس: ۰ تا ۱۰۰</span>
                  </div>
                </div>
              </div>
            </div>
            `
                : ''
            }

            <!-- CENTER COLUMN: BEHAVIORAL & RADIAL HOMEWORK GAUGE -->
            <div class="column-card">
              <div class="column-title">
                <span class="col-icon">🛡️</span>
                <span>انضباط، تکالیف و شاخص‌های حضور</span>
              </div>

              <!-- Attendance Metrics -->
              ${
                vis.attendance
                  ? `
              <div class="attendance-grid">
                <div class="att-card" style="border: 1.5px solid #FEE2E2;">
                  <div class="att-title" style="color:#DC2626;">📅 میزان غیبت‌ها</div>
                  <div class="att-value">${toPersianDigits(student.absences)} <span class="att-unit">روز</span></div>
                </div>
                <div class="att-card" style="border: 1.5px solid #FEF3C7;">
                  <div class="att-title" style="color:#D97706;">⏰ تعداد تاخیرها</div>
                  <div class="att-value">${toPersianDigits(student.tardies)} <span class="att-unit">مورد</span></div>
                </div>
              </div>
              `
                  : ''
              }

              <!-- 4-Segment Qualitative Discipline Meter -->
              ${
                vis.discipline
                  ? `
              <div class="metric-box" style="margin-top:10px;">
                <div class="metric-head" style="margin-bottom:6px;">
                  <span class="metric-label">درجه‌بندی انضباط کلاسی</span>
                  <span class="disp-pill" style="background:${discipline.bg}; color:${discipline.color}; border:1px solid ${discipline.border};">رتبه: ${discipline.label}</span>
                </div>
                <div class="discipline-segmented-bar">
                  ${disciplineLevels
                    .map((seg) => {
                      const isLit = seg.lvl <= discipline.lvl;
                      const isCurrent = seg.lvl === discipline.lvl;
                      const bg = isCurrent ? seg.color : isLit ? seg.bg : '#F1F5F9';
                      const color = isCurrent ? '#FFFFFF' : isLit ? seg.color : '#94A3B8';
                      const border = isCurrent ? `1.5px solid ${seg.color}` : isLit ? `1.5px solid ${seg.border}` : '1.5px solid #E2E8F0';
                      return `<div class="disp-segment" style="background:${bg}; color:${color}; border:${border}; font-weight:${isCurrent ? '900' : '700'};">${seg.label}</div>`;
                    })
                    .join('')}
                </div>
              </div>
              `
                  : ''
              }

              <!-- Semi-Donut / Radial Homework Gauge -->
              ${
                vis.homework
                  ? `
              <div class="metric-box" style="margin-top:10px; display:flex; flex-direction:column; align-items:center;">
                <div class="metric-head" style="width:100%; margin-bottom:2px;">
                  <span class="metric-label">شاخص تحویل تکالیف آموزشی</span>
                  <span style="font-size:11px; font-weight:800; color:${hwColor};">${hwRate >= 80 ? 'بسیار مطلوب' : hwRate >= 60 ? 'متوسط' : 'نیاز به پیگیری'}</span>
                </div>

                <div class="radial-gauge-box">
                  <svg viewBox="0 0 140 85" style="width:100%; overflow:visible;">
                    <defs>
                      <linearGradient id="hwGrad_${idx}" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="${hwColor}" />
                        <stop offset="100%" stop-color="${hwColorEnd}" />
                      </linearGradient>
                    </defs>
                    <path d="M 16 72 A 54 54 0 0 1 124 72" fill="none" stroke="#F1F5F9" stroke-width="13" stroke-linecap="round" />
                    <path d="M 16 72 A 54 54 0 0 1 124 72" fill="none" stroke="url(#hwGrad_${idx})" stroke-width="13" stroke-linecap="round" stroke-dasharray="${archLength}" stroke-dashoffset="${strokeOffset}" />
                    <text x="70" y="64" text-anchor="middle" fill="#1E1B4B" font-size="22" font-weight="900" font-family="Vazirmatn, sans-serif">٪${toPersianDigits(hwRate)}</text>
                  </svg>
                  <div class="gauge-subtext">${toPersianDigits(student.homeworkSubmitted)} از ${toPersianDigits(student.homeworkTotal)} تکلیف تحویل شده</div>
                </div>
              </div>
              `
                  : ''
              }
            </div>

            <!-- LEFT COLUMN: COMPACT ADVISOR NOTE & EXPANDED SIGNATURES (NO STAMP) -->
            ${
              vis.advisor
                ? `
            <div class="column-card">
              <div class="column-title">
                <span class="col-icon">💬</span>
                <span>توصیه مشاور و تایید نهایی</span>
              </div>

              <!-- Compact Advisor Note -->
              <div class="advisor-compact-card">
                <div class="advisor-compact-head">
                  <span class="advisor-tag">نظر کارشناسی مشاور تحصیلی:</span>
                  <span class="advisor-badge">راهبرد دوره بعدی</span>
                </div>
                <div class="advisor-text">
                  «${
                    student.advisorNote ||
                    'ارزیابی مستمر دانش‌آموز نشان‌دهنده نیاز به تمرکز بیشتر بر تعهد به برنامه‌ریزی هفتگی و تقویت دروس تخصصی است.'
                  }»
                </div>
              </div>

              <!-- Expanded Formal Signature Area (NO STAMP) -->
              <div class="expanded-signature-box">
                <div class="sig-status-row">
                  <span class="sig-status-title">✔️ تاییدیه رسمی شورای آموزشی مدرسه</span>
                  <span class="sig-status-date">ثبت قطعی: مهرماه ۱۴۰۵</span>
                </div>

                <div class="sig-zones">
                  <!-- Counselor Signature -->
                  <div class="sig-zone-item">
                    <div>
                      <div class="sig-role">امضای مشاور تحصیلی پایه</div>
                      <div class="sig-school">مجتمع آموزشی رشد</div>
                    </div>
                    <svg viewBox="0 0 160 45" style="width:115px; height:32px;">
                      <path d="M 12 32 C 26 14, 38 38, 52 18 C 66 6, 76 34, 94 16 C 112 4, 122 40, 146 22 M 30 28 Q 85 26 140 20" fill="none" stroke="#3730A3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>

                  <!-- Principal Signature -->
                  <div class="sig-zone-item">
                    <div>
                      <div class="sig-role">امضای مدیریت آموزشگاه</div>
                      <div class="sig-school">تایید نهایی و صدور کارنامه</div>
                    </div>
                    <svg viewBox="0 0 160 45" style="width:115px; height:32px;">
                      <path d="M 15 26 C 30 6, 44 38, 62 16 C 76 2, 88 36, 108 12 C 122 2, 136 30, 150 18 M 22 36 Q 82 30 144 26" fill="none" stroke="#1E1B4B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>

                <div class="sig-notice">کارنامه معتبر بدون نیاز به مهر فیزیکی دارای کد پیگیری یکپارچه است</div>
              </div>
            </div>
            `
                : ''
            }

          </div>

          <!-- FOOTER -->
          <div class="card-footer">
            <div>کد یکتای پرونده: ELMI-${toPersianDigits((student.id || 'STD01').replace('student-', ''))} • ثبت شده در سامانه یکپارچه رشد</div>
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
      font-feature-settings: "ss01" 1;
    }
    .page-container {
      width: 297mm;
      height: 210mm;
      padding: 10mm 14mm;
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
      padding: 14px 18px;
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
      background: linear-gradient(90deg, #312E81 0%, #4F46E5 25%, #F59E0B 50%, #10B981 75%, #059669 100%);
    }
    /* Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .school-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .school-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #1E1B4B, #3730A3);
      color: #FBBF24;
      border: 1.5px solid #E0E7FF;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .school-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 17px;
      font-weight: 900;
      color: #1E1B4B;
    }
    .grade-pill {
      font-size: 11px;
      font-weight: 800;
      color: #4338CA;
      background: #EEF2FF;
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid #C7D2FE;
    }
    .school-sub {
      font-size: 11.5px;
      color: #64748B;
      margin-top: 2px;
    }
    .student-info {
      text-align: left;
      background: #F8FAFC;
      padding: 6px 14px;
      border-radius: 10px;
      border: 1px solid #E2E8F0;
    }
    .report-meta {
      font-size: 10.5px;
      color: #94A3B8;
      font-weight: 600;
    }
    .student-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 2px;
    }
    .student-name {
      font-size: 16px;
      font-weight: 900;
      color: #0F172A;
    }
    .class-badge {
      background: #4F46E5;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }
    /* Body & Columns */
    .card-body {
      display: flex;
      gap: 12px;
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
      gap: 10px;
    }
    .column-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 900;
      color: #1E293B;
    }
    .col-icon {
      font-size: 15px;
    }
    .metric-box {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .metric-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .metric-label {
      font-size: 12px;
      font-weight: 800;
      color: #1E293B;
    }
    .score-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 6px;
    }
    .curr-score {
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
    }
    .prev-score {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
    }
    /* Bullet Chart */
    .bullet-track-wrap {
      width: 100%;
    }
    .bullet-track {
      position: relative;
      width: 100%;
      height: 22px;
      background: #F1F5F9;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }
    .bullet-target {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      background: rgba(99, 102, 241, 0.16);
      border-left: 2.5px solid #6366F1;
    }
    .bullet-actual {
      position: absolute;
      top: 5px;
      right: 0;
      height: 12px;
      border-radius: 0 3px 3px 0;
      z-index: 2;
    }
    .bullet-tick {
      position: absolute;
      top: 0;
      width: 1px;
      height: 100%;
      background: rgba(148, 163, 184, 0.35);
      z-index: 1;
    }
    .bullet-legend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
      font-size: 10px;
    }
    .legend-items {
      display: flex;
      gap: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #475569;
      font-weight: 600;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      display: inline-block;
    }
    .scale-label {
      color: #94A3B8;
      font-weight: 700;
    }
    /* Attendance */
    .attendance-grid {
      display: flex;
      gap: 8px;
    }
    .att-card {
      flex: 1;
      background: #FFFFFF;
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .att-title {
      font-size: 11px;
      font-weight: 700;
    }
    .att-value {
      font-size: 18px;
      font-weight: 900;
      color: #1E293B;
      line-height: 1.1;
    }
    .att-unit {
      font-size: 10px;
      color: #94A3B8;
      font-weight: 600;
    }
    /* Discipline 4-Segment */
    .disp-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .discipline-segmented-bar {
      display: flex;
      gap: 4px;
      width: 100%;
    }
    .disp-segment {
      flex: 1;
      text-align: center;
      padding: 6px 2px;
      border-radius: 6px;
      font-size: 10.5px;
    }
    /* Radial Gauge */
    .radial-gauge-box {
      width: 100%;
      max-width: 170px;
      text-align: center;
      margin: 0 auto;
    }
    .gauge-subtext {
      font-size: 11px;
      color: #64748B;
      font-weight: 700;
      margin-top: -3px;
    }
    /* Compact Advisor Note */
    .advisor-compact-card {
      background: #FFFFFF;
      border: 1.5px solid #FDE68A;
      border-right: 4px solid #F59E0B;
      border-radius: 10px;
      padding: 8px 10px;
    }
    .advisor-compact-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .advisor-tag {
      font-size: 11px;
      font-weight: 800;
      color: #B45309;
    }
    .advisor-badge {
      font-size: 9.5px;
      font-weight: 700;
      background: #FEF3C7;
      color: #92400E;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .advisor-text {
      font-size: 11px;
      line-height: 1.5;
      color: #334155;
      font-style: italic;
    }
    /* Expanded Signature (NO STAMP) */
    .expanded-signature-box {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .sig-status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
    }
    .sig-status-title {
      font-weight: 800;
      color: #1E293B;
    }
    .sig-status-date {
      color: #94A3B8;
      font-weight: 600;
    }
    .sig-zones {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 6px 0;
    }
    .sig-zone-item {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
      padding: 6px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sig-role {
      font-size: 11px;
      font-weight: 800;
      color: #475569;
    }
    .sig-school {
      font-size: 9.5px;
      color: #94A3B8;
    }
    .sig-notice {
      font-size: 9.5px;
      color: #94A3B8;
      text-align: center;
    }
    /* Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
      margin-top: 6px;
      font-size: 10px;
      color: #94A3B8;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${studentPages}
</body>
</html>
  `;
}

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CounselingReport } from '../types';

/**
 * Downloads a clean formatted text report file (.txt)
 */
export function downloadReportAsText(report: CounselingReport): void {
  const levelText =
    report.schoolLevel === 'elementary'
      ? '초등학교'
      : report.schoolLevel === 'middle'
      ? '중학교'
      : '고등학교';

  const lines: string[] = [];
  lines.push('========================================================================');
  lines.push(` [생디 | AI 기반 학생부 디자인 플랫폼] 공식 진로진학 정밀진단 리포트`);
  lines.push(` 학생부를 디자인하다 | ${report.studentName} 학생 맞춤 진단 결과서`);
  lines.push('========================================================================');
  lines.push(`- 발급 기관: 생디 (Saengdi)`);
  lines.push(`- 발급 식별자: SD-${new Date().getFullYear()}`);
  lines.push(`- 슬로건: 학생부를 디자인하다 | AI 기반 학생부 디자인 플랫폼`);
  lines.push(`- 분석 일자: ${report.generatedAt}`);
  lines.push(`- 학생 구분: ${levelText} ${report.grade}학년`);
  lines.push(`- 교과 관심 1순위: ${report.subjectAnalysis.topInterest} | 성적 1순위: ${report.subjectAnalysis.topGrade}`);
  lines.push('');
  lines.push('------------------------------------------------------------------------');
  lines.push(' 1. 학생 특성 종합 진단 개요');
  lines.push('------------------------------------------------------------------------');
  lines.push(report.studentProfileSummary);
  lines.push('');
  lines.push('[교과 시너지 및 강점 분석]');
  lines.push(report.subjectAnalysis.synergyAnalysis);
  lines.push('');
  lines.push('[학습 갭(Gap) 보완 솔루션]');
  lines.push(report.subjectAnalysis.gapAnalysis);
  lines.push('');

  if (report.testAnalysis && report.testAnalysis.hasImages) {
    lines.push('------------------------------------------------------------------------');
    lines.push(' 1-1. 첨부된 직업적성·흥미도 검사 결과지 심층 판독');
    lines.push('------------------------------------------------------------------------');
    lines.push(`- 판독 검사 유형: ${report.testAnalysis.testNames.join(', ')}`);
    lines.push(`- 판독된 적성 및 홀랜드 유형: ${report.testAnalysis.hollandOrAptitudeTypes}`);
    lines.push(`- 핵심 적성 요약: ${report.testAnalysis.aptitudeSummary}`);
    lines.push(`- 교과 및 학업 연계성: ${report.testAnalysis.synergyWithAcademicProfile}`);
    lines.push('');
  }

  lines.push('------------------------------------------------------------------------');
  lines.push(' 2. 추천 진로 (직업 3선) 심층 분석');
  lines.push('------------------------------------------------------------------------');
  report.recommendedCareers.forEach((career, idx) => {
    lines.push(`[추천 ${idx + 1}순위] ${career.title} (${career.category}) - 적합도 ${career.matchScore}%`);
    lines.push(`• 직업 개요: ${career.overview}`);
    lines.push(`• 주요 업무:`);
    career.responsibilities.forEach((r) => lines.push(`  - ${r}`));
    lines.push(`• 필요 역량: ${career.requiredCompetencies.join(', ')}`);
    lines.push(`• 추천 사유: ${career.subjectConnection}`);
    lines.push(`• 직업 전망: ${career.futureOutlook}`);
    lines.push('');
  });

  lines.push('------------------------------------------------------------------------');
  lines.push(' 3. 진학 목표: 1순위 · 2순위 · 3순위 고등학교 유형 및 선정 이유');
  lines.push('------------------------------------------------------------------------');
  if (report.academicRecommendation.recommendedSchoolTypes && report.academicRecommendation.recommendedSchoolTypes.length > 0) {
    report.academicRecommendation.recommendedSchoolTypes.forEach((st, idx) => {
      const rankNum = st.rank || (idx + 1);
      lines.push(`[${rankNum}순위 고등학교 유형] ${st.typeName} (${st.categoryTag || '고교 유형'})`);
      lines.push(`★ [${rankNum}순위 추천 이유]`);
      lines.push(`   ${st.recommendationReason}`);
      if (st.curriculumAdvantage) {
        lines.push(`• 고교 교육과정 특징 및 학생부 강점: ${st.curriculumAdvantage}`);
      }
      lines.push(`• 대표 추천 학교군: ${st.targetNames.join(', ')}`);
      lines.push(`• 입학 실전 준비 전략: ${st.preparationGuide}`);
      lines.push('');
    });
  }

  if (report.academicRecommendation.targetUniversitiesAndMajors && report.academicRecommendation.targetUniversitiesAndMajors.length > 0) {
    lines.push(`[고교 졸업 후 연계 목표 대학 및 학과 로드맵]`);
    report.academicRecommendation.targetUniversitiesAndMajors.forEach((tu, idx) => {
      lines.push(`${idx + 1}. ${tu.university} ${tu.major} (${tu.category})`);
      lines.push(`   - 입시 전략: ${tu.admissionStrategy}`);
      lines.push(`   - 권장 선택과목: ${tu.recommendedSubjects.join(', ')}`);
    });
    lines.push('');
  }

  lines.push(`[생디 수석 컨설턴트 1·2·3순위 고교 선택 종합 전략]:`);
  lines.push(report.academicRecommendation.overallAcademicAdvice);
  lines.push('');

  lines.push('========================================================================');
  lines.push(' 4. 학교생활기록부(생기부) 공식 기재용 문안 리포트 (NEIS 입력 맞춤)');
  lines.push('========================================================================');
  lines.push(`[A. ${report.studentRecordDraft.careerMotive.title}]`);
  lines.push(report.studentRecordDraft.careerMotive.content);
  lines.push(`(글자수: 공백 포함 ${report.studentRecordDraft.careerMotive.content.length}자)`);
  lines.push('');
  lines.push(`[B. ${report.studentRecordDraft.academicMotive.title}]`);
  lines.push(report.studentRecordDraft.academicMotive.content);
  lines.push(`(글자수: 공백 포함 ${report.studentRecordDraft.academicMotive.content.length}자)`);
  lines.push('');
  lines.push('[C. 과목별 세특(과세특) 추천 심화 탐구 주제]');
  report.studentRecordDraft.subjectSpecialtyGuide.forEach((sg) => {
    lines.push(`- [${sg.subject} 교과] ${sg.recommendedInquiryTopic}`);
    lines.push(`  세부 내용: ${sg.activityDetail}`);
  });
  lines.push('');
  lines.push('========================================================================');
  lines.push(' 발급 기관: 생디 (Saengdi) - 학생부를 디자인하다 | AI 기반 학생부 디자인 플랫폼');
  lines.push('========================================================================');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.studentName}_진로진학_정밀진단리포트_생디_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Builds the HTML content for both standalone HTML download and PDF generation
 */
function buildReportHtml(report: CounselingReport): string {
  const levelText =
    report.schoolLevel === 'elementary'
      ? '초등학교'
      : report.schoolLevel === 'middle'
      ? '중학교'
      : '고등학교';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.studentName} 학생 진로진학 정밀진단 리포트 - 생디</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 920px; margin: 0 auto; background: #ffffff; padding: 36px 40px; border-radius: 24px; box-shadow: 0 4px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
    .brand-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 16px; }
    .brand-logo-img { height: 46px; width: auto; object-fit: contain; }
    .tag { display: inline-block; padding: 5px 14px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #1d4ed8; color: #fff; }
    .subtag { display: inline-block; padding: 5px 12px; border-radius: 8px; font-size: 12px; background: #f1f5f9; color: #475569; font-weight: 600; margin-left: 6px; }
    h1 { font-size: 25px; color: #0f172a; margin: 12px 0 8px 0; font-weight: 900; letter-spacing: -0.02em; }
    h2 { font-size: 18px; color: #1e293b; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; margin-top: 32px; font-weight: 800; }
    h3 { font-size: 15px; color: #334155; margin-bottom: 6px; font-weight: 700; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 16px; }
    .rank-card { background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
    .rank-card.rank-1 { border-color: #818cf8; }
    .rank-card.rank-2 { border-color: #93c5fd; }
    .rank-card.rank-3 { border-color: #a7f3d0; }
    .rank-badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 900; color: #fff; }
    .rank-badge.rank-1 { background: #f59e0b; }
    .rank-badge.rank-2 { background: #2563eb; }
    .rank-badge.rank-3 { background: #059669; }
    .reason-box { background: #eef2ff; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 14px; margin: 12px 0; font-size: 13px; color: #1e1b4b; }
    .highlight-box { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .test-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #dbeafe; color: #1e40af; margin: 2px; }
    .code-block { font-family: monospace; background: #f1f5f9; padding: 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 13px; white-space: pre-wrap; margin-top: 8px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: center; }
    th { background: #f1f5f9; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-bar">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="/saengdi_logo_official.png" onerror="this.src='/saengdi_logo.svg'" alt="생디" class="brand-logo-img" />
        </div>
        <div>
          <span class="tag">생디 공식 정밀진단 리포트</span>
          <span class="subtag">발급번호: SD-${new Date().getFullYear()}</span>
          <span class="subtag">분석일자: ${report.generatedAt}</span>
        </div>
      </div>
      <h1>${report.studentName} 학생 진로진학 정밀진단 리포트</h1>
      <p style="color: #64748b; font-size: 14px; margin: 4px 0 16px 0;">
        ${levelText} ${report.grade}학년 | 교과 관심 1순위: <strong>${report.subjectAnalysis.topInterest}</strong> | 성적 1순위: <strong>${report.subjectAnalysis.topGrade}</strong>
      </p>
      <div class="highlight-box">
        <strong style="color: #312e81;">학생 특성 종합 진단 개요:</strong>
        <p style="margin: 6px 0 0 0; font-size: 14px;">${report.studentProfileSummary}</p>
      </div>
    </div>

    ${
      report.testAnalysis && report.testAnalysis.hasImages
        ? `
    <div class="test-box">
      <h3 style="color: #6b21a8; margin-top: 0;">🔬 직업적성·흥미도 검사 결과지 심층 판독 결과</h3>
      <p style="font-size: 13px; color: #475569;">
        <strong>판독 검사:</strong> ${report.testAnalysis.testNames.join(', ')}<br>
        <strong>핵심 적성 및 유형:</strong> ${report.testAnalysis.hollandOrAptitudeTypes}
      </p>
      <div style="background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #f3e8ff; font-size: 13px;">
        <strong>검사지 판독 요약:</strong> ${report.testAnalysis.aptitudeSummary}<br><br>
        <strong>교과·학업 시너지 분석:</strong> ${report.testAnalysis.synergyWithAcademicProfile}
      </div>
    </div>`
      : ''
    }

    <h2>1. 교과 관심도 vs 실제 성적 성취도 분석</h2>
    <table>
      <thead>
        <tr>
          <th>구분</th>
          ${report.subjectAnalysis.radarData.map((d) => `<th>${d.subject}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: bold; color: #4f46e5;">관심도 점수</td>
          ${report.subjectAnalysis.radarData.map((d) => `<td><strong>${d.interestScore}점</strong></td>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: bold; color: #059669;">성적 점수</td>
          ${report.subjectAnalysis.radarData.map((d) => `<td><strong>${d.gradeScore}점</strong></td>`).join('')}
        </tr>
      </tbody>
    </table>

    <h2>2. 추천 진로 (직업 3선) 심층 분석</h2>
    ${report.recommendedCareers
      .map(
        (c, idx) => `
      <div class="card">
        <h3 style="display: flex; justify-content: space-between; align-items: center; margin-top: 0;">
          <span>추천 ${idx + 1}순위: ${c.title}</span>
          <span style="font-size: 13px; color: #4f46e5; font-weight: bold;">적합도 ${c.matchScore}%</span>
        </h3>
        <p style="font-size: 13px; color: #64748b; margin-top: 2px;">분야: ${c.category}</p>
        <p style="font-size: 13px;"><strong>직업 개요:</strong> ${c.overview}</p>
        <p style="font-size: 13px;"><strong>주요 업무:</strong> ${c.responsibilities.join(' / ')}</p>
        <p style="font-size: 13px;"><strong>필요 역량:</strong> ${c.requiredCompetencies.map((rc) => `<span class="badge">${rc}</span>`).join(' ')}</p>
        <div class="reason-box">
          <strong>추천 사유:</strong> ${c.subjectConnection}
        </div>
        <p style="font-size: 12px; color: #64748b;"><strong>미래 전망:</strong> ${c.futureOutlook}</p>
      </div>
    `
      )
      .join('')}

    <h2>3. 진학 목표: 1순위 · 2순위 · 3순위 고등학교 유형 및 선정 이유</h2>
    ${
      report.academicRecommendation.recommendedSchoolTypes && report.academicRecommendation.recommendedSchoolTypes.length > 0
        ? report.academicRecommendation.recommendedSchoolTypes
            .map((st, idx) => {
              const rankNum = st.rank || (idx + 1);
              return `
          <div class="rank-card rank-${rankNum}">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div>
                <span class="rank-badge rank-${rankNum}">${rankNum}순위 추천</span>
                <strong style="font-size: 17px; color: #0f172a; margin-left: 8px;">${st.typeName}</strong>
              </div>
              <span style="font-size: 12px; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; color: #475569;">
                ${st.categoryTag || '고교 유형'}
              </span>
            </div>

            <div class="reason-box">
              <strong style="color: #312e81; font-size: 14px;">★ [${rankNum}순위 선정 이유]:</strong><br>
              ${st.recommendationReason}
            </div>

            ${
              st.curriculumAdvantage
                ? `<p style="font-size: 13px; margin: 8px 0;"><strong>고교 교육과정 특징 및 학생부 강점:</strong> ${st.curriculumAdvantage}</p>`
                : ''
            }
            <p style="font-size: 13px; margin: 8px 0;">
              <strong>대표 추천 학교군:</strong> ${st.targetNames.map((n) => `<span class="badge">${n}</span>`).join(' ')}
            </p>
            <div style="background: #0f172a; color: #e2e8f0; padding: 10px 14px; border-radius: 8px; font-size: 12px; margin-top: 10px;">
              <strong style="color: #6ee7b7;">입학 준비 실전 가이드:</strong> ${st.preparationGuide}
            </div>
          </div>
        `;
            })
            .join('')
        : ''
    }

    ${
      report.academicRecommendation.targetUniversitiesAndMajors && report.academicRecommendation.targetUniversitiesAndMajors.length > 0
        ? `
      <h3 style="margin-top: 24px;">고교 졸업 후 연계 목표 대학교 및 학과 로드맵</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
        ${report.academicRecommendation.targetUniversitiesAndMajors
          .map(
            (tu, idx) => `
          <div class="card" style="margin-bottom: 0;">
            <div style="font-size: 11px; font-weight: bold; color: #2563eb;">${tu.category} (지망 ${idx + 1})</div>
            <strong style="font-size: 15px; color: #0f172a;">${tu.university}</strong>
            <p style="font-size: 13px; font-weight: bold; color: #3730a3; margin: 4px 0;">${tu.major}</p>
            <p style="font-size: 12px; color: #475569;"><strong>전략:</strong> ${tu.admissionStrategy}</p>
            <p style="font-size: 11px; color: #64748b;"><strong>권장과목:</strong> ${tu.recommendedSubjects.join(', ')}</p>
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }

    <div class="highlight-box" style="background: #0f172a; color: #f8fafc; border: none; margin-top: 24px;">
      <strong style="color: #fde047; font-size: 14px;">생디 수석 컨설턴트 1·2·3순위 고교 선택 종합 전략:</strong>
      <p style="font-size: 13px; margin: 8px 0 0 0; line-height: 1.6;">${report.academicRecommendation.overallAcademicAdvice}</p>
    </div>

    <h2>4. 학교생활기록부(생기부) 공식 기재용 문안</h2>
    <div class="card">
      <h3 style="color: #4338ca; margin-top: 0;">${report.studentRecordDraft.careerMotive.title}</h3>
      <div class="code-block">${report.studentRecordDraft.careerMotive.content}</div>
    </div>

    <div class="card">
      <h3 style="color: #047857; margin-top: 0;">${report.studentRecordDraft.academicMotive.title}</h3>
      <div class="code-block">${report.studentRecordDraft.academicMotive.content}</div>
    </div>

    <h3>과목별 세특(과세특) 추천 심화 탐구 주제</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      ${report.studentRecordDraft.subjectSpecialtyGuide
        .map(
          (sg) => `
        <div class="card" style="margin-bottom: 0;">
          <strong>[${sg.subject} 교과] ${sg.recommendedInquiryTopic}</strong>
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${sg.activityDetail}</p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer">
      <strong>발급 기관: 생디 (Saengdi) — 학생부를 디자인하다 | AI 기반 학생부 디자인 플랫폼</strong><br>
      본 리포트는 학생의 교과 성취도와 직업적성·흥미 검사표를 기반으로 작성된 공식 진로진학 상담 결과서입니다.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Downloads a standalone, beautifully styled HTML report file (.html)
 */
export function downloadReportAsHtml(report: CounselingReport): void {
  const htmlContent = buildReportHtml(report);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.studentName}_진로진학_정밀진단리포트_생디_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the counseling report as an actual .pdf file directly using html2canvas & jsPDF!
 * This completely resolves issues where browser window.print() is blocked inside iFrames.
 */
export async function downloadReportAsPdf(
  elementId: string,
  report: CounselingReport
): Promise<void> {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    throw new Error('리포트 요소를 찾을 수 없습니다.');
  }

  // Create canvas from target DOM element
  const canvas = await html2canvas(targetElement, {
    scale: 2, // High resolution for crisp Korean text and logos
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#f8fafc',
    windowWidth: targetElement.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Multi-page handling if content exceeds A4 height
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Directly save/download as PDF file
  const fileName = `${report.studentName}_진로진학_정밀진단리포트_생디_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
}

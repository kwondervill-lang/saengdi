import React, { useState } from 'react';
import { CounselingReport } from '../types';
import { CareerCard } from './CareerCard';
import { AcademicTargetCard } from './AcademicTargetCard';
import { StudentRecordCard } from './StudentRecordCard';
import { downloadReportAsHtml, downloadReportAsText, downloadReportAsPdf } from '../utils/reportDownloader';
import { SaengdiLogo } from './SaengdiLogo';
import {
  GraduationCap,
  Calendar,
  Sparkles,
  TrendingUp,
  BarChart3,
  Award,
  ArrowLeft,
  Printer,
  Compass,
  CheckCircle2,
  Download,
  FileText,
  FileCode,
  FileCheck,
  Brain,
  ShieldCheck,
  Loader2
} from 'lucide-react';

interface CounselingReportViewProps {
  report: CounselingReport;
  onBackToEdit: () => void;
  onPrint: () => void;
}

export const CounselingReportView: React.FC<CounselingReportViewProps> = ({
  report,
  onBackToEdit,
  onPrint,
}) => {
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  const triggerDownloadMsg = (msg: string) => {
    setDownloadSuccessMsg(msg);
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 4000);
  };

  const handleDownloadDirectPdf = async () => {
    try {
      setIsPdfGenerating(true);
      await downloadReportAsPdf('printable-counseling-report-content', report);
      triggerDownloadMsg('PDF 리포트가 성공적으로 다운로드되었습니다!');
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to window.print if DOM capture encounters restrictions
      onPrint();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadHtml = () => {
    downloadReportAsHtml(report);
    triggerDownloadMsg('HTML 독립 실행형 리포트가 성공적으로 다운로드되었습니다.');
  };

  const handleDownloadText = () => {
    downloadReportAsText(report);
    triggerDownloadMsg('학생부 기재용 텍스트 문서(.txt)가 성공적으로 다운로드되었습니다.');
  };

  const levelText =
    report.schoolLevel === 'elementary'
      ? '초등학교'
      : report.schoolLevel === 'middle'
      ? '중학교'
      : '고등학교';

  return (
    <div className="space-y-8 print:space-y-6" id="counseling-report-view">
      {/* Download Alert Toast */}
      {downloadSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner & Multi-format Download Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 gap-3 print:hidden">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          입력 정보 수정하기
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct PDF Download Button */}
          <button
            type="button"
            onClick={handleDownloadDirectPdf}
            disabled={isPdfGenerating}
            id="download-pdf-direct-btn"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-200 transition cursor-pointer disabled:opacity-75"
          >
            {isPdfGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                PDF 생성 중...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5 text-white" />
                PDF 다운로드
              </>
            )}
          </button>

          {/* Print / Save as PDF Fallback */}
          <button
            type="button"
            onClick={onPrint}
            id="print-report-btn"
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-1.5 text-slate-300" />
            인쇄 / 대화상자
          </button>

          {/* HTML Standalone Download */}
          <button
            type="button"
            onClick={handleDownloadHtml}
            id="download-html-report-btn"
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <FileCode className="w-4 h-4 mr-1.5 text-indigo-600" />
            HTML 리포트
          </button>

          {/* Text Draft Download */}
          <button
            type="button"
            onClick={handleDownloadText}
            id="download-text-report-btn"
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
            생기부 문안(.txt)
          </button>
        </div>
      </div>

      {/* Target printable wrapper for jsPDF capture & DOM rendering */}
      <div id="printable-counseling-report-content" className="space-y-8 bg-transparent p-1">
        {/* Official Report Document Header Card */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            {/* Top Brand Logo & Metadata Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <SaengdiLogo size="md" className="h-10 sm:h-12" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-2xs">
                  생디 공식 진단 리포트
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  발급번호: SD-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
                </span>
                <span className="text-slate-500 flex items-center ml-1">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  분석 일자: {report.generatedAt}
                </span>
              </div>
            </div>

            {/* Student Headline */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600">
                    생디(Saengdi) 진로진학 정밀진단 컨설팅 결과지
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-slate-500">학생부를 디자인하다</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {report.studentName} 학생 진로진학 정밀진단 리포트
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {levelText} {report.grade}학년
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                    관심 교과 1순위: {report.subjectAnalysis.topInterest}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    성적 우수 교과 1순위: {report.subjectAnalysis.topGrade}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[170px] self-start md:self-auto">
                <span className="text-xs text-slate-500 font-medium block">추천 적합도 최상위 진로</span>
                <strong className="text-base font-extrabold text-indigo-600 block mt-0.5">
                  {report.recommendedCareers[0]?.title || '전공 특화 직업'}
                </strong>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  적합도 {report.recommendedCareers[0]?.matchScore || 95}% 매칭
                </span>
              </div>
            </div>

            {/* Diagnostic Executive Summary */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-blue-50/40 border border-indigo-100/80">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>학생 특성 종합 진단 개요</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {report.studentProfileSummary}
              </p>
            </div>
          </div>
        </section>

        {/* Aptitude & Holland Test Interpretation Section (if uploaded) */}
        {report.testAnalysis && report.testAnalysis.hasImages && (
          <section className="bg-white rounded-3xl border border-purple-200 p-6 sm:p-8 shadow-xs relative overflow-hidden" id="aptitude-test-analysis-section">
            <div className="flex items-start space-x-3.5 pb-5 border-b border-purple-100">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-100 shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                    검사 결과지 AI 판독
                  </span>
                  <span className="text-xs text-slate-400">표준화 심리/적성검사 연계</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  직업적성 · 흥미도 검사표 심층 판독 결과
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  업로드된 직업적성검사표 이미지를 분석하여 학생의 잠재 적성 지표와 직업 흥미 유형을 진단에 반영했습니다.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="text-xs font-bold text-purple-900 block mb-1">
                    인식된 검사 도구:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.testAnalysis.testNames.map((tn, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-purple-800 border border-purple-200 shadow-2xs"
                      >
                        {tn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="text-xs font-bold text-purple-900 block mb-1">
                    판독된 핵심 적성 / 홀랜드 코드:
                  </span>
                  <strong className="text-sm font-extrabold text-purple-700 block">
                    {report.testAnalysis.hollandOrAptitudeTypes}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-xs font-bold text-slate-800 block mb-1">
                  검사지 적성 요약:
                </strong>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {report.testAnalysis.aptitudeSummary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <strong className="text-xs font-bold text-indigo-900 block mb-1">
                  교과 성적 및 학업 역량과의 시너지:
                </strong>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {report.testAnalysis.synergyWithAcademicProfile}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Section 1: Subject Synergy & Gap Analysis */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start space-x-3.5 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  교과 역학 분석
                </span>
                <span className="text-xs text-slate-400">관심도 vs 성취도 비교</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                교과 흥미도와 실제 성적의 시너지 & 갭 분석
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                학생이 좋아하는 과목과 실제로 성적이 잘 나오는 과목의 일치도를 분석하여 잠재력과 보완점을 진단합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Subject Comparison Table / Cards */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                과목별 종합 지표 (환산 점수)
              </span>
              <div className="space-y-2">
                {report.subjectAnalysis.radarData.map((item, idx) => {
                  const isTopInterest = item.subject === report.subjectAnalysis.topInterest;
                  const isTopGrade = item.subject === report.subjectAnalysis.topGrade;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-800">
                            {item.subject}
                          </span>
                          {isTopInterest && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800">
                              관심 1순위
                            </span>
                          )}
                          {isTopGrade && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                              성적 1순위
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          격차: {Math.abs(item.interestScore - item.gradeScore)}점
                        </span>
                      </div>

                      {/* Visual Bars */}
                      <div className="space-y-1.5">
                        <div className="flex items-center text-xs">
                          <span className="w-16 text-[11px] text-slate-500">흥미 점수</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden mx-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${item.interestScore}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-semibold text-indigo-700">
                            {item.interestScore}
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          <span className="w-16 text-[11px] text-slate-500">성적 성취</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden mx-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${item.gradeScore}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-semibold text-emerald-700">
                            {item.gradeScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-depth Academic Explanations */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>학업 강점 & 교과 시너지 분석</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  {report.subjectAnalysis.synergyAnalysis}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>학습 흥미-성적 갭(Gap) 보완 솔루션</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {report.subjectAnalysis.gapAnalysis}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Recommended Careers (Top 3) */}
        <section className="space-y-6" id="recommended-careers-section">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  직업 매칭 솔루션
                </span>
                <span className="text-xs text-slate-400">교과 & 적성 다각도 분석</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                맞춤 추천 진로 3선 (1순위 · 2순위 · 3순위 직업)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                학생의 교과 흥미 순위와 성적 역량, 적성검사 코드를 교차 검증하여 도출한 3가지 추천 직업군입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {report.recommendedCareers.map((career, idx) => (
              <CareerCard
                key={career.id || idx}
                career={career}
                rank={((idx + 1) as 1 | 2 | 3)}
              />
            ))}
          </div>
        </section>

        {/* Section 3: Academic Target High School Types & Selected Reasons (1st, 2nd, 3rd) */}
        <AcademicTargetCard
          academic={report.academicRecommendation}
          studentName={report.studentName}
        />

        {/* Section 4: Student Record (NEIS) Draft & Specialty Inquiry Guide */}
        <StudentRecordCard
          draft={report.studentRecordDraft}
          studentName={report.studentName}
        />
      </div>

      {/* Footer Counselor Signature / Advice Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:mt-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <SaengdiLogo size="sm" className="h-6" />
            <span className="font-bold text-sm text-slate-800">
              생디 공식 진로진학 정밀진단 인증 리포트
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            본 리포트는 <strong>생디(Saengdi | AI 기반 학생부 디자인 플랫폼)</strong>의 진로진학 알고리즘과 교육부 학교생활기록부 기재 표준을 기반으로 산출된 공식 진단 결과입니다.
            학생의 주관적 교과 관심도와 객관적 성취도 순위, 평소 관심 직업, 그리고 표준화 직업적성·흥미도 검사 결과를 정밀 대조하여 1·2·3순위 고교 유형 및 최적 진로 로드맵을 제안합니다.
          </p>
          <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
            <span>발급 기관: 생디 (Saengdi)</span>
            <span>•</span>
            <span>슬로건: 학생부를 디자인하다</span>
            <span>•</span>
            <span>보안 인증코드: SD-AI-{new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
          <button
            type="button"
            onClick={handleDownloadDirectPdf}
            disabled={isPdfGenerating}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs shadow-blue-200 inline-flex items-center disabled:opacity-75"
          >
            {isPdfGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5" />
                PDF 다운로드
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs inline-flex items-center"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            인쇄
          </button>
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 transition cursor-pointer inline-flex items-center"
          >
            <FileCode className="w-4 h-4 mr-1.5 text-indigo-600" />
            HTML 다운로드
          </button>
          <button
            type="button"
            onClick={handleDownloadText}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 transition cursor-pointer inline-flex items-center"
          >
            <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
            생기부 문안(.txt)
          </button>
          <button
            type="button"
            onClick={onBackToEdit}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            새로운 진단 시작
          </button>
        </div>
      </div>
    </div>
  );
};

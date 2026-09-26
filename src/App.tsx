import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudentInputForm } from './components/StudentInputForm';
import { CounselingReportView } from './components/CounselingReportView';
import { StudentInput, CounselingReport, SubjectKey } from './types';
import { generateCounselingReport } from './utils/reportGenerator';
import { SAMPLE_PRESETS } from './data/careerDatabase';
import { Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_INPUT: StudentInput = {
  studentName: '김민준',
  schoolLevel: 'middle',
  grade: 3,
  interestRanking: ['math', 'science', 'english', 'korean', 'social'] as SubjectKey[],
  gradeRanking: ['math', 'science', 'korean', 'english', 'social'] as SubjectKey[],
  interestedCareers: ['AI 소프트웨어 엔지니어', '로봇공학 연구원', '빅데이터 분석가'],
};

export default function App() {
  const [studentInput, setStudentInput] = useState<StudentInput>(INITIAL_INPUT);
  const [report, setReport] = useState<CounselingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call backend API
      const res = await fetch('/api/career-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentInput),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.report) {
          setReport(data.report);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsLoading(false);
          return;
        }
      }
      // If server responded with error, use client-side expert engine
      console.warn('Backend API returned non-ok status, utilizing local expert counseling engine');
      const fallback = generateCounselingReport(studentInput);
      setReport(fallback);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Failed to connect to API route, utilizing local expert counseling engine:', err);
      // Seamless local generator fallback
      const fallback = generateCounselingReport(studentInput);
      setReport(fallback);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setStudentInput({
      studentName: preset.studentName,
      schoolLevel: preset.schoolLevel,
      grade: preset.grade,
      interestRanking: [...preset.interestRanking],
      gradeRanking: [...preset.gradeRanking],
      interestedCareers: [...preset.interestedCareers],
      testImages: [],
    });
    setReport(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setStudentInput({ ...INITIAL_INPUT, testImages: [] });
    setReport(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        isReportView={Boolean(report)}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!report ? (
          <div>
            {/* Intro Hero Banner */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                생디 — AI 기반 학생부 디자인 플랫폼
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                진로진학 정밀진단<br />
                <span className="text-indigo-600">1·2·3순위 고교 유형 & 맞춤 리포트</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                학생의 교과 관심도와 실제 성적 순위, 직업적성·흥미도 검사 결과를 종합 분석하여
                <br className="hidden sm:block" />
                <strong>1·2·3순위 고등학교 유형 및 선정 이유</strong>, <strong>3대 추천 진로</strong>,
                <strong>생기부 기재용 동기 양식</strong>을 정밀 도출해 드립니다.
              </p>
            </div>

            {/* Input Form */}
            <StudentInputForm
              input={studentInput}
              onChange={setStudentInput}
              onSubmit={handleGenerateReport}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Report View */
          <CounselingReportView
            report={report}
            onBackToEdit={() => {
              setReport(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrint={handlePrint}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 bg-white print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800 text-sm">
              생디 — 학생부를 디자인하다
            </p>
            <p className="mt-0.5 text-slate-500">
              AI 기반 진로진학 정밀진단 및 1·2·3순위 고교 유형 맞춤 리포트 플랫폼 | <a href="https://www.sangdi.net" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.sangdi.net</a>
            </p>
          </div>
          <p className="text-slate-400 text-right sm:text-left">
            2028 / 2022 개정 교육과정 및 학교생활기록부 기재요령 연계
          </p>
        </div>
      </footer>
    </div>
  );
}

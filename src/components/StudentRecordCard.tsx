import React, { useState } from 'react';
import { StudentRecordDraft } from '../types';
import {
  FileText,
  Copy,
  Check,
  Award,
  BookMarked,
  Lightbulb,
  CheckCheck
} from 'lucide-react';

interface StudentRecordCardProps {
  draft: StudentRecordDraft;
  studentName: string;
}

export const StudentRecordCard: React.FC<StudentRecordCardProps> = ({
  draft,
  studentName,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2500);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              학교생활기록부(생기부) 공식 기재용 종합 리포트
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              희망 진로 선정 동기 및 희망 진학 선정 동기 (NEIS 입력 맞춤 양식)
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto flex items-center">
          <Award className="w-3.5 h-3.5 mr-1" />
          원클릭 학생부 복사 지원
        </span>
      </div>

      {/* 1. 희망 진로 선정 동기 */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2" />
            {draft.careerMotive.title}
          </h4>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">
              글자수: {draft.careerMotive.content.length}자
            </span>
            <button
              type="button"
              id="copy-career-motive-btn"
              onClick={() => handleCopy(draft.careerMotive.content, 'career')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
            >
              {copiedKey === 'career' ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  학생부 문구 복사
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed shadow-inner">
          {draft.careerMotive.content}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 pl-1">
          * NEIS 진로활동 특기사항 또는 자율활동 란에 그대로 활용 가능한 정제된 교육부 양식입니다.
        </p>
      </div>

      {/* 2. 희망 진학 선정 동기 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-2" />
            {draft.academicMotive.title}
          </h4>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">
              글자수: {draft.academicMotive.content.length}자
            </span>
            <button
              type="button"
              id="copy-academic-motive-btn"
              onClick={() => handleCopy(draft.academicMotive.content, 'academic')}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
            >
              {copiedKey === 'academic' ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  학생부 문구 복사
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed shadow-inner">
          {draft.academicMotive.content}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 pl-1">
          * 자기주도학습전형(특목·자사고) 학업계획서 및 대입 학생부종합전형 지원동기 서술에 직접 활용할 수 있습니다.
        </p>
      </div>

      {/* 3. 과목별 세부능력 및 특기사항(과세특) 추천 탐구 주제 가이드 */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center space-x-2 mb-4">
          <BookMarked className="w-5 h-5 text-indigo-600" />
          <h4 className="text-base font-bold text-slate-900">
            주요 교과별 세특(과세특) 추천 심화 탐구 주제 & 활동 가이드
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {draft.subjectSpecialtyGuide.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {item.subject} 교과
                </span>
                <span className="text-[11px] text-slate-400">
                  추천 탐구 #{idx + 1}
                </span>
              </div>
              <h5 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1.5 flex items-start">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0 mt-0.5" />
                <span>{item.recommendedInquiryTopic}</span>
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg">
                {item.activityDetail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

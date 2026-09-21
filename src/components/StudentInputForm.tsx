import React from 'react';
import { SchoolLevel, StudentInput, SubjectKey, TestImageItem } from '../types';
import { RankSelector } from './RankSelector';
import { TestImageUploader } from './TestImageUploader';
import { POPULAR_CAREER_SUGGESTIONS } from '../data/careerDatabase';
import {
  User,
  GraduationCap,
  Sparkles,
  Search,
  ArrowRight,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

interface StudentInputFormProps {
  input: StudentInput;
  onChange: React.Dispatch<React.SetStateAction<StudentInput>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const StudentInputForm: React.FC<StudentInputFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleLevelChange = (level: SchoolLevel) => {
    // default grade to 1 if existing grade exceeds level max
    let newGrade = input.grade;
    if (level === 'elementary' && newGrade > 6) newGrade = 6;
    if ((level === 'middle' || level === 'high') && newGrade > 3) newGrade = 3;
    onChange((prev) => ({
      ...prev,
      schoolLevel: level,
      grade: newGrade,
    }));
  };

  const handleCareerChange = (index: number, val: string) => {
    onChange((prev) => {
      const updated = [...prev.interestedCareers];
      updated[index] = val;
      return { ...prev, interestedCareers: updated };
    });
  };

  const handleAddSuggestedCareer = (careerTitle: string) => {
    onChange((prev) => {
      const updated = [...prev.interestedCareers];
      const emptyIdx = updated.findIndex((c) => !c || c.trim() === '');
      if (emptyIdx !== -1) {
        updated[emptyIdx] = careerTitle;
      } else if (updated.length < 3) {
        updated.push(careerTitle);
      } else {
        // replace last
        updated[2] = careerTitle;
      }
      return { ...prev, interestedCareers: updated };
    });
  };

  const gradeOptions =
    input.schoolLevel === 'elementary'
      ? [1, 2, 3, 4, 5, 6]
      : [1, 2, 3];

  const currentSuggestions =
    POPULAR_CAREER_SUGGESTIONS[input.schoolLevel] || POPULAR_CAREER_SUGGESTIONS.middle;

  const validCareerCount = input.interestedCareers.filter((c) => c && c.trim().length > 0).length;
  const isFormValid = validCareerCount >= 2;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid && !isLoading) {
          onSubmit();
        }
      }}
      className="space-y-8"
      id="career-input-form"
    >
      {/* Step 1: 학생 인적 사항 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. 학생 인적 사항 입력
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              학교급(초·중·고)과 학년, 학생 이름을 설정해주세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 학생 이름 */}
          <div>
            <label
              htmlFor="student-name-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              학생 이름 (또는 별칭)
            </label>
            <div className="relative">
              <input
                type="text"
                id="student-name-input"
                value={input.studentName}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, studentName: e.target.value }))
                }
                placeholder="예: 김민준"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              * 리포트 발급 시 대상 학생 이름으로 표기됩니다.
            </span>
          </div>

          {/* 학교급 선택 */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              학교급 선택
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { level: 'elementary' as SchoolLevel, label: '초등학생', sub: '기초 흥미 탐색' },
                { level: 'middle' as SchoolLevel, label: '중학생', sub: '고교 진학 목표' },
                { level: 'high' as SchoolLevel, label: '고등학생', sub: '대입·학과 목표' },
              ].map((item) => {
                const isSelected = input.schoolLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    id={`level-select-${item.level}`}
                    onClick={() => handleLevelChange(item.level)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`block font-bold text-sm ${
                        isSelected ? 'text-indigo-900' : 'text-slate-800'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] block mt-0.5 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 학년 선택 */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            현재 학년 선택
          </label>
          <div className="flex flex-wrap gap-2">
            {gradeOptions.map((g) => {
              const isSelected = input.grade === g;
              return (
                <button
                  key={g}
                  type="button"
                  id={`grade-select-${g}`}
                  onClick={() => onChange((prev) => ({ ...prev, grade: g }))}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {g}학년
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step 2 & 3: 교과 관심도 vs 교과 성적 순위 체크 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 교과 관심도 */}
        <RankSelector
          title="2. 교과 관심도 순서 체크"
          subtitle="국어, 영어, 수학, 과학, 사회 중 관심이 높은 순서대로 정렬해주세요."
          ranking={input.interestRanking}
          onChange={(newRank) =>
            onChange((prev) => ({ ...prev, interestRanking: newRank }))
          }
          accentColor="indigo"
          idPrefix="interest"
        />

        {/* 실제 교과 성적 */}
        <RankSelector
          title="3. 실제 교과 성적 순서 체크"
          subtitle="국어, 영어, 수학, 과학, 사회 중 실제 성적이 높은 순서대로 정렬해주세요."
          ranking={input.gradeRanking}
          onChange={(newRank) =>
            onChange((prev) => ({ ...prev, gradeRanking: newRank }))
          }
          accentColor="emerald"
          idPrefix="grade"
        />
      </div>

      {/* Step 4: 평소 관심 직업 2~3개 입력 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                4. 평소 관심 직업 입력 (2~3개)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                평소 꿈꾸거나 호기심을 가졌던 관심 직업을 2개 이상 입력해주세요.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {validCareerCount}/3 입력 완료
          </span>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
          {[0, 1, 2].map((idx) => {
            const isRequired = idx < 2;
            return (
              <div key={idx} className="relative">
                <label
                  htmlFor={`career-input-${idx}`}
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  관심 직업 {idx + 1} {isRequired ? <span className="text-red-500">*</span> : <span className="text-slate-400">(선택)</span>}
                </label>
                <input
                  type="text"
                  id={`career-input-${idx}`}
                  value={input.interestedCareers[idx] || ''}
                  onChange={(e) => handleCareerChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? '예: AI 개발자'
                      : idx === 1
                      ? '예: 바이오 신약 연구원'
                      : '예: 로봇공학자 (선택)'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            );
          })}
        </div>

        {/* Popular Suggestions for clicked level */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {input.schoolLevel === 'elementary'
                ? '초등학생 추천 인기 직업 (클릭 시 자동 입력):'
                : input.schoolLevel === 'middle'
                ? '중학생 추천 유망 직업 (클릭 시 자동 입력):'
                : '고등학생 추천 미래 신산업 직무 (클릭 시 자동 입력):'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentSuggestions.map((job) => (
              <button
                key={job}
                type="button"
                onClick={() => handleAddSuggestedCareer(job)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition cursor-pointer"
              >
                + {job}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Step 4: 직업적성검사 & 직업흥미도검사 결과 이미지 업로드 (최대 2장) */}
      <TestImageUploader
        images={input.testImages || []}
        onChange={(images) =>
          onChange((prev) => ({
            ...prev,
            testImages: images,
          }))
        }
      />

      {/* CTA Button: '진로진학 정밀진단하기' */}
      <div className="pt-2 flex flex-col items-center">
        <button
          type="submit"
          id="generate-career-report-btn"
          disabled={!isFormValid || isLoading}
          className={`w-full sm:w-auto min-w-[320px] px-9 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg ${
            isFormValid && !isLoading
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {input.testImages && input.testImages.length > 0
                  ? '검사 결과지 이미지 OCR 판독 및 정밀 리포트 분석 중...'
                  : 'AI 진로진학 정밀 리포트 분석 및 생성 중...'}
              </span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>진로진학 정밀진단하기</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Uploaded images status badge */}
        {input.testImages && input.testImages.length > 0 && (
          <div className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            검사 결과지 {input.testImages.length}장 첨부됨 — 멀티모달 정밀 분석 모드 가동
          </div>
        )}

        {!isFormValid && (
          <p className="text-xs text-amber-600 mt-2 flex items-center">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            평소 관심 직업을 최소 2개 이상 입력해주셔야 정밀 리포트를 생성할 수 있습니다.
          </p>
        )}
      </div>
    </form>
  );
};

import React from 'react';
import { AcademicRecommendation, TargetSchoolType } from '../types';
import {
  School,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Award,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Target,
  FileCheck2
} from 'lucide-react';

interface AcademicTargetCardProps {
  academic: AcademicRecommendation;
  studentName: string;
}

export const AcademicTargetCard: React.FC<AcademicTargetCardProps> = ({
  academic,
  studentName,
}) => {
  // Ensure we have 1st, 2nd, 3rd ranked high school types
  const rankedSchoolTypes: TargetSchoolType[] =
    academic.recommendedSchoolTypes && academic.recommendedSchoolTypes.length > 0
      ? academic.recommendedSchoolTypes.slice(0, 3).map((item, idx) => ({
          ...item,
          rank: (item.rank || (idx + 1)) as 1 | 2 | 3,
        }))
      : [];

  const rankStyles = {
    1: {
      badgeBg: 'bg-amber-500 text-white shadow-xs',
      label: '1순위 최우선 추천',
      containerBorder: 'border-indigo-300 ring-2 ring-indigo-100',
      headerBg: 'bg-gradient-to-r from-indigo-900 to-blue-900 text-white',
      accentColor: 'text-indigo-600',
      reasonBg: 'bg-indigo-50/70 border-indigo-100 text-indigo-950',
      reasonTitle: '1순위 추천 이유',
    },
    2: {
      badgeBg: 'bg-blue-600 text-white shadow-xs',
      label: '2순위 유력 대안',
      containerBorder: 'border-blue-200',
      headerBg: 'bg-gradient-to-r from-slate-800 to-blue-950 text-white',
      accentColor: 'text-blue-600',
      reasonBg: 'bg-blue-50/60 border-blue-100 text-blue-950',
      reasonTitle: '2순위 추천 이유',
    },
    3: {
      badgeBg: 'bg-emerald-600 text-white shadow-xs',
      label: '3순위 실리형 전략',
      containerBorder: 'border-emerald-200',
      headerBg: 'bg-gradient-to-r from-slate-800 to-emerald-950 text-white',
      accentColor: 'text-emerald-600',
      reasonBg: 'bg-emerald-50/60 border-emerald-100 text-emerald-950',
      reasonTitle: '3순위 추천 이유',
    },
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-7" id="academic-target-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                생디 진학 목표 분석
              </span>
              <span className="text-xs text-slate-400">맞춤 고교 유형 가이드</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              진학 목표: 1순위 · 2순위 · 3순위 고등학교 유형 및 선정 이유
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              학생의 교과 흥미 순위, 실제 성적 강점 및 적성검사 판독 결과를 종합적으로 결합하여 가장 적합한 고등학교 유형 3개와 선정 이유를 도출했습니다.
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-white shadow-2xs flex items-center">
            <School className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            고교 유형 1·2·3순위
          </span>
        </div>
      </div>

      {/* Ranked High School Types: 1순위, 2순위, 3순위 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {rankedSchoolTypes.map((item, idx) => {
            const rankNum = (item.rank || (idx + 1)) as 1 | 2 | 3;
            const style = rankStyles[rankNum] || rankStyles[1];

            return (
              <div
                key={idx}
                id={`ranked-high-school-type-${rankNum}`}
                className={`rounded-2xl border ${style.containerBorder} bg-white shadow-xs overflow-hidden transition hover:shadow-md`}
              >
                {/* Top Rank Banner */}
                <div className={`${style.headerBg} px-5 py-3.5 flex flex-wrap items-center justify-between gap-2`}>
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-xs font-black px-3 py-1 rounded-lg ${style.badgeBg} flex items-center tracking-wide`}>
                      <Award className="w-3.5 h-3.5 mr-1" />
                      {style.label}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {item.typeName}
                    </h4>
                  </div>
                  {item.categoryTag && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/15 text-slate-100 border border-white/20">
                      {item.categoryTag}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* ★ 1순위/2순위/3순위 추천 이유 (Core requirement) */}
                  <div className={`p-4 rounded-xl border ${style.reasonBg}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className={`w-4 h-4 ${style.accentColor}`} />
                      <strong className={`text-sm font-extrabold ${style.accentColor}`}>
                        {style.reasonTitle}: 왜 이 고등학교 유형을 {rankNum}순위로 추천하는가?
                      </strong>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal">
                      {item.recommendationReason}
                    </p>
                  </div>

                  {/* Two Column Grid: Education Curriculum & Target Schools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Curriculum Advantage */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-xs font-bold text-slate-800 flex items-center mb-1.5">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                        고교 교육과정 특징 및 학생부 강점
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.curriculumAdvantage ||
                          '특화된 선택과목 개설 및 과제연구(R&E), 세부능력 및 특기사항의 심층 기록을 통한 학종 경쟁력 극대화'}
                      </p>
                    </div>

                    {/* Target Representative Schools */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-xs font-bold text-slate-800 flex items-center mb-2">
                        <School className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                        대표 추천 학교군 예시
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.targetNames.map((school, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs flex items-center"
                          >
                            <ArrowUpRight className="w-3 h-3 mr-1 text-indigo-500" />
                            {school}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preparation Strategy Guide */}
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-100 flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold text-emerald-300 block mb-0.5">
                        {rankNum}순위 {item.typeName.split(' ')[0]} 입학을 위한 실전 준비 가이드:
                      </strong>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.preparationGuide}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Universities & Majors (if provided, especially for high school students) */}
      {academic.targetUniversitiesAndMajors && academic.targetUniversitiesAndMajors.length > 0 && (
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                고교 졸업 후 연계 목표 대학교 및 학과 로드맵
              </h4>
              <p className="text-xs text-slate-500">
                1·2·3순위 고교 진학 후 대입 수시(학생부종합전형) 및 정시에서 연계 가능한 목표 대학군입니다.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              대입 연계
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {academic.targetUniversitiesAndMajors.map((target, idx) => (
              <div
                key={idx}
                id={`target-univ-${idx + 1}`}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {target.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      지망 {idx + 1}
                    </span>
                  </div>

                  <h5 className="font-bold text-base text-slate-900">
                    {target.university}
                  </h5>
                  <p className="text-xs font-semibold text-indigo-900 mb-2">
                    {target.major}
                  </p>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed mb-3">
                    <strong className="text-slate-800 block text-[11px] mb-0.5">
                      입시 대비 전략:
                    </strong>
                    {target.admissionStrategy}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    권장 고교 선택과목:
                  </span>
                  <div className="space-y-0.5 text-[11px] text-slate-600">
                    {target.recommendedSubjects.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1 text-indigo-500 shrink-0" />
                        <span className="truncate">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 생디 수석 컨설턴트 고교 선택 종합 진학 전략 조언 */}
      <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm leading-relaxed border border-slate-800">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <strong className="font-extrabold text-amber-300 text-sm block">
              생디 수석 컨설턴트의 1·2·3순위 고교 유형 선택 종합 전략:
            </strong>
            <p className="text-slate-300 leading-relaxed">
              {academic.overallAcademicAdvice}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

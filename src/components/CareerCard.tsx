import React from 'react';
import { RecommendedCareer } from '../types';
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

interface CareerCardProps {
  career: RecommendedCareer;
  rankIndex: number;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, rankIndex }) => {
  const badgeColor =
    rankIndex === 0
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : rankIndex === 1
      ? 'bg-blue-100 text-blue-900 border-blue-300'
      : 'bg-emerald-100 text-emerald-900 border-emerald-300';

  const cardBorder =
    rankIndex === 0
      ? 'border-amber-200 bg-gradient-to-b from-amber-50/20 to-white'
      : 'border-slate-200 bg-white';

  return (
    <div
      id={`career-card-${rankIndex + 1}`}
      className={`rounded-2xl border ${cardBorder} p-6 shadow-xs hover:shadow-md transition`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
          >
            추천 진로 {rankIndex + 1}순위
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {career.category}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-indigo-600 font-bold text-sm">
          <Award className="w-4 h-4" />
          <span>적합도 {career.matchScore}%</span>
        </div>
      </div>

      {/* Career Title */}
      <div className="mt-4 mb-3">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-indigo-600 shrink-0" />
          {career.title}
        </h3>
      </div>

      {/* 1. 직업 개요 */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />
          직업 개요
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-indigo-100">
          {career.overview}
        </p>
      </div>

      {/* 2. 하는 일 (주요 업무) */}
      <div className="mb-4 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 mr-1.5" />
          주요 하는 일 (핵심 직무)
        </h4>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
          {career.responsibilities.map((task, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-indigo-500 mr-2 font-bold">•</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. 필요 역량 */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center">
          <Layers className="w-4 h-4 text-emerald-600 mr-1.5" />
          필요 역량 및 요구 지식
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {career.requiredCompetencies.map((comp, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* 4. 교과 연계 추천 사유 & 설명 */}
      <div className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-900 mb-1.5 flex items-center">
          <Sparkles className="w-4 h-4 text-indigo-600 mr-1.5" />
          학생 교과 특성 및 관심 연계 추천 사유
        </h4>
        <p className="text-xs sm:text-sm text-indigo-950/90 leading-relaxed">
          {career.subjectConnection}
        </p>
      </div>

      {/* 5. 직업 전망 */}
      <div className="pt-3 border-t border-slate-100 flex items-start space-x-2 text-xs text-slate-600">
        <TrendingUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-800">미래 전망:</strong>{' '}
          {career.futureOutlook}
        </p>
      </div>
    </div>
  );
};

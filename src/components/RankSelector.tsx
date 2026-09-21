import React from 'react';
import { SubjectKey } from '../types';
import { SUBJECT_DEFINITIONS } from '../data/careerDatabase';
import {
  ChevronUp,
  ChevronDown,
  BookOpen,
  Globe,
  Calculator,
  Atom,
  Compass,
  ArrowUpDown
} from 'lucide-react';

interface RankSelectorProps {
  title: string;
  subtitle: string;
  ranking: SubjectKey[];
  onChange: (newRanking: SubjectKey[]) => void;
  accentColor: 'indigo' | 'emerald';
  idPrefix: string;
}

export const RankSelector: React.FC<RankSelectorProps> = ({
  title,
  subtitle,
  ranking,
  onChange,
  accentColor,
  idPrefix,
}) => {
  const getSubjectIcon = (key: SubjectKey) => {
    switch (key) {
      case 'korean':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'english':
        return <Globe className="w-5 h-5 text-sky-600" />;
      case 'math':
        return <Calculator className="w-5 h-5 text-indigo-600" />;
      case 'science':
        return <Atom className="w-5 h-5 text-emerald-600" />;
      case 'social':
        return <Compass className="w-5 h-5 text-rose-600" />;
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === ranking.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newRanking = [...ranking];
    const temp = newRanking[index];
    newRanking[index] = newRanking[targetIndex];
    newRanking[targetIndex] = temp;
    onChange(newRanking);
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    const newRanking = [...ranking];
    const [item] = newRanking.splice(index, 1);
    newRanking.unshift(item);
    onChange(newRanking);
  };

  const rankBadgeStyle = (rankIndex: number) => {
    switch (rankIndex) {
      case 0:
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 1:
        return 'bg-slate-200 text-slate-800 border-slate-300 font-bold';
      case 2:
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                accentColor === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Live Order String */}
        <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
          <span className="text-slate-400 mr-1">현재 순위:</span>
          {ranking.map((key, idx) => (
            <span key={key} className="flex items-center">
              <span className="font-semibold text-slate-800">
                {SUBJECT_DEFINITIONS[key].name}
              </span>
              {idx < ranking.length - 1 && (
                <span className="text-slate-400 mx-1">&gt;</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Reorderable List */}
      <div className="space-y-2.5">
        {ranking.map((key, index) => {
          const info = SUBJECT_DEFINITIONS[key];
          const isFirst = index === 0;
          const isLast = index === ranking.length - 1;

          return (
            <div
              key={key}
              id={`${idPrefix}-subject-row-${key}`}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all ${
                isFirst
                  ? 'border-indigo-300 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Left: Rank & Subject info */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs ${rankBadgeStyle(
                    index
                  )}`}
                >
                  {index + 1}위
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-100">
                    {getSubjectIcon(key)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {info.name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                      {key === 'korean' && '이해력·표현력'}
                      {key === 'english' && '글로벌 언어·소통'}
                      {key === 'math' && '수리논리·문제해결'}
                      {key === 'science' && '자연탐구·실험분석'}
                      {key === 'social' && '인간·사회·역사 이해'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Order controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={() => moveToTop(index)}
                    title="1위로 즉시 이동"
                    className="hidden sm:inline-flex px-2 py-1 text-xs rounded border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer"
                  >
                    1위로
                  </button>
                )}

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    id={`${idPrefix}-move-up-${key}`}
                    disabled={isFirst}
                    onClick={() => moveItem(index, 'up')}
                    aria-label={`${info.name} 순위 올리기`}
                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                      isFirst
                        ? 'opacity-30 border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    id={`${idPrefix}-move-down-${key}`}
                    disabled={isLast}
                    onClick={() => moveItem(index, 'down')}
                    aria-label={`${info.name} 순위 내리기`}
                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                      isLast
                        ? 'opacity-30 border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
        <span>▲ / ▼ 버튼을 눌러 1위부터 5위까지 순서를 자유롭게 조정하세요.</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, Printer, RotateCcw } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/careerDatabase';
import { StudentInput } from '../types';
import { SaengdiLogo } from './SaengdiLogo';

interface NavbarProps {
  onSelectPreset: (preset: typeof SAMPLE_PRESETS[0]) => void;
  onReset: () => void;
  isReportView: boolean;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onReset,
  isReportView,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={onReset} id="logo-branding">
            <SaengdiLogo size="sm" className="h-9 sm:h-10 hover:opacity-95 transition" />
            <div className="hidden sm:block pl-3 border-l border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  진로진학 정밀진단
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  고교 유형 1·2·3순위
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                AI 기반 맞춤 진로 3선 · 진학 고교 유형 · 학생부 디자인
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Sample Presets Dropdown / Buttons */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                샘플:
              </span>
              {SAMPLE_PRESETS.slice(0, 3).map((preset, idx) => (
                <button
                  key={idx}
                  id={`preset-btn-${idx}`}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition font-medium cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {isReportView ? (
              <>
                <button
                  type="button"
                  id="print-report-btn"
                  onClick={onPrint}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 mr-1.5 text-slate-500" />
                  리포트 인쇄 / PDF
                </button>
                <button
                  type="button"
                  id="new-diagnosis-btn"
                  onClick={onReset}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs shadow-indigo-200"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  새로 입력하기
                </button>
              </>
            ) : (
              <button
                type="button"
                id="reset-form-btn"
                onClick={onReset}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                초기화
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

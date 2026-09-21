import React, { useRef, useState } from 'react';
import { TestImageItem } from '../types';
import {
  FileImage,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';

interface TestImageUploaderProps {
  images: TestImageItem[];
  onChange: (images: TestImageItem[]) => void;
}

export const TestImageUploader: React.FC<TestImageUploaderProps> = ({
  images,
  onChange,
}) => {
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<TestImageItem | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const slotConfigs = [
    {
      slotIndex: 0,
      title: '직업적성검사 결과지',
      sub: '커리어넷 직업적성검사, 워크넷 청소년 직업적성검사, 다중지능검사 등',
      ref: fileInputRef1,
    },
    {
      slotIndex: 1,
      title: '직업흥미도검사 결과지',
      sub: '홀랜드(RIASEC) 흥미검사, 스트롱 직업흥미도, 직업가치관검사 등',
      ref: fileInputRef2,
    },
  ];

  const processFile = (file: File, slotIndex: number) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG, WebP)만 업로드 가능합니다.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('이미지 파일 크기는 15MB 이하로 업로드해주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Extract base64 without prefix
      const base64Data = result.split(',')[1] || '';
      const mimeType = file.type || 'image/png';
      const fileSizeKb = (file.size / 1024).toFixed(1) + ' KB';

      const updated = [...images];
      const newItem: TestImageItem = {
        id: `img-${Date.now()}-${slotIndex}`,
        name: file.name,
        mimeType,
        data: base64Data,
        label: slotConfigs[slotIndex].title,
        previewUrl: result,
        fileSize: fileSizeKb,
      };

      updated[slotIndex] = newItem;
      onChange(updated.filter(Boolean));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, slotIndex);
    }
    // reset input value so re-upload of same file works
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, slotIndex);
    }
  };

  const handleRemove = (slotIndex: number) => {
    const updated = [...images];
    delete updated[slotIndex];
    onChange(updated.filter(Boolean));
  };

  // Helper to load sample test images for instant testing
  const handleLoadSampleImages = () => {
    // Generate realistic canvas-based mockup result sheet images with CareerNet/WorkNet Holland charts
    const createSampleCanvasDataUrl = (title: string, code: string, topAptitude: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 420;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 420);

      // Header banner
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(0, 0, 600, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(title, 24, 38);

      // Subheader
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText('공식 진로심리검사 결과 리포트 (한국직업능력연구원 커리어넷 / 고용노동부 워크넷 양식)', 24, 78);

      // Main White Box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(20, 90, 560, 310, 12);
      ctx.fill();
      ctx.stroke();

      // Content inside box
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`■ 핵심 진단 지표: ${code}`, 40, 125);

      ctx.fillStyle = '#334155';
      ctx.font = '14px sans-serif';
      ctx.fillText(`- 최우수 잠재 적성 영역: ${topAptitude}`, 40, 155);
      ctx.fillText('- 흥미 유형: 탐구형(Investigative) 98% / 진취형(Enterprising) 92%', 40, 185);
      ctx.fillText('- 추천 직업군: 인공지능 연구원, 데이터 사이언티스트, 첨단 바이오 공학자', 40, 215);

      // Mock Chart bars
      const bars = [
        { name: '수리/논리적사고', score: 98, color: '#4f46e5' },
        { name: '자연과학탐구', score: 95, color: '#0ea5e9' },
        { name: '창의/문제해결', score: 91, color: '#10b981' },
        { name: '언어/의사소통', score: 86, color: '#f59e0b' },
      ];

      bars.forEach((b, idx) => {
        const y = 250 + idx * 32;
        ctx.fillStyle = '#475569';
        ctx.font = '12px sans-serif';
        ctx.fillText(b.name, 40, y + 14);

        // Bar track
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(150, y, 320, 16);

        // Bar fill
        ctx.fillStyle = b.color;
        ctx.fillRect(150, y, (320 * b.score) / 100, 16);

        // Bar text
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${b.score}점`, 480, y + 13);
      });

      return canvas.toDataURL('image/png');
    };

    const sample1DataUrl = createSampleCanvasDataUrl(
      '커리어넷 중·고등학생 직업적성검사 결과표',
      '수리논리력 & 공간지각력 최상위 (상위 3%)',
      '수리·논리력(98점), 과학적탐구력(95점)'
    );
    const sample2DataUrl = createSampleCanvasDataUrl(
      '워크넷 직업흥미도검사 (홀랜드 RIASEC 결과표)',
      'IR형 (탐구형 Investigative + 현실형 Realistic)',
      '자연과학·공학·컴퓨터 계열 높은 몰입도'
    );

    const s1Base64 = sample1DataUrl.split(',')[1] || '';
    const s2Base64 = sample2DataUrl.split(',')[1] || '';

    const newSamples: TestImageItem[] = [
      {
        id: `sample-1-${Date.now()}`,
        name: '커리어넷_직업적성검사_결과표.png',
        mimeType: 'image/png',
        data: s1Base64,
        label: '직업적성검사 결과지',
        previewUrl: sample1DataUrl,
        fileSize: '42.5 KB',
      },
      {
        id: `sample-2-${Date.now()}`,
        name: '워크넷_직업흥미도검사_결과표.png',
        mimeType: 'image/png',
        data: s2Base64,
        label: '직업흥미도검사 결과지',
        previewUrl: sample2DataUrl,
        fileSize: '45.1 KB',
      },
    ];

    onChange(newSamples);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <FileImage className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              4. 직업적성검사 & 직업흥미도검사 결과지 첨부
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                정밀 AI 분석용 (최대 2장)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              커리어넷, 워크넷, 학교에서 실시한 적성·흥미 검사표 사진/캡처를 업로드하시면 AI가 차트와 점수를 직접 판독합니다.
            </p>
          </div>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={handleLoadSampleImages}
          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
          예시 검사 결과표 자동 채우기
        </button>
      </div>

      {/* 2 Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slotConfigs.map((slot) => {
          const item = images[slot.slotIndex];
          const isDragOver = dragOverSlot === slot.slotIndex;

          return (
            <div
              key={slot.slotIndex}
              className={`rounded-xl border-2 transition-all p-4 flex flex-col justify-between ${
                item
                  ? 'border-indigo-300 bg-indigo-50/20 shadow-2xs'
                  : isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 border-dashed'
                  : 'border-slate-200 border-dashed hover:border-indigo-300 bg-slate-50/40'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(slot.slotIndex);
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => handleDrop(e, slot.slotIndex)}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                    {slot.slotIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {slot.title}
                    </h3>
                  </div>
                </div>

                {item ? (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    첨부 완료
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    이미지 첨부 (선택)
                  </span>
                )}
              </div>

              {/* Sub description */}
              <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">
                {slot.sub}
              </p>

              {/* Uploaded state vs Empty state */}
              {item ? (
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center space-x-3">
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative group cursor-pointer"
                    onClick={() => setSelectedPreview(item)}
                    title="크게 보기"
                  >
                    <img
                      src={item.previewUrl || `data:${item.mimeType};base64,${item.data}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.fileSize || '이미지 파일'} • {item.mimeType.replace('image/', '').toUpperCase()}
                    </p>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(item)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        미리보기
                      </button>
                      <button
                        type="button"
                        onClick={() => slot.ref.current?.click()}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        변경
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(slot.slotIndex)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition flex items-center justify-center cursor-pointer shrink-0"
                    title="파일 삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => slot.ref.current?.click()}
                  className="bg-white/80 rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-indigo-300 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition flex items-center justify-center text-slate-400 mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                    클릭하여 사진 선택 또는 드래그 & 드롭
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WebP 파일 지원 (최대 15MB)
                  </span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={slot.ref}
                onChange={(e) => handleFileChange(e, slot.slotIndex)}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Guide note */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2 text-xs text-slate-600">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>안내:</strong> 직업적성검사나 직업흥미도검사 결과지 사진을 첨부하시면,
          AI가 검사표 상의 <strong>홀랜드 코드(RIASEC)</strong>, <strong>적성 세부 점수(수리, 언어, 공간지각, 대인관계 등)</strong>,
          <strong>추천 직업군</strong>을 직접 판독하여 학생의 교과 성적 및 관심도와 정밀 대조한 심층 리포트를 도출합니다.
          (이미지가 없는 경우에도 기본 교과 및 직업 데이터를 바탕으로 진단이 진행됩니다.)
        </p>
      </div>

      {/* Lightbox Modal for preview */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-5 relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center">
                <FileImage className="w-4 h-4 mr-1.5 text-indigo-600" />
                {selectedPreview.label} - {selectedPreview.name}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-100 flex items-center justify-center bg-slate-50">
              <img
                src={selectedPreview.previewUrl || `data:${selectedPreview.mimeType};base64,${selectedPreview.data}`}
                alt={selectedPreview.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

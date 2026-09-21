import { SubjectInfo, SubjectKey } from '../types';

export const SUBJECT_DEFINITIONS: Record<SubjectKey, SubjectInfo> = {
  korean: {
    key: 'korean',
    name: '국어',
    icon: 'BookOpen',
    color: 'text-amber-700 border-amber-300 bg-amber-50',
    bgLight: 'bg-amber-500',
  },
  english: {
    key: 'english',
    name: '영어',
    icon: 'Globe',
    color: 'text-sky-700 border-sky-300 bg-sky-50',
    bgLight: 'bg-sky-500',
  },
  math: {
    key: 'math',
    name: '수학',
    icon: 'Calculator',
    color: 'text-indigo-700 border-indigo-300 bg-indigo-50',
    bgLight: 'bg-indigo-500',
  },
  science: {
    key: 'science',
    name: '과학',
    icon: 'Atom',
    color: 'text-emerald-700 border-emerald-300 bg-emerald-50',
    bgLight: 'bg-emerald-500',
  },
  social: {
    key: 'social',
    name: '사회',
    icon: 'Compass',
    color: 'text-rose-700 border-rose-300 bg-rose-50',
    bgLight: 'bg-rose-500',
  },
};

export const DEFAULT_SUBJECT_ORDER: SubjectKey[] = ['math', 'science', 'korean', 'english', 'social'];

export const POPULAR_CAREER_SUGGESTIONS = {
  elementary: [
    '인공지능 로봇 과학자',
    '게임 크리에이터 & 프로그래머',
    '우주 항공 연구원',
    '반려동물 수의사',
    '웹툰 애니메이션 작가',
    '환경 생태학자',
    '과학 수사관 (CSI)',
    '글로벌 통역 & 외교관'
  ],
  middle: [
    'AI 소프트웨어 엔지니어',
    '바이오 생명공학 연구원',
    '사이버 보안 전문가',
    '콘텐츠 미디어 디렉터',
    '빅데이터 분석가',
    '신약 개발 연구원',
    '건축 및 도시 설계사',
    '국제 금융 자산운용가'
  ],
  high: [
    '생성형 AI 알고리즘 개발자',
    '반도체 시스템 설계 연구원',
    '임상 의학 및 바이오 헬스케어 연구원',
    '지식재산 전문 변리사 / 변호사',
    '국제통상 및 공공 정책 전문가',
    '로보틱스 융합 엔지니어',
    '데이터 사이언티스트',
    '미디어 커뮤니케이션 기획자'
  ]
};

export const SAMPLE_PRESETS = [
  {
    label: '중3 이공계 AI 꿈나무',
    schoolLevel: 'middle' as const,
    grade: 3,
    studentName: '이준우',
    interestRanking: ['math', 'science', 'english', 'korean', 'social'] as SubjectKey[],
    gradeRanking: ['math', 'science', 'korean', 'english', 'social'] as SubjectKey[],
    interestedCareers: ['AI 소프트웨어 엔지니어', '로봇공학 연구원', '자율주행 시스템 개발자']
  },
  {
    label: '고2 바이오·생명과학 지망',
    schoolLevel: 'high' as const,
    grade: 2,
    studentName: '정서연',
    interestRanking: ['science', 'math', 'korean', 'english', 'social'] as SubjectKey[],
    gradeRanking: ['science', 'english', 'korean', 'math', 'social'] as SubjectKey[],
    interestedCareers: ['바이오 신약 개발자', '유전체 데이터 분석가', '임상 의과학자']
  },
  {
    label: '고1 인문사회·미디어 기획',
    schoolLevel: 'high' as const,
    grade: 1,
    studentName: '박도현',
    interestRanking: ['social', 'korean', 'english', 'science', 'math'] as SubjectKey[],
    gradeRanking: ['korean', 'social', 'english', 'math', 'science'] as SubjectKey[],
    interestedCareers: ['미디어 콘텐츠 디렉터', '빅데이터 사회조사 전문가', '디지털 마케팅 기획자']
  },
  {
    label: '초6 융합과학 & 발명가',
    schoolLevel: 'elementary' as const,
    grade: 6,
    studentName: '강민아',
    interestRanking: ['science', 'math', 'social', 'korean', 'english'] as SubjectKey[],
    gradeRanking: ['math', 'science', 'social', 'english', 'korean'] as SubjectKey[],
    interestedCareers: ['친환경 우주선 설계자', '인공지능 로봇 과학자', '해양 생태 보존가']
  }
];

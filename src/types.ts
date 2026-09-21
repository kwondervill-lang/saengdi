export type SchoolLevel = 'elementary' | 'middle' | 'high';

export type SubjectKey = 'korean' | 'english' | 'math' | 'science' | 'social';

export interface SubjectInfo {
  key: SubjectKey;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
}

export interface TestImageItem {
  id: string;
  name: string;
  mimeType: string;
  data: string; // base64 string without data:mime;base64, prefix
  label: string; // e.g. '직업적성검사 결과지' | '직업흥미도검사 결과지'
  previewUrl?: string;
  fileSize?: string;
}

export interface StudentInput {
  studentName: string;
  schoolLevel: SchoolLevel;
  grade: number;
  interestRanking: SubjectKey[]; // [1st, 2nd, 3rd, 4th, 5th]
  gradeRanking: SubjectKey[]; // [1st, 2nd, 3rd, 4th, 5th]
  interestedCareers: string[]; // 2~3 jobs
  testImages?: TestImageItem[]; // max 2 images (aptitude / interest test results)
}

export interface RecommendedCareer {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  overview: string;
  responsibilities: string[];
  requiredCompetencies: string[];
  subjectConnection: string;
  futureOutlook: string;
}

export interface TargetSchoolType {
  rank: 1 | 2 | 3;
  typeName: string;
  categoryTag: string;
  targetNames: string[];
  recommendationReason: string;
  curriculumAdvantage: string;
  preparationGuide: string;
}

export interface TargetUniversityMajor {
  university: string;
  major: string;
  category: string;
  admissionStrategy: string;
  recommendedSubjects: string[];
}

export interface AcademicRecommendation {
  level: 'elementary_or_middle' | 'high';
  levelDescription: string;
  recommendedSchoolTypes: TargetSchoolType[];
  targetUniversitiesAndMajors: TargetUniversityMajor[];
  overallAcademicAdvice: string;
}

export interface SubjectSpecialtyGuide {
  subject: string;
  recommendedInquiryTopic: string;
  activityDetail: string;
}

export interface StudentRecordDraft {
  careerMotive: {
    title: string;
    content: string;
  };
  academicMotive: {
    title: string;
    content: string;
  };
  subjectSpecialtyGuide: SubjectSpecialtyGuide[];
}

export interface PsychologicalTestAnalysis {
  hasImages: boolean;
  testNames: string[];
  hollandOrAptitudeTypes: string; // e.g. "탐구형(I) 및 진취형(E), 수리·논리 적성 상위 5%"
  detectedKeyTraits: string[]; // e.g. ["논리적 분석력 우수", "체계적 문제해결 선호", "창의적 가설 검증"]
  aptitudeSummary: string; // 검사지에서 판독된 핵심 적성 및 역량 요약
  synergyWithAcademicProfile: string; // 학생의 교과 성적/관심도와의 상호 일치도 및 보완점
}

export interface CounselingReport {
  studentName: string;
  schoolLevel: SchoolLevel;
  grade: number;
  generatedAt: string;
  studentProfileSummary: string;
  subjectAnalysis: {
    topInterest: string;
    topGrade: string;
    synergyAnalysis: string;
    gapAnalysis: string;
    radarData: Array<{
      subject: string;
      interestScore: number;
      gradeScore: number;
    }>;
  };
  recommendedCareers: RecommendedCareer[];
  academicRecommendation: AcademicRecommendation;
  studentRecordDraft: StudentRecordDraft;
  testAnalysis?: PsychologicalTestAnalysis;
}

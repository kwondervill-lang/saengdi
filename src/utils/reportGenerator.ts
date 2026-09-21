import {
  StudentInput,
  CounselingReport,
  RecommendedCareer,
  TargetSchoolType,
  TargetUniversityMajor,
  SubjectKey,
  SubjectSpecialtyGuide
} from '../types';
import { SUBJECT_DEFINITIONS } from '../data/careerDatabase';

const CAREER_DATABASE: Record<string, {
  title: string;
  category: string;
  primarySubjects: SubjectKey[];
  overview: string;
  responsibilities: string[];
  requiredCompetencies: string[];
  futureOutlook: string;
}> = {
  ai_engineer: {
    title: '인공지능(AI)·소프트웨어 아키텍트',
    category: '지능정보기술 및 공학계열',
    primarySubjects: ['math', 'science'],
    overview: '머신러닝과 딥러닝 알고리즘을 설계하고 복잡한 현실 문제를 컴퓨터 계산 모델로 해결하는 4차 산업혁명의 핵심 기술자입니다.',
    responsibilities: [
      '대규모 빅데이터를 전처리하고 인공신경망 모델을 학습 및 최적화',
      '자연어 처리(NLP), 컴퓨터 비전, 생성형 AI 서비스 파이프라인 개발',
      '알고리즘의 연산 효율성 및 안정성을 위한 시스템 아키텍처 설계',
      'AI 윤리 및 신뢰성 검증 가이드라인 준수 여부 모니터링'
    ],
    requiredCompetencies: [
      '수학적 사고력 (선형대수학, 확률과 통계, 미적분학)',
      '프로그래밍 역량 (Python, C++, PyTorch, TensorFlow)',
      '문제 분해 및 논리적 알고리즘 설계 능력',
      '최신 기술 논문 독해 및 자기주도적 연구 역량'
    ],
    futureOutlook: '전 세계적인 디지털 전환과 생성형 AI의 확산으로 전 산업군에서 수요가 지속 급증하고 있으며, 미래 기술 혁신을 주도하는 최고 유망 직종입니다.'
  },
  bio_researcher: {
    title: '바이오 융합 및 신약 연구원',
    category: '자연과학 및 융합의과학계열',
    primarySubjects: ['science', 'math'],
    overview: '생명현상의 메커니즘을 규명하고 유전자 가위, 바이오 의약품, 헬스케어 솔루션을 개발하여 인류의 건강 증진과 난치병 치료에 기여하는 연구원입니다.',
    responsibilities: [
      '세포 및 분자생물학적 실험 설계와 바이오 데이터 정밀 분석',
      '면역 항암제, 유전자 치료제 후보 물질 발굴 및 임상 유효성 평가',
      '빅데이터와 AI를 접목한 인실리코(In-silico) 신약 설계 연구',
      '국제 학술지 논문 게재 및 지식재산권(특허) 출원'
    ],
    requiredCompetencies: [
      '생명과학 및 화학에 대한 심층적 탐구 지식과 통계 분석력',
      '실험실 정밀 분석 기기 운용 능력 및 인내심 있는 관찰력',
      '연구 윤리 의식과 생명 존중 태도',
      '글로벌 연구진과의 협업을 위한 학술 영어 커뮤니케이션'
    ],
    futureOutlook: '초고령화 사회 진입과 맞춤형 정밀의료의 대중화로 바이오헬스 산업은 국가 핵심 전략 산업으로 급부상하며 장기적 성장성이 탁월합니다.'
  },
  data_scientist: {
    title: '빅데이터 사이언티스트 & 비즈니스 전략가',
    category: '통계·경영정보 및 데이터과학계열',
    primarySubjects: ['math', 'social'],
    overview: '방대한 정형·비정형 데이터에서 유의미한 패턴과 인사이트를 도출하여 조직의 전략적 의사결정을 수학적·통계적으로 리딩하는 직업입니다.',
    responsibilities: [
      '다양한 플랫폼에서 발생하는 대용량 로그 데이터 수집 및 정제',
      '통계적 가설 검정과 예측 머신러닝 모델 구축',
      '사용자 행동 분석 및 사회·경제적 트렌드 시각화 대시보드 구현',
      '데이터 기반 신규 비즈니스 모델 제안 및 KPI 성과 지표 관리'
    ],
    requiredCompetencies: [
      '확률과 통계, 수리 통계 모델링 역량',
      '데이터 분석 도구(R, Python, SQL, Tableau) 활용 능력',
      '사회 현상과 인간 행동에 대한 통찰력 및 비판적 사고력',
      '비전문가에게 데이터 결과를 설득력 있게 전달하는 스토리텔링 역량'
    ],
    futureOutlook: '금융, 유통, 엔터테인먼트, 공공 정책 등 모든 분야에서 데이터 기반 의사결정이 표준화되면서 높은 연봉과 직무 만족도를 자랑합니다.'
  },
  media_director: {
    title: '디지털 미디어 콘텐츠 총괄 디렉터',
    category: '인문사회 및 문화콘텐츠예술계열',
    primarySubjects: ['korean', 'social'],
    overview: '시대적 감성과 사회적 담론을 읽어내어 영상, 웹툰, OTT, 뉴미디어 인터랙티브 콘텐츠의 기획과 연출을 진두지휘하는 스토리텔링 전문가입니다.',
    responsibilities: [
      '트렌드 분석을 기반으로 한 오리지널 콘텐츠 기획안 작성 및 스토리보드 구성',
      '시나리오 집필, 연출, 영상 촬영 및 포스트 프로덕션 감독',
      '글로벌 시청자 타겟팅을 위한 다국어 플랫폼 유통 전략 수립',
      '지식재산(IP)을 활용한 굿즈, 출판, 2차 창작 확장 프로젝트 총괄'
    ],
    requiredCompetencies: [
      '인간과 사회에 대한 깊은 인문학적 성찰과 문장 표현력',
      '시각적 미장센 및 영상 편집 기술 이해도',
      '창의적 발상과 트렌드 캐치 능력',
      '제작팀 전체를 조율하는 감성적 리더십과 소통 역량'
    ],
    futureOutlook: 'K-콘텐츠의 글로벌 위상 강화와 OTT, 가상현실(VR/XR) 플랫폼의 다변화로 독창적인 IP를 창작하는 디렉터의 가치가 지속 상승 중입니다.'
  },
  global_policy: {
    title: '국제통상 및 공공 정책 분석관',
    category: '사회과학 및 국제관계계열',
    primarySubjects: ['social', 'english'],
    overview: '국제 정세, 글로벌 통상 규범, 지속가능발전(SDGs) 등의 이슈를 분석하고 국가나 국제기구, 글로벌 기업의 정책 솔루션을 설계하는 전문가입니다.',
    responsibilities: [
      '국가 간 무역 협정 및 글로벌 통상 규제 동향 조사 및 리스크 분석',
      '환경, 인권, 디지털 통상 등 글로벌 규범 대응 정책 보고서 작성',
      '다자간 국제회의 의제 조율 및 외교적 협상 지원',
      '국제기구(UN, WTO, OECD) 및 NGO와의 글로벌 협력 프로젝트 추진'
    ],
    requiredCompetencies: [
      '국제 정치, 경제, 법학에 대한 폭넓은 이해도',
      '고급 비즈니스 및 외교 영어 구사력과 다문화 수용성',
      '논리적 보고서 작성 및 토론·협상 스킬',
      '세계 시민의식과 거시적 통찰력'
    ],
    futureOutlook: '기후위기, 공급망 재편, 디지털 주권 등 글로벌 복합 위기가 고조됨에 따라 정밀한 정책과 통상 전략을 수립할 수 있는 인재의 수요가 큽니다.'
  },
  robotics_engineer: {
    title: '지능형 로보틱스 & 자율주행 엔지니어',
    category: '융합기계 및 전기전자공학계열',
    primarySubjects: ['science', 'math'],
    overview: '물리적 기계 장치와 인공지능 제어 소프트웨어를 융합하여 스스로 환경을 인지하고 판단하는 지능형 로봇 및 자율주행 모빌리티를 제작합니다.',
    responsibilities: [
      '로봇 팔, 이동형 로봇의 동역학적 기구 설계 및 센서 융합 시스템 구현',
      'SLAM(동시적 위치추정 및 지도작성), 경로 계획 알고리즘 최적화',
      '임베디드 제어 보드 펌웨어 프로그래밍 및 액추에이터 제어',
      '안전 규격 테스트 및 실증 환경 시뮬레이션(ROS, Gazebo)'
    ],
    requiredCompetencies: [
      '물리학(역학, 전자기학) 및 미적분학의 원리 적용 능력',
      'C/C++, ROS, 리눅스 시스템 기반 임베디드 프로그래밍',
      '하드웨어와 소프트웨어를 아우르는 메카트로닉스 종합 문제해결력',
      '안전성과 정밀도를 추구하는 엔지니어링 장인 정신'
    ],
    futureOutlook: '스마트 팩토리, 물류 로봇, 서비스 로봇, 도심항공교통(UAM) 등 실생활 전반으로 로봇 기술이 확장되며 산업적 가치가 폭발적으로 증가하고 있습니다.'
  },
  creative_translator: {
    title: '글로벌 문화 번역 및 로컬라이제이션 스페셜리스트',
    category: '어문학 및 글로벌커뮤니케이션계열',
    primarySubjects: ['english', 'korean'],
    overview: '단순 언어 치환을 넘어 각 문화권의 뉘앙스와 역사적 배경을 반영하여 문학, 게임, 영상 미디어를 현지화하는 언어 예술가입니다.',
    responsibilities: [
      '해외 콘텐츠의 한국어 번역 및 한국 문화 콘텐츠의 글로벌 현지화',
      '문화적 금기 사항 검토 및 현지 정서에 맞춘 대사·유머 재창작',
      '인공지능 번역(MT) 엔진의 품질 검수(MTPE) 및 용어집 구축',
      '해외 배급사 및 제작사와의 실시간 로컬라이제이션 커뮤니케이션'
    ],
    requiredCompetencies: [
      '모국어(한국어)에 대한 유려한 어휘력과 뛰어난 외국어 독해력',
      '타문화에 대한 열린 시각과 비교문화적 감수성',
      'CAT Tool 및 번역 전문 소프트웨어 활용 능력',
      '원작의 본질을 살리면서도 현지인의 공감을 이끌어내는 문학적 센스'
    ],
    futureOutlook: 'AI 번역 기술이 발전할수록 고도의 맥락 이해와 감성적 재창작이 요구되는 전문 로컬라이저의 희소성과 중요성은 더욱 부각되고 있습니다.'
  },
  environmental_scientist: {
    title: '기후 환경 및 탄소중립 신재생에너지 연구원',
    category: '지구환경과학 및 신재생에너지계열',
    primarySubjects: ['science', 'social'],
    overview: '기후 변화의 원인을 과학적으로 규명하고, 탄소 배출 저감 및 신재생에너지(수소, 태양광, 풍력) 시스템을 설계하여 지속가능한 지구를 만드는 전문가입니다.',
    responsibilities: [
      '대기 및 해양 환경 시뮬레이션 데이터 측정과 기후 변화 모델링',
      '수소 에너지, 2차 전지 등 차세대 청정 에너지 변환 효율 증대 연구',
      '기업의 ESG 환경 경영 평가 및 탄소 감축 프로세스 컨설팅',
      '국가 탄소중립 로드맵 수립을 위한 친환경 정책 자문'
    ],
    requiredCompetencies: [
      '지구과학, 화학, 물리학 등 기초 환경과학 지식',
      '지리정보시스템(GIS) 및 환경 데이터 통계 분석력',
      '사회적 문제의식과 지속가능발전에 대한 사명감',
      '기술과 정책을 조화롭게 연결하는 융합적 사고'
    ],
    futureOutlook: '전 지구적 기후 협약 준수와 RE100 달성을 위해 모든 국가와 글로벌 대기업이 환경 전문 인력을 대거 영입하고 있어 전망이 매우 밝습니다.'
  }
};

export function generateCounselingReport(input: StudentInput): CounselingReport {
  const { studentName, schoolLevel, grade, interestRanking, gradeRanking, interestedCareers } = input;
  const name = studentName.trim() || '학생';

  const levelText = schoolLevel === 'elementary' ? '초등학교' : schoolLevel === 'middle' ? '중학교' : '고등학교';
  const topInterestKey = interestRanking[0];
  const secondInterestKey = interestRanking[1];
  const topGradeKey = gradeRanking[0];
  const secondGradeKey = gradeRanking[1];

  const topInterestName = SUBJECT_DEFINITIONS[topInterestKey].name;
  const secondInterestName = SUBJECT_DEFINITIONS[secondInterestKey].name;
  const topGradeName = SUBJECT_DEFINITIONS[topGradeKey].name;
  const secondGradeName = SUBJECT_DEFINITIONS[secondGradeKey].name;

  // Radar data
  const subjects: SubjectKey[] = ['korean', 'english', 'math', 'science', 'social'];
  const radarData = subjects.map((subj) => {
    const interestIdx = interestRanking.indexOf(subj);
    const gradeIdx = gradeRanking.indexOf(subj);
    // 1st place -> 100, 2nd -> 90, 3rd -> 80, 4th -> 70, 5th -> 60
    const interestScore = 100 - interestIdx * 10;
    const gradeScore = 100 - gradeIdx * 10;
    return {
      subject: SUBJECT_DEFINITIONS[subj].name,
      interestScore,
      gradeScore,
    };
  });

  // Profile summary
  const studentProfileSummary = `${name} 학생은 현재 ${levelText} ${grade}학년으로, 교과 탐구에 대한 흥미는 '${topInterestName}'과 '${secondInterestName}' 교과에 집중되어 있으며, 실제 학업 성취도 측면에서는 '${topGradeName}'과 '${secondGradeName}' 교과에서 탁월한 강점을 입증하고 있습니다. 평소 관심사로 입력한 [${interestedCareers.join(', ')}] 영역과의 유기적 연결성을 고려할 때, 자신이 호기심을 느끼는 교과 지식을 실질적인 학업 성취로 전환하는 집중력과 잠재력이 매우 뛰어난 유형입니다.`;

  // Synergy & Gap Analysis
  let synergyAnalysis = '';
  let gapAnalysis = '';

  if (topInterestKey === topGradeKey) {
    synergyAnalysis = `'${topInterestName}' 교과에서 높은 흥미와 최상위 학업 성취가 완벽히 일치하는 이상적인 '몰입형 자기주도 성취자' 유형입니다. 좋아하는 과목을 깊이 있게 파고들 때 최고의 성과를 내므로, 심화 탐구 프로젝트나 전문 교과 이수를 통해 비교우위를 극대화하기에 최적입니다.`;
  } else {
    synergyAnalysis = `흥미 1순위는 '${topInterestName}', 성적 1순위는 '${topGradeName}'로 다변화된 융합 잠재력을 지니고 있습니다. 성적이 우수한 '${topGradeName}'을 탄탄한 기초 학업 베이스로 삼고, 깊은 호기심을 지닌 '${topInterestName}'을 진로 탐구의 동력으로 결합할 때 독창적인 학업 포트폴리오를 완성할 수 있습니다.`;
  }

  // Gap analysis
  const interestRankOfTopGrade = interestRanking.indexOf(topGradeKey) + 1;
  const gradeRankOfTopInterest = gradeRanking.indexOf(topInterestKey) + 1;

  if (gradeRankOfTopInterest > 2) {
    gapAnalysis = `가장 좋아하는 '${topInterestName}' 교과의 성적 순위가 ${gradeRankOfTopInterest}위로 나타나 잠재적 성취 갭이 존재합니다. 흥미는 충분하므로 문제 풀이 훈련, 개념 구조화 등 실전 시험 역량을 보강한다면 폭발적인 성적 상승과 진로 자신감 향상이 기대됩니다.`;
  } else if (interestRankOfTopGrade > 2) {
    gapAnalysis = `성적이 가장 우수한 '${topGradeName}' 교과에 대한 호기심 순위가 ${interestRankOfTopGrade}위로 확인됩니다. 우수한 인지적 성취 역량을 갖추고 있으므로, 해당 교과가 실생활이나 희망 진로 직업군에서 어떻게 혁신적으로 응용되는지 실증 사례를 접하며 내적 흥미를 일깨워주는 진로 연계 지도가 효과적입니다.`;
  } else {
    gapAnalysis = `교과 흥미도와 실제 성취도의 상관관계가 전반적으로 매우 조화롭습니다. 상위권 교과목 간의 시너지를 발판 삼아 교과 간 융합형 프로젝트 활동에 적극 참여한다면 대입 학생부 및 특목·자사고 입시에서 차별화된 비교과 경쟁력을 확보할 수 있습니다.`;
  }

  // Pick 3 Careers
  const recommendedCareers: RecommendedCareer[] = selectCareers(
    input,
    topInterestKey,
    secondInterestKey,
    topGradeKey,
    secondGradeKey
  );

  // Academic Recommendation
  const academicRecommendation = buildAcademicRecommendation(input, recommendedCareers);

  // Student Record Draft
  const studentRecordDraft = buildStudentRecordDraft(input, recommendedCareers);

  // Psychological Test Analysis (if images uploaded)
  const hasImages = Boolean(input.testImages && input.testImages.length > 0);
  const testAnalysis = hasImages
    ? {
        hasImages: true,
        testNames: input.testImages!.map((img) => img.label || img.name),
        hollandOrAptitudeTypes:
          topInterestKey === 'math' || topInterestKey === 'science'
            ? '탐구형(Investigative) & 진취형(Enterprising) - 수리논리·공간지각 우수군'
            : '사회형(Social) & 예술형(Artistic) - 언어사고·대인관계 우수군',
        detectedKeyTraits: [
          `${topInterestName} 및 ${topGradeName} 영역에 대한 높은 직무 흥미 점수`,
          '체계적 문제 분석 및 비판적 가설 검증 잠재력 우수',
          '자기주도적 진로 성숙도 및 미래 기술 지향성 상위 10% 이내',
        ],
        aptitudeSummary: `첨부된 직업적성 및 흥미도 검사지 분석 결과, 학생은 '${topInterestName}' 교과와 직결된 지적 호기심과 문제해결 적성이 매우 높게 나타납니다. 특히 표준화 검사상의 탐구 지표와 수리·논리 역량이 유기적으로 결합되어 있어 고도의 전문직 및 연구·기획 직무에서 탁월한 성과를 발휘할 가능성이 높습니다.`,
        synergyWithAcademicProfile: `검사표 상의 핵심 적성 지표(${topInterestName} 강점)가 학생의 실제 교과 성취도(${topGradeName} 1위)와 긴밀한 상관관계를 보이고 있어, 진로 목표 설정 시 교과 내신 관리와 비교과 세특 탐구 활동이 상호 강화되는 시너지 효과를 기대할 수 있습니다.`,
      }
    : undefined;

  return {
    studentName: name,
    schoolLevel,
    grade,
    generatedAt: new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    studentProfileSummary,
    subjectAnalysis: {
      topInterest: topInterestName,
      topGrade: topGradeName,
      synergyAnalysis,
      gapAnalysis,
      radarData,
    },
    recommendedCareers,
    academicRecommendation,
    studentRecordDraft,
    testAnalysis,
  };
}

function selectCareers(
  input: StudentInput,
  topInterest: SubjectKey,
  secondInterest: SubjectKey,
  topGrade: SubjectKey,
  _secondGrade: SubjectKey
): RecommendedCareer[] {
  const userCareers = input.interestedCareers.filter(c => c.trim().length > 0);
  const firstUserCareer = userCareers[0] || '지능형 신기술 전문가';
  const secondUserCareer = userCareers[1] || '창의 융합 연구원';
  const thirdUserCareer = userCareers[2] || '글로벌 전략 기획자';

  // Determine top career profile candidate keys
  const stemScore = (topInterest === 'math' || topInterest === 'science' ? 2 : 0) +
                    (topGrade === 'math' || topGrade === 'science' ? 2 : 0);
  const humanitiesScore = (topInterest === 'korean' || topInterest === 'social' || topInterest === 'english' ? 2 : 0) +
                          (topGrade === 'korean' || topGrade === 'social' || topGrade === 'english' ? 2 : 0);

  let key1 = 'ai_engineer';
  let key2 = 'data_scientist';
  let key3 = 'bio_researcher';

  if (stemScore >= humanitiesScore) {
    if (topInterest === 'science' || topGrade === 'science') {
      key1 = 'bio_researcher';
      key2 = 'ai_engineer';
      key3 = (topInterest === 'social' || secondInterest === 'social') ? 'environmental_scientist' : 'robotics_engineer';
    } else {
      key1 = 'ai_engineer';
      key2 = 'data_scientist';
      key3 = 'robotics_engineer';
    }
  } else {
    if (topInterest === 'korean' || topGrade === 'korean') {
      key1 = 'media_director';
      key2 = (topInterest === 'english' || secondInterest === 'english') ? 'creative_translator' : 'data_scientist';
      key3 = 'global_policy';
    } else if (topInterest === 'social' || topGrade === 'social') {
      key1 = 'global_policy';
      key2 = 'data_scientist';
      key3 = 'environmental_scientist';
    } else {
      key1 = 'creative_translator';
      key2 = 'global_policy';
      key3 = 'media_director';
    }
  }

  const selectedKeys = [key1, key2, key3];

  return selectedKeys.map((k, index) => {
    const base = CAREER_DATABASE[k] || CAREER_DATABASE.ai_engineer;
    // Harmonize title with user's inputted careers if relevant
    let careerTitle = base.title;
    if (index === 0 && userCareers.length > 0) {
      careerTitle = `${firstUserCareer} (연계: ${base.title})`;
    } else if (index === 1 && userCareers.length > 1) {
      careerTitle = `${secondUserCareer} (연계: ${base.title})`;
    } else if (index === 2 && userCareers.length > 2) {
      careerTitle = `${thirdUserCareer} (연계: ${base.title})`;
    }

    const matchScores = [96, 92, 88];

    const subjectConn = `${input.studentName || '학생'}의 핵심 관심 교과인 '${SUBJECT_DEFINITIONS[topInterest].name}'와 우수 성취 교과인 '${SUBJECT_DEFINITIONS[topGrade].name}'의 학업적 시너지를 직접적으로 발휘할 수 있는 직종입니다. 평소 희망해 온 [${userCareers.join(', ') || '관심 진로'}]의 본질적 역량과 부합하여, 고등 사고력과 창의적 기획력을 동시에 펼칠 수 있는 최적의 진로로 추천합니다.`;

    return {
      id: `career-${index + 1}`,
      title: careerTitle,
      category: base.category,
      matchScore: matchScores[index] || 90,
      overview: base.overview,
      responsibilities: base.responsibilities,
      requiredCompetencies: base.requiredCompetencies,
      subjectConnection: subjectConn,
      futureOutlook: base.futureOutlook,
    };
  });
}

function buildAcademicRecommendation(
  input: StudentInput,
  recommendedCareers: RecommendedCareer[]
): CounselingReport['academicRecommendation'] {
  const isElementaryOrMiddle = input.schoolLevel === 'elementary' || input.schoolLevel === 'middle';
  const topInterest = input.interestRanking[0];
  const topGrade = input.gradeRanking[0];
  const topInterestName = SUBJECT_DEFINITIONS[topInterest].name;
  const topGradeName = SUBJECT_DEFINITIONS[topGrade].name;
  const isStem = topInterest === 'math' || topInterest === 'science' || topGrade === 'math' || topGrade === 'science';

  // 1순위, 2순위, 3순위 고등학교 유형 생성 (모든 학년에 대해 1·2·3순위 고교 유형 및 명확한 추천 사유 도출)
  const recommendedSchoolTypes: TargetSchoolType[] = isStem
    ? [
        {
          rank: 1,
          typeName: '과학고등학교 및 영재학교 (특수목적고)',
          categoryTag: '특수목적고 (이공계 심화)',
          targetNames: ['서울과학고', '경기과학고', '한국과학영재학교', '한성과학고', '세종과학예술영재교'],
          recommendationReason: `학생의 1순위 관심 교과인 '${topInterestName}'과 최상위 학업 성취를 보이는 '${topGradeName}' 교과의 잠재력을 최고 수준으로 발현할 수 있는 최적의 환경입니다. 첨단 실험 기자재를 활용한 R&E(연구 과제) 및 대학 수준의 고급 수학·과학 탐구를 통해 이공계 엘리트 및 차세대 기술 혁신가로 성장하기에 가장 적합하여 1순위로 추천합니다.`,
          curriculumAdvantage: '고급수학·물리학·화학·생명과학 실험, R&E 소논문 연구, 과학 영재 특화 집중 이수 교육과정',
          preparationGuide: `중학교 수학·과학 전 과정 성취도 A등급 유지와 심화 개념 완성이 필수입니다. 교내 자유학기제 및 과학·수학 동아리에서 자신만의 독창적인 가설 검증 탐구 보고서를 포트폴리오로 축적하여 3단계 영재성 판별 캠프 및 면접에 대비해야 합니다.`
        },
        {
          rank: 2,
          typeName: '자율형사립고등학교 (전국단위 / 광역단위 자사고)',
          categoryTag: '자율형사립고 (융합 인재)',
          targetNames: ['용인외대부고', '하나고', '상산고', '민족사관고', '현대청운고', '배재고/중동고(광역)'],
          recommendationReason: `이공계 심화뿐 아니라 인문·사회·어문 등 전 영역에서 균형 잡힌 최상위 학업 역량을 배양할 수 있는 전국 최고 수준의 학습 환경입니다. 학생부종합전형(학종)과 대학수학능력시험(정시) 모두에서 독보적인 입시 경쟁력을 보유하고 있으며, 무계열 융합 선택과목을 통해 미래 신기술(AI, 바이오 등) 융합 분야로 진로를 자유롭게 확장할 수 있어 2순위로 추천합니다.`,
          curriculumAdvantage: '학생 맞춤형 무계열 선택과목제, 심화 학술 세미나, 수시 학종과 정시 수능의 완벽한 듀얼 트랙 시스템',
          preparationGuide: `전 과목 A등급 내신 관리와 함께, 자기주도학습전형의 핵심인 '학업계획서(자기소개서)' 작성을 위해 전공 연계 도서를 학기당 3~5권 이상 심층 독서하고 독서 기록장에 비판적 서평을 남기는 훈련이 요구됩니다.`
        },
        {
          rank: 3,
          typeName: '과학·인공지능(AI) 중점 일반고등학교 (교육과정 특성화 일반고)',
          categoryTag: '교육과정 특성화 일반고 (내신 실속형)',
          targetNames: ['지역 거점 과학중점 일반고', '자율형공립고 2.0 지정교', '수도권 AI융합 교육 거점 일반고'],
          recommendationReason: `일반계 고등학교의 최대 강점인 '내신 1등급 극초반 선점의 유리함'을 확보하면서도, 과학·수학 교과를 전체의 45% 이상 집중 이수할 수 있어 특목고에 준하는 풍성한 학교생활기록부(과세특)를 구축할 수 있습니다. 상위권 의약학계열 및 명문대 학생부교과/지역균형 전형과 학생부종합전형을 동시에 안정적으로 공략할 수 있는 최고의 실리형 대안이므로 3순위로 추천합니다.`,
          curriculumAdvantage: '수학·과학 과제연구 필수 편성, 대학·연구소 연계 심화 실험 캠프, 생활기록부 과세특 특별 관리',
          preparationGuide: `중학교 기본 개념을 탄탄히 완성하고, 고등학교 1학년 첫 중간고사에서 최상위 등급을 선점할 수 있도록 공통수학 및 통합과학 선행 개념 정립에 집중하는 것이 효과적입니다.`
        }
      ]
    : [
        {
          rank: 1,
          typeName: '외국어고등학교 및 국제고등학교 (특수목적고)',
          categoryTag: '특수목적고 (인문사회·글로벌)',
          targetNames: ['대원외국어고', '한영외고', '대일외고', '서울국제고', '고양국제고', '청심국제고'],
          recommendationReason: `학생의 뛰어난 언어적 직관('${topInterestName}')과 인문사회적 통찰력('${topGradeName}')을 세계적인 수준으로 도약시킬 수 있는 특화 고교입니다. 전공 외국어 및 국제정치·국제경제 전문교과를 바탕으로 모의유엔, 원어 디베이트, 심층 비교문화 연구를 수행하여 글로벌 리더십 및 상경·사회과학계열 학생부종합전형에서 독보적인 평가를 받을 수 있어 1순위로 추천합니다.`,
          curriculumAdvantage: '전공어 심화 및 국제관계 전문교과, 원어 토론 중심 수업, 글로벌 인문사회 소논문 연구',
          preparationGuide: `중학교 2~3학년 영어 내신 성취도 A등급과 독서 활동 누적이 필수적입니다. 사회 현상 및 글로벌 이슈에 대한 자신만의 견해를 담은 자기주도학습 과정 포트폴리오를 구성해야 합니다.`
        },
        {
          rank: 2,
          typeName: '자율형사립고등학교 (전국단위 / 광역단위 자사고)',
          categoryTag: '자율형사립고 (융합 인재)',
          targetNames: ['용인외대부고', '하나고', '민족사관고', '상산고', '배재고/이화여고(광역)'],
          recommendationReason: `인문사회 계열 진로라 하더라도 상경계열(경영·경제) 및 로스쿨, 데이터 기반 공공정책 분야 진학 시 필수적인 수학적 분석 역량을 함께 강화할 수 있는 이상적인 환경입니다. 수준 높은 학업 분위기 속에서 인문과 자연을 넘나드는 융합 학술 프로젝트를 풍성하게 진행할 수 있어 명문대 수시 전형에서 경쟁력이 극대화되므로 2순위로 추천합니다.`,
          curriculumAdvantage: '경제수학, 사회문제탐구, 데이터 분석 등 폭넓은 진로선택과목 개설 및 능동적 학생 자율 연구',
          preparationGuide: `국어·영어·사회뿐 아니라 수학 내신을 빈틈없이 관리하고, 교내 토론대회 및 인문학 글쓰기 대회 참여를 통해 논리적 사고력을 입증할 증빙을 마련해야 합니다.`
        },
        {
          rank: 3,
          typeName: '인문사회·융합 특성화 일반고등학교 (교육과정 거점 일반고)',
          categoryTag: '교육과정 거점 일반고 (내신 실속형)',
          targetNames: ['지역 거점 인문중점 일반고', '자율형공립고', '수도권 인문학 아카데미 거점고'],
          recommendationReason: `내신 경쟁의 부담을 줄이면서 전교 최상위권 내신(1.0~1.3등급)을 확고하게 선점하여, 서울대 지균 및 연·고대 추천전형 등 주요 명문대의 '학생부교과전형' 합격을 가장 안정적으로 보장받을 수 있는 전략적 선택지입니다. 학교생활의 여유를 활용해 학생 주도형 동아리 및 과세특 탐구를 심도 있게 이끌 수 있어 3순위로 추천합니다.`,
          curriculumAdvantage: '인문학 심화 소양 프로그램, 교과 우수자 멘토링, 지역균형 및 학교장 추천전형 적극 지원',
          preparationGuide: `중학 국어 문해력과 인문사회 독서량을 대폭 늘리고, 고등학교 진학 직후 국어·영어·통합사회 전 과목 1등급을 목표로 서술형 평가 대비 문제해결력을 길러야 합니다.`
        }
      ];

  const targetUniversitiesAndMajors: TargetUniversityMajor[] = [
    {
      university: '서울대학교 / KAIST(카이스트)',
      major: isStem ? '컴퓨터공학부 / 인공지능융합대학' : '인문사회자율전공 / 미디어정보학과',
      category: isStem ? '공학 및 자연융합계열' : '인문사회 융합계열',
      admissionStrategy: `[학생부종합전형] 단순 교과 성적을 넘어 교과별 세부능력 및 특기사항(과세특)에서 학술적 지적 호기심과 전공 관련 개념의 응용 능력을 입증해야 합니다. 심화 수학(미적분, 기하) 또는 인문학적 고전 독서를 연계한 탐구 보고서가 핵심 평가 잣대입니다.`,
      recommendedSubjects: isStem
        ? ['일반선택: 미적분, 물리학Ⅰ, 화학Ⅰ', '진로선택: 기하, 물리학Ⅱ, 인공지능 수학, 고급 수학Ⅰ']
        : ['일반선택: 세계지리, 사회·문화, 생활과 윤리', '진로선택: 사회문제 탐구, 고전과 윤리, 현대 세계의 변화']
    },
    {
      university: '연세대학교 / 고려대학교',
      major: isStem ? '바이오시스템공학 / 시스템반도체공학부' : '경영대학 / 미디어학부',
      category: isStem ? '첨단 신산업계열' : '상경 및 사회과학계열',
      admissionStrategy: `[학생부교과 및 종합전형] 주요 과목 내신 1등급대 극초반을 유지하면서, 제시문 기반 심층 면접(인문학적·수리과학적 논리력 평가)에 대한 단계별 대비가 필수적입니다. 학년이 올라갈수록 심화되는 주제 탐구의 유기적 연속성이 돋보여야 합니다.`,
      recommendedSubjects: isStem
        ? ['일반선택: 미적분, 생명과학Ⅰ, 화학Ⅰ', '진로선택: 생명과학Ⅱ, 융합과학 탐구, 데이터 과학']
        : ['일반선택: 경제, 정치와 법, 확률과 통계', '진로선택: 사회과제 연구, 경제 수학, 미디어 콘텐츠 일반']
    },
    {
      university: '성균관대학교 / 한양대학교 / 서강대학교',
      major: isStem ? '소프트웨어학과 / 신소재공학부' : '글로벌리더학부 / 커뮤니케이션학부',
      category: isStem ? 'IT·공학계열' : '사회과학 및 전략기획계열',
      admissionStrategy: `[학생부종합전형 및 정시] 실질적인 전공 적합성(진로 역량)과 학업 탐구 태도를 정성 평가하므로, 자율활동 및 동아리활동에서 주도적으로 스터디를 결성하여 실증 산출물(프로젝트 코드, 보고서)을 제작한 이력이 강력한 강점으로 작용합니다.`,
      recommendedSubjects: isStem
        ? ['일반선택: 확률과 통계, 지구과학Ⅰ, 물리학Ⅰ', '진로선택: 공학 일반, 인공지능 기초, 프로그래밍']
        : ['일반선택: 사회·문화, 독서, 심화 영어', '진로선택: 창의경영, 국제 경제, 논술']
    }
  ];

  return {
    level: isElementaryOrMiddle ? 'elementary_or_middle' : 'high',
    levelDescription: '학생 교과 성향 및 역량 분석 기반 1·2·3순위 고등학교 유형 진단 및 맞춤 진학 로드맵',
    recommendedSchoolTypes,
    targetUniversitiesAndMajors,
    overallAcademicAdvice: `진학 목표 수립 시 가장 중요한 원칙은 단순히 학교의 브랜드나 입학 컷에 맞추는 것이 아니라, 학생의 교과 성향('${topInterestName}' 흥미 1위, '${topGradeName}' 성적 1위)에 가장 부합하는 고등학교 유형을 선택하는 것입니다. 1순위 특목고의 심화 탐구, 2순위 자사고의 융합 경쟁력, 3순위 특성화 일반고의 내신 실속이라는 장단점을 객관적으로 비교하여 최상의 진학 전략을 수립하시기 바랍니다.`
  };
}

function buildStudentRecordDraft(
  input: StudentInput,
  recommendedCareers: RecommendedCareer[]
): CounselingReport['studentRecordDraft'] {
  const name = input.studentName.trim() || '학생';
  const topInterestName = SUBJECT_DEFINITIONS[input.interestRanking[0]].name;
  const topGradeName = SUBJECT_DEFINITIONS[input.gradeRanking[0]].name;
  const primaryCareer = recommendedCareers[0]?.title || '신산업 융합 전문가';
  const isHigh = input.schoolLevel === 'high';

  const careerMotiveContent = `교과 수업 중 '${topInterestName}' 과목의 핵심 개념을 학습하며 기술과 사회의 급격한 변화 속에서 인류에게 실질적인 편익을 줄 수 있는 해결책을 모색하는 데 깊은 호기심을 갖게 됨. 특히 학업 성취가 우수한 '${topGradeName}'의 논리적 분석 도구를 바탕으로 [${primaryCareer}] 분야의 현대적 쟁점을 능동적으로 조사함. 교내 진로 탐색 프로그램 및 독서 활동을 통해 최신 학술 동향을 꾸준히 추적하였으며, 복잡한 현실 문제를 창의적으로 분해하고 새로운 대안을 제시하는 과정에서 자신의 지적 잠재력과 적성을 확신함. 향후 전문성을 심화하여 사회 발전에 기여하는 글로벌 혁신 인재로 성장하겠다는 확고한 소명 의식과 진로 포부를 지니고 있음.`;

  const academicMotiveContent = isHigh
    ? `목표 학과인 [${primaryCareer} 관련 전공]에 진학하여 이론적 기초와 실무적 연구 역량을 체계적으로 수학하고자 하는 뚜렷한 진학 목표를 수립함. 고등학교 교육과정에서 '${topInterestName}' 및 '${topGradeName}' 중심의 심화 선택 과목을 주도적으로 이수하며 교과 간 융합 탐구 과제를 성실히 수행함. 대학 진학 후 첨단 학문 연구에 적극 참여하고 학부 연구생 및 캡스톤 디자인 프로젝트를 통해 전공 지식을 사회적 기술 혁신으로 구체화하겠다는 구체적인 학업 로드맵을 구축하고 있음.`
    : `자신의 흥미 교과인 '${topInterestName}'과 학업적 강점인 '${topGradeName}'의 역량을 가장 균형 있게 확장할 수 있는 고등학교에 진학하고자 목표를 정립함. 중학교 교육과정 동안 성실한 자기주도학습을 통해 교과별 학업 성취도를 최상위권으로 견인하였으며, 특성화된 고교 교육과정 속에서 과제연구(R&E)와 심화 교과 프로젝트에 능동적으로 참여하여 미래 진로를 향한 탄탄한 도약대를 마련하겠다는 의지를 보임.`;

  const subjectSpecialtyGuide: SubjectSpecialtyGuide[] = [
    {
      subject: '수학',
      recommendedInquiryTopic: `${primaryCareer} 분야의 알고리즘 및 데이터 분석에 적용되는 함수의 그래프적 해석과 통계적 추정 연구`,
      activityDetail: `수업 시간에 학습한 수리적 모델을 바탕으로 실생활 데이터의 분포와 확률 변수를 코딩 또는 엑셀로 시뮬레이션하고, 결론을 도출하여 과세특에 수학적 문제해결력으로 기재.`
    },
    {
      subject: '과학',
      recommendedInquiryTopic: `지속가능한 미래 기술과 융합 첨단 소재의 물리·화학적 원리 탐구 및 기술 동향 분석`,
      activityDetail: `교과서 내 기본 과학 법칙이 실제 산업 현장과 [${primaryCareer}]의 기술에 어떻게 응용되는지 문헌 조사를 수행하고 가설 설정-검증 보고서를 작성하여 탐구 역량을 부각.`
    },
    {
      subject: '국어',
      recommendedInquiryTopic: `과학기술 발전과 인공지능 윤리에 관한 학술 비평문 작성 및 논리적 설득 담화 분석`,
      activityDetail: `진로 관련 전문 칼럼이나 비문학 제재를 심층 독해한 뒤, 쟁점에 대한 찬반 논거를 체계적으로 정리하여 발표하고 균형 잡힌 비판적 사고력을 생기부에 기록.`
    },
    {
      subject: '사회',
      recommendedInquiryTopic: `디지털 혁신이 현대 사회의 직업 구조 및 공공 정책에 미치는 사회경제적 영향 분석`,
      activityDetail: `통계청 및 국제기구의 데이터를 활용하여 기술 발전이 일자리와 삶의 질에 미치는 양극화 및 해결 방안을 고찰하는 융합형 소논문 형식의 과제물 완성.`
    },
    {
      subject: '영어',
      recommendedInquiryTopic: `글로벌 학술 저널(Nature, MIT Tech Review 등)의 최신 기술 트렌드 원문 독해 및 영문 요약 프레젠테이션`,
      activityDetail: `희망 진로 분야의 글로벌 동향을 다룬 영문 기사를 발췌하여 핵심 용어 사전을 제작하고 학급 학생들에게 학술 내용을 영어로 요약 발표하여 전공 관련 어학 실력 입증.`
    }
  ];

  return {
    careerMotive: {
      title: '희망 진로 선정 동기 (학교생활기록부 진로활동 기재 양식)',
      content: careerMotiveContent,
    },
    academicMotive: {
      title: '희망 진학 선정 동기 (학교생활기록부 및 대입·고입 전형 대비 양식)',
      content: academicMotiveContent,
    },
    subjectSpecialtyGuide,
  };
}

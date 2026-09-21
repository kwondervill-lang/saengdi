import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateCounselingReport } from './src/utils/reportGenerator.js';
import { StudentInput } from './src/types.js';

dotenv.config();

// Safely obtain directory in CommonJS or ESM environments
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Iframe & CORS permissions so external sites (e.g. WordPress) can embed and access the app
  app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Route: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Generate Career & Academic Counseling Report
  app.post('/api/career-report', async (req, res) => {
    try {
      const input = req.body as StudentInput;

      if (!input || !input.schoolLevel || !input.interestRanking || !input.gradeRanking) {
        return res.status(400).json({
          error: '올바른 학생 인적 사항과 교과 순위 데이터를 입력해주세요.'
        });
      }

      // Base reliable fallback report always ready
      const baseReport = generateCounselingReport(input);

      // If GEMINI_API_KEY is configured, enrich via Gemini 3.8 Flash
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });

          // Prepare image parts if test result images were provided
          const imageParts = (input.testImages || [])
            .filter((img) => img && img.data && img.data.trim().length > 0)
            .map((img) => ({
              inlineData: {
                mimeType: img.mimeType || 'image/png',
                data: img.data,
              },
            }));

          const schoolLevelKr = input.schoolLevel === 'elementary' ? '초등학교' : input.schoolLevel === 'middle' ? '중학교' : '고등학교';
          const hasUploadedImages = imageParts.length > 0;

          const prompt = `
당신은 대한민국 최우수 진로진학 전문 수석 컨설턴트이자 입학사정관 출신 전문가입니다.
다음 학생의 인적사항, 교과 관심도/성적 순위, 희망 직업${hasUploadedImages ? ', 그리고 첨부된 [직업적성검사 / 직업흥미도검사] 결과지 이미지' : ''}를 종합 분석하여 교육부 학교생활기록부 기재 기준에 맞는 전문적인 진로진학 상담 리포트를 완성해주세요.

[학생 정보]
- 이름: ${input.studentName || '학생'}
- 학교급 및 학년: ${schoolLevelKr} ${input.grade}학년
- 교과 관심도 순위 (1위~5위): ${input.interestRanking.join(' > ')}
- 실제 교과 성적 순위 (1위~5위): ${input.gradeRanking.join(' > ')}
- 학생 평소 관심 직업: ${input.interestedCareers.filter(Boolean).join(', ')}
${
  hasUploadedImages
    ? `
[★ 핵심 과업: 첨부된 검사 결과지 이미지 ${imageParts.length}장 정밀 판독]
첨부된 이미지에는 커리어넷 진로심리검사, 워크넷 청소년 직업적성검사, 홀랜드 직업흥미도검사 등의 실제 결과표가 포함되어 있습니다.
1. 이미지에 표시된 검사 명칭, 홀랜드 코드(RIASEC 유형: R/I/A/S/E/C), 백분위/표준점수, 레이더 차트 수치, 상위 우수 적성 영역 및 추천 직업군을 정밀하게 OCR/시각 판독하십시오.
2. testAnalysis 객체에 판독된 적성 유형과 강점 특성, 그리고 학생의 교과 성적/관심도와의 상관관계를 상세히 기술하십시오.
3. 추천 진로 3선 및 목표 진학 설계 시 이 검사지 판독 결과를 핵심 근거로 유기적으로 결합하여 리포트를 도출하십시오.`
    : ''
}

[요구사항]
1. 추천 진로(직업) 3개: 학생의 관심 직업, 교과 특성, ${hasUploadedImages ? '검사 결과지 판독 결과' : '잠재 적성'}를 반영한 3대 핵심 직업 (개요, 하는 일 3~4개, 필요역량 3~4개, 교과 관심도/성적/검사결과 연계 추천 사유, 직업 전망)
2. 진학 목표 (★ 핵심: 1순위, 2순위, 3순위 고등학교 유형 및 추천 이유):
   - recommendedSchoolTypes 배열에 정확히 3개(1순위, 2순위, 3순위 고등학교 유형)를 생성하십시오.
   - rank: 1, 2, 3 (정수)
   - typeName: 고등학교 유형 명칭 (예: '과학고등학교 및 영재학교', '자율형사립고등학교(전국/광역)', '과학·인공지능(AI) 중점 일반고등학교' 또는 '외국어고·국제고등학교' 등)
   - categoryTag: 유형 카테고리 (예: '특수목적고', '자율형사립고', '교육과정 특성화 일반고', '마이스터고' 등)
   - recommendationReason: ★ 해당 고등학교 유형을 1순위/2순위/3순위로 선정한 명확하고 구체적인 이유 (학생의 1·2위 교과 관심도, 실제 성적 우수 교과, 관심 직업 및 심리검사 판독 지표와 연계하여 논리정연하게 작성)
   - curriculumAdvantage: 해당 고교 유형 교육과정의 특징 및 대입/학생부 연계 강점
   - targetNames: 대표 추천 학교 예시 3~5개
   - preparationGuide: 입학 준비 전략 (내신 관리, 교내 세특/탐구활동, 면접 준비)
3. 학생부 입력 형식 종합 리포트:
   - 희망 진로 선정 동기 (학생부 진로활동 기재 가능한 정제된 어조, 400~500자)
   - 희망 진학 선정 동기 (학생부 및 전형 대비용, 400~500자)
   - 주요 5개 교과(국어, 영어, 수학, 과학, 사회)의 과목별 세부능력 및 특기사항(과세특) 추천 탐구 주제 및 활동 방법

한국어로 자연스럽고 전문적인 교육학적 문체로 작성해주세요.
`;

          const contentPayload = hasUploadedImages
            ? [...imageParts, { text: prompt }]
            : prompt;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contentPayload,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  studentProfileSummary: { type: Type.STRING },
                  synergyAnalysis: { type: Type.STRING },
                  gapAnalysis: { type: Type.STRING },
                  testAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      hasImages: { type: Type.BOOLEAN },
                      testNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                      hollandOrAptitudeTypes: { type: Type.STRING },
                      detectedKeyTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                      aptitudeSummary: { type: Type.STRING },
                      synergyWithAcademicProfile: { type: Type.STRING }
                    },
                    required: ['hasImages', 'testNames', 'hollandOrAptitudeTypes', 'detectedKeyTraits', 'aptitudeSummary', 'synergyWithAcademicProfile']
                  },
                  recommendedCareers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        category: { type: Type.STRING },
                        matchScore: { type: Type.NUMBER },
                        overview: { type: Type.STRING },
                        responsibilities: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        requiredCompetencies: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        subjectConnection: { type: Type.STRING },
                        futureOutlook: { type: Type.STRING },
                      },
                      required: ['title', 'category', 'overview', 'responsibilities', 'requiredCompetencies', 'subjectConnection', 'futureOutlook']
                    }
                  },
                  academicRecommendation: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      levelDescription: { type: Type.STRING },
                      recommendedSchoolTypes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            rank: { type: Type.INTEGER },
                            typeName: { type: Type.STRING },
                            categoryTag: { type: Type.STRING },
                            targetNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                            recommendationReason: { type: Type.STRING },
                            curriculumAdvantage: { type: Type.STRING },
                            preparationGuide: { type: Type.STRING }
                          },
                          required: ['rank', 'typeName', 'categoryTag', 'targetNames', 'recommendationReason', 'curriculumAdvantage', 'preparationGuide']
                        }
                      },
                      targetUniversitiesAndMajors: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            university: { type: Type.STRING },
                            major: { type: Type.STRING },
                            category: { type: Type.STRING },
                            admissionStrategy: { type: Type.STRING },
                            recommendedSubjects: { type: Type.ARRAY, items: { type: Type.STRING } }
                          },
                          required: ['university', 'major', 'category', 'admissionStrategy', 'recommendedSubjects']
                        }
                      },
                      overallAcademicAdvice: { type: Type.STRING }
                    },
                    required: ['overallAcademicAdvice']
                  },
                  studentRecordDraft: {
                    type: Type.OBJECT,
                    properties: {
                      careerMotive: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          content: { type: Type.STRING }
                        },
                        required: ['title', 'content']
                      },
                      academicMotive: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          content: { type: Type.STRING }
                        },
                        required: ['title', 'content']
                      },
                      subjectSpecialtyGuide: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            subject: { type: Type.STRING },
                            recommendedInquiryTopic: { type: Type.STRING },
                            activityDetail: { type: Type.STRING }
                          },
                          required: ['subject', 'recommendedInquiryTopic', 'activityDetail']
                        }
                      }
                    },
                    required: ['careerMotive', 'academicMotive', 'subjectSpecialtyGuide']
                  }
                },
                required: ['studentProfileSummary', 'synergyAnalysis', 'gapAnalysis', 'recommendedCareers', 'studentRecordDraft']
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            const mergedReport = {
              ...baseReport,
              studentProfileSummary: parsed.studentProfileSummary || baseReport.studentProfileSummary,
              subjectAnalysis: {
                ...baseReport.subjectAnalysis,
                synergyAnalysis: parsed.synergyAnalysis || baseReport.subjectAnalysis.synergyAnalysis,
                gapAnalysis: parsed.gapAnalysis || baseReport.subjectAnalysis.gapAnalysis,
              },
              recommendedCareers: (parsed.recommendedCareers && parsed.recommendedCareers.length > 0)
                ? parsed.recommendedCareers.map((c: any, i: number) => ({
                    ...c,
                    id: c.id || `career-${i + 1}`,
                    matchScore: c.matchScore || (96 - i * 4),
                  }))
                : baseReport.recommendedCareers,
              academicRecommendation: {
                ...baseReport.academicRecommendation,
                ...(parsed.academicRecommendation || {}),
                level: baseReport.academicRecommendation.level,
                recommendedSchoolTypes: (parsed.academicRecommendation?.recommendedSchoolTypes?.length)
                  ? parsed.academicRecommendation.recommendedSchoolTypes
                  : baseReport.academicRecommendation.recommendedSchoolTypes,
                targetUniversitiesAndMajors: (parsed.academicRecommendation?.targetUniversitiesAndMajors?.length)
                  ? parsed.academicRecommendation.targetUniversitiesAndMajors
                  : baseReport.academicRecommendation.targetUniversitiesAndMajors,
                overallAcademicAdvice: parsed.academicRecommendation?.overallAcademicAdvice || baseReport.academicRecommendation.overallAcademicAdvice,
              },
              studentRecordDraft: {
                careerMotive: parsed.studentRecordDraft?.careerMotive || baseReport.studentRecordDraft.careerMotive,
                academicMotive: parsed.studentRecordDraft?.academicMotive || baseReport.studentRecordDraft.academicMotive,
                subjectSpecialtyGuide: (parsed.studentRecordDraft?.subjectSpecialtyGuide?.length)
                  ? parsed.studentRecordDraft.subjectSpecialtyGuide
                  : baseReport.studentRecordDraft.subjectSpecialtyGuide,
              },
              testAnalysis: parsed.testAnalysis || baseReport.testAnalysis,
            };
            return res.json({ success: true, report: mergedReport, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini API call failed, gracefully using expert fallback engine:', geminiError);
        }
      }

      // Return base generated report
      return res.json({ success: true, report: baseReport, source: 'counseling-engine' });
    } catch (err: any) {
      console.error('Report generation error:', err);
      res.status(500).json({ error: '리포트 생성 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류') });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career counseling server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});

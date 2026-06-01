import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import moxCoach from '../assets/Interview_Coach.png';
import moxHappy from '../assets/Owl_with_laptop.png';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Activity,
  TrendingUp,
  MessageSquare,
  Download,
  Signal,
  Wifi,
  Battery,
  Share2,
  Brain,
  Target,
  Award,
  Star,
  BookOpen,
  Home,
  Video,
  Plus,
  FileText,
  BarChart3,
  User as UserIcon
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface GradedAnswerItem {
  questionIndex: number;
  questionText: string;
  answerText: string;
  score: number;
  feedback: string;
}

interface InterviewDetails {
  _id: string;
  role: string;
  interviewType: string;
  difficulty: string;
  score: number;
  feedback: string;
  answers: GradedAnswerItem[];
}

interface ReportDetailsType {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [report, setReport] = useState<ReportDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Accordion state
  const [expandedAnswerIdx, setExpandedAnswerIdx] = useState<number | null>(0);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!id) return;
      try {
        const interviewData = await api.interviews.getById(id);
        const reportData = await api.interviews.getReport(id);
        setInterview(interviewData);
        setReport(reportData);
      } catch (err: any) {
        console.error('Failed to load performance report:', err);
        setError('Could not locate performance evaluation card.');
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [id]);

  const downloadPDFDirectly = async () => {
    if (!interview || !report) return;
    
    const downloadBtn = document.getElementById('pdf-download-btn');
    const downloadBtnMobile = document.getElementById('pdf-download-btn-mobile');
    
    const setBtnsLoading = (isLoading: boolean) => {
      [downloadBtn, downloadBtnMobile].forEach(btn => {
        if (btn) {
          if (isLoading) {
            btn.setAttribute('disabled', 'true');
            btn.innerHTML = '<span>Generating PDF...</span>';
          } else {
            btn.removeAttribute('disabled');
            btn.innerHTML = `
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Download PDF</span>
            `;
          }
        }
      });
    };

    setBtnsLoading(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');

      // Helper 1: Draw clean text boxes with background shading, accents, borders
      const drawTextBox = (
        title: string,
        text: string,
        x: number,
        y: number,
        width: number,
        bgColor: [number, number, number] | null = null,
        borderColor: [number, number, number] | null = null,
        accentColor: [number, number, number] | null = null
      ) => {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        const lines = doc.splitTextToSize(text || 'No response provided.', width - 10);
        const textHeight = lines.length * 4;
        const cardHeight = textHeight + (title ? 12 : 6);

        if (y + cardHeight > 270) {
          return { shouldPaginate: true, cardHeight };
        }

        if (bgColor) {
          doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          doc.rect(x, y, width, cardHeight, 'F');
        }

        if (accentColor) {
          doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.rect(x, y, 1.5, cardHeight, 'F');
        }

        if (borderColor) {
          doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
          doc.setLineWidth(0.2);
          doc.rect(x, y, width, cardHeight, 'D');
        }

        let textY = y + 4.5;
        if (title) {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139); // slate-500
          doc.text(title.toUpperCase(), x + 4, y + 4.5);
          textY = y + 9.5;
        }

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42); // dark text
        lines.forEach((line: string, index: number) => {
          doc.text(line, x + 4, textY + index * 4);
        });

        return { shouldPaginate: false, nextY: y + cardHeight + 4 };
      };

      // Helper 2: Draw Bullet list segments (Strengths/Improvement cards)
      const drawBulletList = (
        title: string,
        items: string[],
        x: number,
        y: number,
        width: number,
        titleColor: [number, number, number],
        bulletColor: [number, number, number],
        bgColor: [number, number, number]
      ) => {
        // Calculate dynamic list height to verify page break bounds
        let listHeight = 12; // header space
        items.forEach((item: string) => {
          const lines = doc.splitTextToSize(item, width - 10);
          listHeight += lines.length * 4 + 2;
        });

        if (y + listHeight > 270) {
          return { shouldPaginate: true, listHeight };
        }

        // Draw header bg block
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(x, y, width, 7, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.text(title.toUpperCase(), x + 4, y + 4.5);

        let currentY = y + 12;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);

        items.forEach((item: string) => {
          const lines = doc.splitTextToSize(item, width - 10);
          
          // Bullet dot
          doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
          doc.circle(x + 5, currentY - 1, 0.8, 'F');

          lines.forEach((line: string, lineIdx: number) => {
            doc.text(line, x + 9, currentY + lineIdx * 4);
          });
          
          currentY += lines.length * 4 + 2;
        });

        return { shouldPaginate: false, nextY: y + listHeight + 4 };
      };

      // Helper 3: Global Letterhead & Page Pagination Counter
      const addHeaderFooter = (pageNum: number, customTotal: number) => {
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.3);
        
        // Top line
        doc.line(15, 12, 195, 12);
        
        // Brand logo
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(79, 61, 245); // Brand Purple
        doc.text('MOCKMATE AI', 15, 9);
        
        // Subtitle
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`Performance Evaluation Report  |  ${interview.role}`, 40, 9);
        
        // Bottom divider rule
        doc.line(15, 282, 195, 282);
        
        // Page counter
        doc.setFontSize(7.5);
        doc.text(`Page ${pageNum} of ${customTotal}`, 15, 287);
        doc.text('Confidential  |  Powered by Gemini AI Coach', 195, 287, { align: 'right' });
      };

      // Calculate total question pages dynamically to get exact totalPages
      let qaCheckY = 32;
      let s3PagesCount = 1;
      interview.answers.forEach((qaItem, _idx) => {
        const qLines = doc.splitTextToSize(qaItem.questionText, 180);
        const qTextHeight = qLines.length * 4.5;
        
        const ansLines = doc.splitTextToSize(qaItem.answerText || 'No response provided.', 170);
        const ansCardHeight = ansLines.length * 4 + 12;

        const fbLines = doc.splitTextToSize(qaItem.feedback || 'Evaluated.', 170);
        const fbCardHeight = fbLines.length * 4 + 12;

        const totalBlockHeight = 5 + qTextHeight + ansCardHeight + fbCardHeight + 10;

        if (qaCheckY + totalBlockHeight > 270) {
          s3PagesCount++;
          qaCheckY = 20 + totalBlockHeight;
        } else {
          qaCheckY += totalBlockHeight;
        }
      });
      const finalTotalPages = 2 + s3PagesCount;

      // ============================================
      // PAGE 1: EXECUTIVE BRIEF & DASHBOARD
      // ============================================
      
      // 1. Report Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(interview.role.toUpperCase(), 15, 24);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${interview.interviewType} Round Mock Evaluation Report`, 15, 29);

      // 2. Metadata Grid Card
      const dateText = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 34, 180, 8, 'FD');
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`DIFFICULTY LEVEL: ${interview.difficulty.toUpperCase()}`, 18, 39.5);
      doc.text(`DATE GRADED: ${dateText.toUpperCase()}`, 75, 39.5);
      doc.text('STATUS: GRADE COMPLETED', 145, 39.5);

      // 3. Overall Score circle box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 46, 80, 48, 'F');
      doc.rect(15, 46, 80, 48, 'D');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(79, 61, 245);
      doc.text('OVERALL EVALUATION SCORE', 55, 52, { align: 'center' });

      // Core Circle
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(79, 61, 245);
      doc.setLineWidth(2.5);
      doc.circle(55, 71, 14, 'FD');

      // Score Text
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text(`${interview.score}`, 55, 73, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('OUT OF 100', 55, 79, { align: 'center' });

      // Status Badge under score
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.2);
      doc.rect(35, 85, 40, 5, 'FD');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(21, 128, 61); // Green-700
      doc.text('PASSED BENCHMARKS', 55, 88.5, { align: 'center' });

      // 4. Performance dimension bars
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(100, 46, 95, 48, 'FD');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(79, 61, 245);
      doc.text('PERFORMANCE METRIC DIMENSIONS', 147.5, 52, { align: 'center' });

      const drawMetricBar = (label: string, score: number, yPos: number) => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(50, 50, 50);
        doc.text(label, 105, yPos);
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(79, 61, 245);
        doc.text(`${score}%`, 190, yPos, { align: 'right' });
        
        doc.setFillColor(226, 232, 240);
        doc.rect(105, yPos + 1.8, 85, 1.2, 'F');
        
        doc.setFillColor(79, 61, 245);
        doc.rect(105, yPos + 1.8, 85 * (score / 100), 1.2, 'F');
      };

      drawMetricBar('Technical Proficiency Domain', report.technicalScore, 59);
      drawMetricBar('Communication Clarity & Structure', report.communicationScore, 68);
      drawMetricBar('Confidence & Analytical Delivery', report.confidenceScore, 77);
      drawMetricBar('Problem Solving & Roadmaps', report.problemSolvingScore, 86);

      // 5. Executive Summary Text Block
      drawTextBox(
        'Platform Executive Evaluation Summary',
        interview.feedback,
        15,
        98,
        180,
        [248, 250, 252],
        [226, 232, 240],
        [79, 61, 245]
      );

      addHeaderFooter(1, finalTotalPages);

      // ============================================
      // PAGE 2: ASSESSMENT INSIGHTS & ROADMAP
      // ============================================
      doc.addPage();
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('Candidate Performance Assessment Insights', 15, 24);

      let p2Y = 30;

      // Strengths Block
      const strRes = drawBulletList(
        'Demonstrated Core Strengths',
        report.strengths,
        15,
        p2Y,
        180,
        [21, 128, 61],
        [34, 197, 94],
        [240, 253, 244]
      );
      p2Y = strRes.shouldPaginate ? p2Y : (strRes.nextY ?? p2Y);

      // Improvements Block
      const weakRes = drawBulletList(
        'Target Areas of Improvement',
        report.weaknesses,
        15,
        p2Y,
        180,
        [180, 83, 9],
        [245, 158, 11],
        [254, 243, 199]
      );
      p2Y = weakRes.shouldPaginate ? p2Y : (weakRes.nextY ?? p2Y);

      // Growth Roadmap Block
      drawBulletList(
        'Targeted AI Growth & Learning Roadmap',
        report.recommendations,
        15,
        p2Y,
        180,
        [67, 56, 202],
        [79, 61, 245],
        [245, 243, 255]
      );

      addHeaderFooter(2, finalTotalPages);

      // ============================================
      // PAGE 3+: QUESTION-BY-QUESTION REVIEW
      // ============================================
      doc.addPage();
      let currentPageNum = 3;
      addHeaderFooter(currentPageNum, finalTotalPages);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('Detailed Question-by-Question Review', 15, 24);

      let qaY = 32;

      interview.answers.forEach((qaItem, idx) => {
        const qLines = doc.splitTextToSize(qaItem.questionText, 180);
        const qTextHeight = qLines.length * 4.5;
        
        const ansLines = doc.splitTextToSize(qaItem.answerText || 'No response provided.', 170);
        const ansCardHeight = ansLines.length * 4 + 12;

        const fbLines = doc.splitTextToSize(qaItem.feedback || 'Evaluated.', 170);
        const fbCardHeight = fbLines.length * 4 + 12;

        const totalBlockHeight = 5 + qTextHeight + ansCardHeight + fbCardHeight + 10;

        if (qaY + totalBlockHeight > 270) {
          doc.addPage();
          currentPageNum++;
          addHeaderFooter(currentPageNum, finalTotalPages);
          qaY = 20;
        }

        // Draw Q# title
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(79, 61, 245);
        doc.text(`QUESTION ${idx + 1}`, 15, qaY);
        
        // Score tag
        const scoreText = `SCORE: ${qaItem.score}%`;
        doc.setFontSize(8);
        doc.setTextColor(
          qaItem.score >= 80 ? 21 : qaItem.score >= 60 ? 180 : 220,
          qaItem.score >= 80 ? 128 : qaItem.score >= 60 ? 83 : 38,
          qaItem.score >= 80 ? 61 : qaItem.score >= 60 ? 9 : 38
        );
        doc.text(scoreText, 195, qaY, { align: 'right' });

        // Question Details
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        qLines.forEach((line: string, qIdx: number) => {
          doc.text(line, 15, qaY + 5 + qIdx * 4.5);
        });
        
        qaY += 6 + qLines.length * 4.5;

        // Candidate Answer Box
        const responseRes = drawTextBox(
          'Candidate Response',
          qaItem.answerText,
          15,
          qaY,
          180,
          [255, 255, 255],
          [226, 232, 240],
          [100, 116, 139]
        );
        
        qaY = responseRes.shouldPaginate ? qaY : (responseRes.nextY ?? qaY);

        // AI Feedback Card
        const feedbackRes = drawTextBox(
          'AI Feedback & Grading Details',
          qaItem.feedback,
          15,
          qaY,
          180,
          [245, 243, 255],
          [232, 224, 252],
          [79, 61, 245]
        );

        qaY = feedbackRes.shouldPaginate ? qaY : ((feedbackRes.nextY ?? qaY) + 4);
      });

      const cleanRole = interview.role.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`${cleanRole}_Performance_Report.pdf`);

    } catch (err) {
      console.error('Premium direct PDF generation failed:', err);
      alert('Direct PDF formatting encountered a drawing issue. Falling back to native system print.');
      window.print();
    } finally {
      setBtnsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Gathering evaluation reports...</p>
      </div>
    );
  }

  if (error || !interview || !report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="font-bold text-slate-900 text-lg">Evaluation Report Missing</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">Failed to locate the detailed grading report for this mock session.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const toggleAnswerExpand = (idx: number) => {
    setExpandedAnswerIdx(expandedAnswerIdx === idx ? null : idx);
  };

  const radarData = [
    { subject: 'Technical', A: report.technicalScore, B: 100 },
    { subject: 'Communication', A: report.communicationScore, B: 100 },
    { subject: 'Confidence', A: report.confidenceScore, B: 100 },
    { subject: 'Problem Solving', A: report.problemSolvingScore, B: 100 }
  ];

  // ─── Mobile View ──────────────────────────────────────────────────────────
  const renderMobileView = () => {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-32 text-left relative overflow-x-hidden">
        


        {/* 2. Top Header Navigation */}
        <header className="w-full px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => navigate('/results')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors active:scale-95 border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <h1 className="text-base font-black text-slate-800 tracking-tight">Interview Report</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors active:scale-95 border border-slate-100 font-extrabold text-sm tracking-widest leading-none">
            •••
          </button>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 px-5 pt-4 pb-12 space-y-4">
          
          {/* Header Role info */}
          <div className="space-y-1 pl-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded leading-none select-none uppercase">Evaluation Ready</span>
              <span className="text-[10px] text-slate-400 font-bold leading-none">{interview.interviewType} Practice</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-snug">{interview.role}</h2>
            
            {/* Metadata Pills & Download Action */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 border border-slate-200/80 rounded-xl px-3 py-1.5 bg-white select-none leading-none">
                  Level: <span className="text-indigo-600 font-extrabold">{interview.difficulty}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 border border-slate-200/80 rounded-xl px-3 py-1.5 bg-white select-none leading-none">
                  Status: <span className="text-emerald-500 font-extrabold">Graded</span>
                </span>
              </div>

              <button
                id="pdf-download-btn-mobile"
                onClick={downloadPDFDirectly}
                className="bg-[#625dfb] hover:bg-[#423ceb] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 leading-none select-none"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* 3. Overall Score card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            {/* Score Star Mascot overlap */}
            <div className="absolute right-2.5 bottom-1.5 w-24 h-auto pointer-events-none z-10 flex flex-col items-center">
              <img 
                src={moxCoach} 
                alt="Mox Owl wearing headphones holding card" 
                className="w-16 h-auto drop-shadow-xl select-none"
              />
              <div className="absolute bottom-4 right-4 bg-white border border-slate-100 rounded-xl p-1 px-2 text-center shadow-md select-none leading-none z-20 flex flex-col items-center justify-center border border-indigo-50 scale-75">
                <span className="text-[10px] font-black text-[#625dfb]">{interview.score}</span>
                <span className="text-[5px] text-slate-400 font-black uppercase tracking-wider mt-0.5">out of 100</span>
              </div>
            </div>

            <div className="w-full text-left pl-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Overall Score</span>
            </div>

            {/* Circular Gauge */}
            <div className="w-full flex items-center justify-start gap-4 mt-3">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#625dfb"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - interview.score / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-2xl font-black text-slate-800 tracking-tighter">{interview.score}</span>
                  <span className="text-slate-400 text-[8px] font-bold mt-0.5 uppercase tracking-wide">out of 100</span>
                </div>
              </div>

              {/* Status explanation */}
              <div className="flex-1 pr-20 text-left space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                  Great job! You performed better than <span className="font-black text-slate-800">{interview.score}%</span> of candidates in this test.
                </p>
                <div className="inline-flex items-center gap-1 bg-[#f4f3ff] border border-[#e5e3fc] text-[#625dfb] rounded-full px-2.5 py-1 text-[9px] font-black leading-none select-none shadow-sm">
                  <span>📈</span>
                  <span>Passed Standard Benchmarks</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Evaluation Dimension Mapping card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <Activity className="w-4 h-4 text-[#625dfb] stroke-[2.5]" />
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none">Evaluation Dimension Mapping</h3>
            </div>

            {/* Recharts Radar chart */}
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" opacity={0.5} />
                    <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={9} tickLine={false} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={7} tickLine={false} />
                    {/* Benchmark radar */}
                    <Radar 
                      name="Benchmark" 
                      dataKey="B" 
                      stroke="#94a3b8" 
                      fill="none" 
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                    {/* Your Score radar */}
                    <Radar 
                      name="Your Score" 
                      dataKey="A" 
                      stroke="#625dfb" 
                      fill="#625dfb" 
                      fillOpacity={0.16} 
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend at the Bottom */}
              <div className="flex items-center justify-center gap-4 py-1.5 px-4 bg-slate-50 border border-slate-100 rounded-xl leading-none font-bold text-[9px] text-slate-500 w-fit select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#625dfb]"></span>
                  <span>Your Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 border-t border-dashed border-slate-400"></span>
                  <span>Benchmark</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Platform Executive Summary card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <Sparkles className="w-4 h-4 text-[#625dfb] shrink-0" />
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider leading-none">Platform Executive Summary</h3>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed text-left pl-1 pr-1">
              {interview.feedback}
            </p>

            {/* Grid row metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Card 1: Accuracy */}
              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-3 flex flex-col justify-between text-left relative min-h-[96px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                    <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wide leading-none mt-0.5">Accuracy</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 leading-none">{report.technicalScore}%</span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold mt-3.5 leading-snug">Strong accuracy in responses</p>
                {/* Green Progress Bar */}
                <div className="w-full bg-emerald-100/40 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${report.technicalScore}%` }}></div>
                </div>
              </div>

              {/* Card 2: Structure */}
              <div className="bg-amber-50/40 border border-amber-100/60 rounded-2xl p-3 flex flex-col justify-between text-left relative min-h-[96px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 stroke-[2.2]" />
                    <span className="text-[8px] font-extrabold text-amber-700 uppercase tracking-wide leading-none mt-0.5">Structure</span>
                  </div>
                  <span className="text-xs font-black text-amber-600 leading-none">{report.confidenceScore}%</span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold mt-3.5 leading-snug">Well-structured STAR format</p>
                {/* Amber Progress Bar */}
                <div className="w-full bg-amber-100/40 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${report.confidenceScore}%` }}></div>
                </div>
              </div>

              {/* Card 3: Communication */}
              <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3 flex flex-col justify-between text-left relative min-h-[96px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-500 stroke-[2.2]" />
                    <span className="text-[8px] font-extrabold text-blue-700 uppercase tracking-wide leading-none mt-0.5">Communication</span>
                  </div>
                  <span className="text-xs font-black text-blue-600 leading-none">{report.communicationScore}%</span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold mt-3.5 leading-snug">Clear and effective delivery</p>
                {/* Blue Progress Bar */}
                <div className="w-full bg-blue-100/40 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${report.communicationScore}%` }}></div>
                </div>
              </div>

              {/* Card 4: Problem Solving */}
              <div className="bg-purple-50/40 border border-purple-100/60 rounded-2xl p-3 flex flex-col justify-between text-left relative min-h-[96px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-purple-500 stroke-[2.2]" />
                    <span className="text-[8px] font-extrabold text-purple-700 uppercase tracking-wide leading-none mt-0.5">Problem Solving</span>
                  </div>
                  <span className="text-xs font-black text-purple-600 leading-none">{report.problemSolvingScore}%</span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold mt-3.5 leading-snug">Good depth in analysis</p>
                {/* Purple Progress Bar */}
                <div className="w-full bg-purple-100/40 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${report.problemSolvingScore}%` }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 6. Sticky bottom Share / Review buttons */}
        <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-40 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3.5">
            {/* Share Report */}
            <button 
              type="button"
              className="bg-white hover:bg-slate-50 border border-[#c7c4fb]/70 text-[#625dfb] font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all text-xs select-none"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>Share Report</span>
            </button>
            
            {/* Review Answers */}
            <button 
              type="button"
              onClick={() => navigate(`/interviews/${interview._id}`)}
              className="bg-[#625dfb] hover:bg-[#423ceb] text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-500/10 active:scale-[0.98] transition-all text-xs select-none"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Review Answers</span>
            </button>
          </div>
        </div>

        {/* 7. Bottom Navigation Tab Bar (Report active) */}
        <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 max-w-md mx-auto shadow-[0_-2px_16px_rgba(0,0,0,0.03)] rounded-t-3xl">
          {/* Home Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Dashboard</span>
          </button>

          {/* Interview Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/studio')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5" />
            <span className="text-[9px] font-bold">Studio</span>
          </button>

          {/* Resume Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/resume')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px] font-bold">Resume</span>
          </button>

          {/* Report Tab - Selected */}
          <button 
            type="button" 
            onClick={() => navigate('/results')} 
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
          >
            <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black text-[#625dfb]">Reports</span>
          </button>

          {/* Profile Tab */}
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[9px] font-bold">Profile</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:flex flex-col space-y-6 px-8 py-6 w-full max-w-none animate-fade-in relative z-10 text-left bg-[#F8FAFC]">
        {/* Background glowing decorations */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10 no-print"></div>
        
        {/* Section 1: Dashboard Cover Summary Sheet */}
        <div id="report-section-1" className="space-y-6">
          {/* Top controls and meta details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/results')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-700 transition-colors no-print"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded border border-green-200">Evaluation Ready</span>
                  <span className="text-xs text-slate-500 font-semibold">{interview.interviewType} Practice</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1 leading-none truncate max-w-[300px] sm:max-w-md">{interview.role}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2">
                <span>Level: <span className="text-slate-800">{interview.difficulty}</span></span>
                <span className="h-3 w-px bg-slate-200"></span>
                <span>Status: <span className="text-green-600 font-bold">Graded</span></span>
              </div>
              
              <button
                id="pdf-download-btn"
                onClick={downloadPDFDirectly}
                className="flex items-center gap-2 bg-[#4f3df5] hover:bg-[#3b2dc3] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all no-print cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Main Scoring Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch print-grid-full">
            
            {/* Core Big Score ring */}
            <GlassCard hoverEffect={false} className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-brand-50/20 to-slate-50/40 relative overflow-hidden print-avoid-break">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl"></div>
              
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider mb-4">Overall Score Card</span>
              
              {/* Radial progress ring mockup */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#4f3df5"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - interview.score / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-4xl font-extrabold text-slate-800">{interview.score}</span>
                  <span className="text-slate-500 text-xs font-bold mt-1">out of 100</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4 py-1 text-xs font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Passed Standard Benchmarks</span>
              </div>
            </GlassCard>

            {/* Recharts Radar dimensions */}
            <GlassCard hoverEffect={false} className="md:col-span-2 flex flex-col justify-between print-avoid-break">
              <div className="flex items-center justify-between mb-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation dimension mapping</span>
                </div>
              </div>

              <div className="flex-1 w-full h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" opacity={0.5} />
                    <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                    <Radar 
                      name="Metrics Score" 
                      dataKey="A" 
                      stroke="#4f3df5" 
                      fill="#4f3df5" 
                      fillOpacity={0.25} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Section 2: Performance Summary & Roadmap */}
        <div id="report-section-2" className="space-y-6">
          {/* Structured feedback and highlights */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden print-avoid-break">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Platform Executive Summary</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-semibold">
                {interview.feedback}
              </p>
            </div>
          </GlassCard>

          {/* Color Coded Strengths, Weaknesses, Recommendations tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print-grid-full">
            {/* Strengths card */}
            <div className="bg-green-50/70 rounded-2xl border border-green-200/80 p-5 space-y-4 shadow-sm relative overflow-hidden print-avoid-break">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 text-green-700 font-extrabold text-xs tracking-wider uppercase border-b border-green-200/60 pb-2">
                <CheckCircle className="w-5 h-5" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 leading-normal pl-1">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses card */}
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 space-y-4 shadow-sm relative overflow-hidden print-avoid-break">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs tracking-wider uppercase border-b border-amber-200/60 pb-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Areas of Improvement</span>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 leading-normal pl-1">
                {report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations card */}
            <div className="bg-brand-50/70 rounded-2xl border border-brand-200/80 p-5 space-y-4 shadow-sm relative overflow-hidden print-avoid-break">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 text-brand-700 font-extrabold text-xs tracking-wider uppercase border-b border-brand-200/60 pb-2">
                <Lightbulb className="w-5 h-5" />
                <span>Targeted Growth Roadmap</span>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700 leading-normal pl-1">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Q&A Analysis Review */}
        <div id="report-section-3" className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Question-by-Question Evaluation Review</h3>
          
          <div className="space-y-3">
            {interview.answers.map((qaItem, idx) => {
              const isExpanded = expandedAnswerIdx === idx;
              return (
                <div 
                  key={idx}
                  className="glass rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 print-avoid-break"
                >
                  {/* Accordion header button */}
                  <button
                    onClick={() => toggleAnswerExpand(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-xs font-extrabold text-slate-500 tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex-shrink-0">Q{idx + 1}</span>
                      <p className="font-bold text-slate-700 text-sm md:text-base leading-tight truncate">{qaItem.questionText}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                        qaItem.score >= 80 
                          ? 'text-green-600 bg-green-50 border border-green-200' 
                          : qaItem.score >= 60 
                            ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                            : 'text-red-600 bg-red-50 border border-red-200'
                      }`}>
                        {qaItem.score}%
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 no-print" /> : <ChevronDown className="w-4 h-4 text-slate-500 no-print" />}
                    </div>
                  </button>

                  {/* Accordion body contents */}
                  <div className={`px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 print-expand-accordion print-accordion-border ${
                    isExpanded ? 'block animate-fade-in' : 'hidden'
                  }`}>
                    {/* Candidate Answer bubble */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Response</span>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-slate-700 text-xs md:text-sm font-semibold leading-relaxed font-sans max-h-40 overflow-y-auto whitespace-pre-wrap">
                        {qaItem.answerText || <span className="italic text-slate-500">No response provided.</span>}
                      </div>
                    </div>

                    {/* AI Feedback assessment */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">AI feedback & grading details</span>
                      <div className="bg-brand-50/40 border border-brand-100 rounded-xl p-3.5 flex items-start gap-2.5">
                        <MessageSquare className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                          {qaItem.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Mockup View */}
      <div className="block lg:hidden min-h-screen w-full bg-[#F8FAFC]">
        {renderMobileView()}
      </div>
    </>
  );
};

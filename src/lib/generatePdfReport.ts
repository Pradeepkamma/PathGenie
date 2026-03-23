import jsPDF from "jspdf";
import type { AnalysisResult } from "./quizData";

export function generatePdfReport(results: AnalysisResult) {
  const { recommendations, summary } = results;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  const brandPrimary: [number, number, number] = [79, 70, 229]; // #4F46E5
  const brandDark: [number, number, number] = [26, 26, 46];
  const gray500: [number, number, number] = [107, 114, 128];
  const gray200: [number, number, number] = [229, 231, 235];
  const white: [number, number, number] = [255, 255, 255];
  const successGreen: [number, number, number] = [34, 197, 94];
  const highlightYellow: [number, number, number] = [234, 179, 8];

  const fitColor = (score: number): [number, number, number] =>
    score >= 85 ? successGreen : score >= 70 ? highlightYellow : gray500;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Header banner ──
  doc.setFillColor(...brandDark);
  doc.rect(0, 0, pageW, 48, "F");

  // Gradient accent line
  doc.setFillColor(...brandPrimary);
  doc.rect(0, 48, pageW, 2, "F");

  doc.setTextColor(...white);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("PathGenie", margin, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Career Guidance Report", margin, 32);

  doc.setFontSize(9);
  doc.setTextColor(180, 180, 200);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), margin, 42);

  y = 60;

  // ── Summary Card ──
  doc.setFillColor(248, 249, 255);
  doc.roundedRect(margin, y, contentW, 36, 3, 3, "F");
  doc.setDrawColor(...gray200);
  doc.roundedRect(margin, y, contentW, 36, 3, 3, "S");

  doc.setTextColor(...gray500);
  doc.setFontSize(9);
  doc.text("TOP RECOMMENDATION", margin + 6, y + 8);

  doc.setTextColor(...brandDark);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(summary.top_recommendation, margin + 6, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const confColor = summary.confidence_level === "High" ? successGreen : highlightYellow;
  doc.setTextColor(...confColor);
  doc.text(`Confidence: ${summary.confidence_level}`, margin + 6, y + 26);

  doc.setTextColor(...gray500);
  const confLines = doc.splitTextToSize(summary.confidence_explanation, contentW - 12);
  doc.text(confLines.slice(0, 2), margin + 6, y + 32);

  y += 44;

  // ── Career Cards ──
  recommendations.forEach((rec, i) => {
    checkPage(80);

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentW, 4, 2, 2, "F"); // placeholder height, will expand

    // Accent bar
    const accent: [number, number, number] = i === 0 ? brandPrimary : gray200;
    doc.setFillColor(...accent);
    doc.rect(margin, y, 3, 74, "F");

    // Rank badge
    const badgeFill: [number, number, number] = i === 0 ? brandPrimary : [240, 240, 245];
    doc.setFillColor(...badgeFill);
    doc.circle(margin + 12, y + 8, 5, "F");
    const badgeText: [number, number, number] = i === 0 ? white : gray500;
    doc.setTextColor(...badgeText);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${rec.rank}`, margin + 12, y + 10, { align: "center" });

    // Title
    doc.setTextColor(...brandDark);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(rec.career_title, margin + 22, y + 10);

    // Fit score
    doc.setTextColor(...fitColor(rec.fit_score));
    doc.setFontSize(18);
    doc.text(`${rec.fit_score}%`, pageW - margin - 2, y + 11, { align: "right" });

    doc.setTextColor(...gray500);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("fit score", pageW - margin - 2, y + 16, { align: "right" });

    // Fit bar
    const barX = pageW - margin - 32;
    const barW = 28;
    doc.setFillColor(...gray200);
    doc.roundedRect(barX, y + 18, barW, 2.5, 1, 1, "F");
    doc.setFillColor(...fitColor(rec.fit_score));
    doc.roundedRect(barX, y + 18, barW * (rec.fit_score / 100), 2.5, 1, 1, "F");

    let cardY = y + 24;

    // Why fits
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Why This Fits You", margin + 8, cardY);
    cardY += 5;
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const whyLines = doc.splitTextToSize(rec.why_fits, contentW - 16);
    doc.text(whyLines.slice(0, 3), margin + 8, cardY);
    cardY += Math.min(whyLines.length, 3) * 3.5 + 4;

    // Role description
    checkPage(20);
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("What You'll Do", margin + 8, cardY);
    cardY += 5;
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const roleLines = doc.splitTextToSize(rec.role_description, contentW - 16);
    doc.text(roleLines.slice(0, 3), margin + 8, cardY);
    cardY += Math.min(roleLines.length, 3) * 3.5 + 4;

    // Skills columns
    checkPage(20);
    const colW = (contentW - 16) / 2;

    doc.setTextColor(34, 197, 94);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Skills You Have", margin + 8, cardY);

    doc.setTextColor(234, 179, 8);
    doc.text("Skills to Develop", margin + 8 + colW, cardY);
    cardY += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const maxSkills = Math.max(rec.skills_you_have.length, rec.skills_to_develop.length);
    for (let s = 0; s < Math.min(maxSkills, 4); s++) {
      if (rec.skills_you_have[s]) {
        doc.setTextColor(...gray500);
        doc.text(`✓ ${rec.skills_you_have[s]}`, margin + 8, cardY + s * 3.5);
      }
      if (rec.skills_to_develop[s]) {
        doc.setTextColor(...gray500);
        doc.text(`○ ${rec.skills_to_develop[s]}`, margin + 8 + colW, cardY + s * 3.5);
      }
    }
    cardY += Math.min(maxSkills, 4) * 3.5 + 4;

    // Career outlook
    checkPage(14);
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Career Outlook", margin + 8, cardY);
    cardY += 4;

    const outlookItems = [
      { label: "Entry", val: rec.career_outlook.salary_entry },
      { label: "Exp.", val: rec.career_outlook.salary_experienced },
      { label: "Growth", val: rec.career_outlook.growth_potential },
    ];
    const itemW = (contentW - 16) / 3;
    outlookItems.forEach((item, oi) => {
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(margin + 8 + oi * itemW, cardY, itemW - 3, 10, 1, 1, "F");
      doc.setTextColor(...gray500);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, margin + 10 + oi * itemW, cardY + 4);
      doc.setTextColor(...brandDark);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(item.val, margin + 10 + oi * itemW, cardY + 8.5);
    });

    // Card border
    const cardH = cardY + 16 - y;
    doc.setDrawColor(...gray200);
    doc.roundedRect(margin, y, contentW, cardH, 2, 2, "S");

    y = y + cardH + 8;
  });

  // ── Footer ──
  checkPage(16);
  doc.setFillColor(...brandDark);
  doc.rect(0, pageH - 14, pageW, 14, "F");
  doc.setTextColor(180, 180, 200);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by PathGenie — AI-Powered Career Guidance", pageW / 2, pageH - 6, { align: "center" });

  doc.save("PathGenie-Career-Report.pdf");
}

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

  // ── Colors ──
  const brandPrimary: [number, number, number] = [79, 70, 229];
  const brandDark: [number, number, number] = [26, 26, 46];
  const gray500: [number, number, number] = [107, 114, 128];
  const gray200: [number, number, number] = [229, 231, 235];
  const white: [number, number, number] = [255, 255, 255];
  const successGreen: [number, number, number] = [34, 197, 94];
  const highlightYellow: [number, number, number] = [234, 179, 8];
  const accentColor: [number, number, number] = [168, 85, 247];

  const fitColor = (score: number): [number, number, number] =>
    score >= 85 ? successGreen : score >= 70 ? highlightYellow : gray500;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Helpers ──
  const sectionHeader = (icon: string, title: string, subtitle?: string) => {
    checkPage(20);
    doc.setFillColor(248, 249, 252);
    doc.roundedRect(margin, y, contentW, subtitle ? 16 : 12, 2, 2, "F");
    doc.setDrawColor(...gray200);
    doc.roundedRect(margin, y, contentW, subtitle ? 16 : 12, 2, 2, "S");

    doc.setTextColor(...brandPrimary);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${icon}  ${title}`, margin + 5, y + (subtitle ? 7 : 8));

    if (subtitle) {
      doc.setTextColor(...gray500);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, margin + 5, y + 13);
    }

    y += (subtitle ? 16 : 12) + 5;
  };

  // ══════════════════════════════════════
  // PAGE HEADER
  // ══════════════════════════════════════
  doc.setFillColor(...brandDark);
  doc.rect(0, 0, pageW, 44, "F");
  doc.setFillColor(...brandPrimary);
  doc.rect(0, 44, pageW, 2, "F");

  doc.setTextColor(...white);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PathGenie", margin, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Career Guidance Report", margin, 30);

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 200);
  doc.text(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    margin,
    38
  );

  y = 54;

  // ══════════════════════════════════════
  // 1. GOAL SUMMARY
  // ══════════════════════════════════════
  sectionHeader(">>", "Goal Summary");

  doc.setFillColor(248, 249, 255);
  const summaryTextLines = doc.splitTextToSize(summary.confidence_explanation, contentW - 12);
  const summaryH = 28 + summaryTextLines.length * 3.5;
  doc.roundedRect(margin, y, contentW, summaryH, 3, 3, "F");
  doc.setDrawColor(...gray200);
  doc.roundedRect(margin, y, contentW, summaryH, 3, 3, "S");

  doc.setTextColor(...gray500);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("TOP RECOMMENDATION", margin + 6, y + 7);

  doc.setTextColor(...brandDark);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(summary.top_recommendation, margin + 6, y + 16);

  const confColor = summary.confidence_level === "High" ? successGreen : highlightYellow;
  doc.setTextColor(...confColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`${summary.confidence_level} Confidence`, margin + 6, y + 23);

  doc.setTextColor(...gray500);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(summaryTextLines, margin + 6, y + 29);

  y += summaryH + 8;

  // ══════════════════════════════════════
  // 2. STEP-BY-STEP ROADMAP (Top Career)
  // ══════════════════════════════════════
  const topRec = recommendations[0];
  if (topRec) {
    sectionHeader(">>", "Step-by-Step Roadmap", `For ${topRec.career_title}`);

    topRec.next_steps.forEach((step, i) => {
      checkPage(12);
      // Step number circle
      doc.setFillColor(...brandPrimary);
      doc.circle(margin + 8, y + 3, 3.5, "F");
      doc.setTextColor(...white);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}`, margin + 8, y + 4.5, { align: "center" });

      // Connector line
      if (i < topRec.next_steps.length - 1) {
        doc.setDrawColor(...gray200);
        doc.setLineWidth(0.3);
        doc.line(margin + 8, y + 6.5, margin + 8, y + 12);
      }

      // Step text
      doc.setTextColor(...brandDark);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      const stepLines = doc.splitTextToSize(step, contentW - 22);
      doc.text(stepLines, margin + 16, y + 4.5);

      y += Math.max(stepLines.length * 4, 10) + 2;
    });

    y += 4;
  }

  // ══════════════════════════════════════
  // 3. SKILLS OVERVIEW (Top Career)
  // ══════════════════════════════════════
  if (topRec) {
    sectionHeader(">>", "Skills Overview", `For ${topRec.career_title}`);

    const colW = (contentW - 8) / 2;
    const maxSkills = Math.max(topRec.skills_you_have.length, topRec.skills_to_develop.length);
    const skillsBlockH = 10 + maxSkills * 5;
    checkPage(skillsBlockH);

    // Skills You Have column
    doc.setTextColor(...successGreen);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("+ Skills You Have", margin + 4, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    topRec.skills_you_have.forEach((skill, i) => {
      doc.setTextColor(...gray500);
      doc.text(`  +  ${skill}`, margin + 4, y + 6 + i * 5);
    });

    // Skills to Develop column
    doc.setTextColor(...highlightYellow);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("~  Skills to Develop", margin + 4 + colW, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    topRec.skills_to_develop.forEach((skill, i) => {
      doc.setTextColor(...gray500);
      doc.text(`  ~  ${skill}`, margin + 4 + colW, y + 6 + i * 5);
    });

    y += 6 + maxSkills * 5 + 6;
  }

  // ══════════════════════════════════════
  // 4. TOOLS & CAREER OUTLOOK (Top Career)
  // ══════════════════════════════════════
  if (topRec) {
    sectionHeader(">>", "Tools & Career Outlook", `For ${topRec.career_title}`);

    const outlook = topRec.career_outlook;
    const outlookItems = [
      { label: "Entry Salary", val: outlook.salary_entry },
      { label: "Experienced Salary", val: outlook.salary_experienced },
      { label: "Growth Potential", val: outlook.growth_potential },
      { label: "Work-Life Balance", val: outlook.work_life_balance },
      { label: "Job Availability", val: outlook.job_availability },
    ];

    checkPage(18);
    const itemW = (contentW - 4) / 3;
    outlookItems.forEach((item, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const ox = margin + 2 + col * itemW;
      const oy = y + row * 14;

      doc.setFillColor(248, 249, 250);
      doc.roundedRect(ox, oy, itemW - 2, 12, 1.5, 1.5, "F");

      doc.setTextColor(...gray500);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, ox + 3, oy + 4.5);

      doc.setTextColor(...brandDark);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const valLines = doc.splitTextToSize(item.val, itemW - 8);
      doc.text(valLines[0], ox + 3, oy + 9.5);
    });

    y += Math.ceil(outlookItems.length / 3) * 14 + 6;
  }

  // ══════════════════════════════════════
  // 5. QUICK-START NEXT STEPS (Top 3 Careers)
  // ══════════════════════════════════════
  sectionHeader(">>", "Quick-Start Next Steps");

  const allSteps = recommendations.slice(0, 3).flatMap((rec) =>
    rec.next_steps.slice(0, 2).map((step) => ({
      career: rec.career_title,
      step,
    }))
  );

  allSteps.forEach((item, i) => {
    checkPage(14);
    doc.setFillColor(248, 249, 252);
    const stepTextLines = doc.splitTextToSize(item.step, contentW - 24);
    const rowH = stepTextLines.length * 4 + 6;
    doc.roundedRect(margin, y, contentW, rowH, 2, 2, "F");

    // Number badge
    doc.setFillColor(...brandPrimary);
    doc.circle(margin + 7, y + rowH / 2, 3, "F");
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}`, margin + 7, y + rowH / 2 + 1.2, { align: "center" });

    // Step text
    doc.setTextColor(...brandDark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(stepTextLines, margin + 14, y + 5);

    // Career label
    doc.setTextColor(...gray500);
    doc.setFontSize(6.5);
    doc.text(`-> ${item.career}`, margin + 14, y + rowH - 2);

    y += rowH + 2;
  });

  y += 6;

  // ══════════════════════════════════════
  // 6. ALL CAREER CARDS
  // ══════════════════════════════════════
  sectionHeader(">>", "All Career Matches");

  recommendations.forEach((rec, i) => {
    checkPage(30);

    const cardStartY = y;

    // Card accent bar
    const accent: [number, number, number] = i === 0 ? brandPrimary : gray200;
    doc.setFillColor(...accent);
    doc.rect(margin, y, 3, 6, "F"); // Just a small accent, will extend later

    // Rank badge
    const badgeFill: [number, number, number] = i === 0 ? brandPrimary : [230, 230, 240];
    doc.setFillColor(...badgeFill);
    doc.circle(margin + 12, y + 7, 4.5, "F");
    const badgeText: [number, number, number] = i === 0 ? white : gray500;
    doc.setTextColor(...badgeText);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${rec.rank}`, margin + 12, y + 8.5, { align: "center" });

    // Title
    doc.setTextColor(...brandDark);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(rec.career_title, margin + 20, y + 9);

    // Fit score
    doc.setTextColor(...fitColor(rec.fit_score));
    doc.setFontSize(16);
    doc.text(`${rec.fit_score}%`, pageW - margin - 2, y + 9, { align: "right" });

    doc.setTextColor(...gray500);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text("fit score", pageW - margin - 2, y + 13.5, { align: "right" });

    // Fit bar
    const barX = pageW - margin - 30;
    const barW = 26;
    doc.setFillColor(...gray200);
    doc.roundedRect(barX, y + 15, barW, 2, 1, 1, "F");
    doc.setFillColor(...fitColor(rec.fit_score));
    doc.roundedRect(barX, y + 15, barW * (rec.fit_score / 100), 2, 1, 1, "F");

    let cy = y + 22;

    // Why This Fits
    checkPage(16);
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("Why This Fits You", margin + 6, cy);
    cy += 4;
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const whyLines = doc.splitTextToSize(rec.why_fits, contentW - 14);
    doc.text(whyLines, margin + 6, cy);
    cy += whyLines.length * 3.5 + 3;

    // What You'll Do
    checkPage(16);
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("What You'll Do", margin + 6, cy);
    cy += 4;
    doc.setTextColor(...gray500);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const roleLines = doc.splitTextToSize(rec.role_description, contentW - 14);
    doc.text(roleLines, margin + 6, cy);
    cy += roleLines.length * 3.5 + 4;

    // Skills columns
    checkPage(20);
    const colW = (contentW - 14) / 2;

    doc.setTextColor(...successGreen);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("+ Skills You Have", margin + 6, cy);

    doc.setTextColor(...highlightYellow);
    doc.text("~ Skills to Develop", margin + 6 + colW, cy);
    cy += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const maxSkills = Math.max(rec.skills_you_have.length, rec.skills_to_develop.length);
    for (let s = 0; s < maxSkills; s++) {
      checkPage(5);
      if (rec.skills_you_have[s]) {
        doc.setTextColor(...gray500);
        doc.text(`  +  ${rec.skills_you_have[s]}`, margin + 6, cy + s * 4);
      }
      if (rec.skills_to_develop[s]) {
        doc.setTextColor(...gray500);
        doc.text(`  ~  ${rec.skills_to_develop[s]}`, margin + 6 + colW, cy + s * 4);
      }
    }
    cy += maxSkills * 4 + 4;

    // Career Outlook (all 5 items)
    checkPage(24);
    doc.setTextColor(...brandPrimary);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Career Outlook", margin + 6, cy);
    cy += 4;

    const outlookItems = [
      { label: "Entry Salary", val: rec.career_outlook.salary_entry },
      { label: "Experienced", val: rec.career_outlook.salary_experienced },
      { label: "Growth", val: rec.career_outlook.growth_potential },
      { label: "Work-Life", val: rec.career_outlook.work_life_balance },
      { label: "Jobs", val: rec.career_outlook.job_availability },
    ];

    const oItemW = (contentW - 14) / 3;
    outlookItems.forEach((item, oi) => {
      const row = Math.floor(oi / 3);
      const col = oi % 3;
      const ox = margin + 6 + col * oItemW;
      const oy = cy + row * 12;

      doc.setFillColor(248, 249, 250);
      doc.roundedRect(ox, oy, oItemW - 2, 10, 1, 1, "F");

      doc.setTextColor(...gray500);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, ox + 2, oy + 4);

      doc.setTextColor(...brandDark);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const valText = doc.splitTextToSize(item.val, oItemW - 6);
      doc.text(valText[0], ox + 2, oy + 8);
    });
    cy += Math.ceil(outlookItems.length / 3) * 12 + 4;

    // Next Steps
    checkPage(16);
    doc.setTextColor(...accentColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Your Next Steps", margin + 6, cy);
    cy += 4;

    rec.next_steps.forEach((step, si) => {
      checkPage(8);
      // Number
      doc.setFillColor(248, 240, 255);
      doc.circle(margin + 10, cy + 1.5, 2.5, "F");
      doc.setTextColor(...accentColor);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(`${si + 1}`, margin + 10, cy + 2.5, { align: "center" });

      // Text
      doc.setTextColor(...gray500);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const nsLines = doc.splitTextToSize(step, contentW - 24);
      doc.text(nsLines, margin + 16, cy + 2.5);
      cy += nsLines.length * 3.5 + 3;
    });

    // Card border & accent bar
    const cardH = cy + 4 - cardStartY;
    doc.setFillColor(...accent);
    doc.rect(margin, cardStartY, 3, cardH, "F");
    doc.setDrawColor(...gray200);
    doc.roundedRect(margin, cardStartY, contentW, cardH, 2, 2, "S");

    y = cardStartY + cardH + 8;
  });

  // ══════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════
  const addFooter = () => {
    doc.setFillColor(...brandDark);
    doc.rect(0, pageH - 12, pageW, 12, "F");
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by PathGenie - AI-Powered Career Guidance", pageW / 2, pageH - 5, {
      align: "center",
    });
  };

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addFooter();
  }

  doc.save("PathGenie-Career-Report.pdf");
}

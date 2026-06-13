"use client";

import React from "react";

import {
  Download,
} from "lucide-react";

interface Props {
  targetId: string;
}

export default function PrescriptionPDFButton({
  targetId,
}: Props) {

  const handleDownload =
    async () => {

      const html2pdf =
        (
          await import(
            "html2pdf.js"
          )
        ).default;

      const element =
        document.getElementById(
          targetId
        );

      if (!element) return;

      html2pdf()
        .set({
          margin: 0.5,
          filename:
            "prescription.pdf",
          image: {
            type: "jpeg",
            quality: 1,
          },
          html2canvas: {
            scale: 2,
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation:
              "portrait",
          },
        })
        .from(element)
        .save();
    };

  return (
    <button
      onClick={
        handleDownload
      }
      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-or-green text-foreground font-bold hover:opacity-90 transition-all"
    >

      <Download className="h-4 w-4" />

      Download PDF

    </button>
  );
}
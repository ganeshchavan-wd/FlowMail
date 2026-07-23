export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function extractPdf(buffer: Buffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    text += content.items
      .map((item: any) => item.str)
      .join(" ");

    text += "\n";
  }

  return text;
}
function extractEmails(text: string) {
  const emails =
    text.match(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
    ) || [];

  return [...new Set(emails)];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    let text = "";

    switch (extension) {
      case "pdf":
        text = await extractPdf(buffer);
        break;

      case "docx":
        const doc = await mammoth.extractRawText({
          buffer,
        });

        text = doc.value;
        break;

      case "txt":
        text = buffer.toString("utf8");
        break;

      case "csv":
        text = buffer.toString("utf8");
        break;

      case "xlsx":
        const workbook = XLSX.read(buffer);

        workbook.SheetNames.forEach((sheet) => {
          const worksheet =
            workbook.Sheets[sheet];

          text += XLSX.utils.sheet_to_csv(
            worksheet
          );
        });

        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              "Supported formats: PDF, DOCX, TXT, CSV, XLSX",
          },
          {
            status: 400,
          }
        );
    }

    const emails = extractEmails(text);

    return NextResponse.json({
      success: true,
      filename: file.name,
      totalEmails: emails.length,
      emails,
      preview: text.substring(0, 500),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process document.",
      },
      {
        status: 500,
      }
    );
  }
} 
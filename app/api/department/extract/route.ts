
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "docx",
  "txt",
  "csv",
  "xlsx",
];

function extractEmails(text: string): string[] {
  const matches =
    text.match(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
    ) || [];

  return [
    ...new Set(matches.map((email) => email.toLowerCase())),
  ];
}


async function extractPdf(buffer: Buffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  const pages: string[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) =>
        typeof item.str === "string" ? item.str : ""
      )
      .join(" ");

    pages.push(pageText);
  }

  return pages.join("\n");
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function extractXlsx(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  return workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_csv(worksheet);
  }).join("\n");
}

export async function POST(req: NextRequest) {
  let filename = "unknown";

  try {
    // Read the uploaded multipart form.
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No file received. Please upload a file using the field name "file".',
        },
        { status: 400 }
      );
    }

    filename = file.name;

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must be 4 MB or smaller.",
        },
        { status: 413 }
      );
    }

    const extension =
      filename.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported file type. Supported formats: PDF, DOCX, TXT, CSV, XLSX.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";

    switch (extension) {
      case "pdf":
        text = await extractPdf(buffer);
        break;

      case "docx":
        text = await extractDocx(buffer);
        break;

      case "txt":
      case "csv":
        text = buffer.toString("utf8");
        break;

      case "xlsx":
        text = extractXlsx(buffer);
        break;
    }

    const emails = extractEmails(text);

    console.info("[department/extract] Success", {
      filename,
      fileSize: file.size,
      extension,
      totalEmails: emails.length,
    });

    return NextResponse.json({
      success: true,
      filename,
      totalEmails: emails.length,
      emails,
      preview: text.substring(0, 500),
    });
  } catch (error) {
    console.error("[department/extract] Failed:", {
      filename,
      error:
        error instanceof Error
          ? error.stack || error.message
          : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process document. Please try another file.",
      },
      { status: 500 }
    );
  }
}

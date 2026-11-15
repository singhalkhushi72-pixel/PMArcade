import fs from 'fs';
import AdmZip from 'adm-zip';
import pdfParse from 'pdf-parse';

export interface ParsedSlide {
  slideNumber: number;
  title: string;
  content: string;
  notes?: string;
}

export interface ParsedDocument {
  title: string;
  totalSlides: number;
  slides: ParsedSlide[];
  combinedText: string;
}

function extractTextFromXml(xml: string): string {
  const regex = /<a:t(?:\s+[^>]*)?>([\s\S]*?)<\/a:t>/gi;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
    if (text) {
      matches.push(text);
    }
  }

  return matches.join(' ');
}

export async function parsePptx(filePath: string, originalName: string): Promise<ParsedDocument> {
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();

  const slideEntries = zipEntries.filter((entry) =>
    /^ppt\/slides\/slide\d+\.xml$/i.test(entry.entryName)
  );

  slideEntries.sort((a, b) => {
    const numA = parseInt(a.entryName.match(/\d+/)![0], 10);
    const numB = parseInt(b.entryName.match(/\d+/)![0], 10);
    return numA - numB;
  });

  const parsedSlides: ParsedSlide[] = [];

  slideEntries.forEach((entry, idx) => {
    const slideNumber = idx + 1;
    const xml = entry.getData().toString('utf-8');
    const text = extractTextFromXml(xml);

    let notesText = '';
    const noteEntry = zipEntries.find((e) =>
      new RegExp(`^ppt/notesSlides/notesSlide${slideNumber}\\.xml$`, 'i').test(e.entryName)
    );
    if (noteEntry) {
      notesText = extractTextFromXml(noteEntry.getData().toString('utf-8'));
    }

    const words = text.split(/\s+/).filter(Boolean);
    const title = words.slice(0, 8).join(' ') || `Slide ${slideNumber}`;

    parsedSlides.push({
      slideNumber,
      title,
      content: text,
      notes: notesText || undefined
    });
  });

  let deckTitle = originalName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  if (parsedSlides[0]?.title && parsedSlides[0].title.length > 5) {
    deckTitle = parsedSlides[0].title;
  }

  const combinedText = parsedSlides
    .map((s) => `--- Slide ${s.slideNumber}: ${s.title} ---\n${s.content}${s.notes ? `\n[Notes: ${s.notes}]` : ''}`)
    .join('\n\n');

  return {
    title: deckTitle,
    totalSlides: parsedSlides.length || 1,
    slides: parsedSlides,
    combinedText
  };
}

export async function parsePdf(filePath: string, originalName: string): Promise<ParsedDocument> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const rawPages = data.text.split(/\f|\n\s*---\s*Page\s*\d+\s*---\s*\n/i).filter((p) => p.trim().length > 0);
  const slides: ParsedSlide[] = [];

  rawPages.forEach((pageText, idx) => {
    const slideNumber = idx + 1;
    const trimmed = pageText.trim();
    const firstLine = trimmed.split('\n')[0]?.trim() || `Page ${slideNumber}`;
    const title = firstLine.slice(0, 50);

    slides.push({
      slideNumber,
      title,
      content: trimmed
    });
  });

  const deckTitle = originalName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const combinedText = slides
    .map((s) => `--- Slide ${s.slideNumber}: ${s.title} ---\n${s.content}`)
    .join('\n\n');

  return {
    title: deckTitle,
    totalSlides: slides.length || 1,
    slides,
    combinedText
  };
}

export async function parseFile(filePath: string, originalName: string): Promise<ParsedDocument> {
  const ext = originalName.split('.').pop()?.toLowerCase();
  if (ext === 'pptx' || ext === 'ppt') {
    return parsePptx(filePath, originalName);
  } else if (ext === 'pdf') {
    return parsePdf(filePath, originalName);
  } else {
    throw new Error(`Unsupported file type: .${ext}. Please upload .pptx or .pdf files.`);
  }
}

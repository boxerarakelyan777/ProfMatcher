import { NextResponse } from 'next/server';
import { scrapeProfessorPage } from '../../../../utils/scraper';
import { storeProfessorData } from '../../../../utils/pinecone';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Scraping professor page:', url);
    const professorData = await scrapeProfessorPage(url);
    console.log('Scraped professor data:', professorData);

    console.log('Storing professor data in Pinecone');
    await storeProfessorData(professorData);

    return NextResponse.json({ 
      message: 'Professor data successfully scraped and stored',
      professorData: professorData
    }, { status: 200 });
  } catch (error) {
    console.error('Detailed error in processing professor submission:', error);
    return NextResponse.json({ 
      error: 'Failed to process professor submission', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
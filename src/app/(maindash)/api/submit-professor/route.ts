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

    // Ensure overallRating is a number
    const processedData = {
      ...professorData,
      overallRating: professorData.overallRating ?? 0 // Use 0 if null
    };

    console.log('Storing professor data in Pinecone');
    await storeProfessorData(processedData);

    return NextResponse.json({ 
      message: 'Professor data successfully scraped and stored',
      professorData: processedData
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Detailed error in processing professor submission:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to process professor submission', 
        details: error.message,
        stack: error.stack
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        error: 'Failed to process professor submission', 
        details: 'An unknown error occurred'
      }, { status: 500 });
    }
  }
}
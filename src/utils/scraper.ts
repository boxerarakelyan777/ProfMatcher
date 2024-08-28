import axios from 'axios';
import * as cheerio from 'cheerio';

interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number | null;
  reviews: {
    text: string;
    rating: number | null;
    date: string;
  }[];
}

export async function scrapeProfessorPage(url: string): Promise<ProfessorData> {
  try {
    console.log('Fetching page:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data length:', response.data.length);

    if (typeof response.data !== 'string') {
      throw new Error('Unexpected response data type');
    }

    const $ = cheerio.load(response.data);

    console.log('Cheerio loaded successfully');

    const name = $('.NameTitle__Name-sc-19mggdt-0').text().trim() || 'N/A';
    console.log('Scraped name:', name);

    const department = $('.NameTitle__Title-sc-19mggdt-1').text().trim() || 'N/A';
    console.log('Scraped department:', department);

    const institution = $('.NameTitle__Title-sc-19mggdt-1').next().text().trim() || 'N/A';
    console.log('Scraped institution:', institution);

    const overallRatingText = $('.RatingValue__Numerator-qw8sqy-2').text().trim();
    const overallRating = overallRatingText ? parseFloat(overallRatingText) : null;
    console.log('Scraped overall rating:', overallRating);

    const reviews = $('.Rating__RatingBody-sc-1rhvpxz-0').map((_, el) => {
      const $review = $(el);
      const ratingText = $review.find('.RatingHeader__RatingNumber-sc-1dlkqw1-1').text().trim();
      const review = {
        text: $review.find('.Comments__StyledComments-dzzyvm-0').text().trim() || 'N/A',
        rating: ratingText ? parseFloat(ratingText) : null,
        date: $review.find('.TimeStamp__StyledTimeStamp-sc-9q2r30-0').text().trim() || 'N/A',
      };
      console.log('Scraped review:', review);
      return review;
    }).get();

    return { name, department, institution, overallRating, reviews };
  } catch (error) {
    console.error('Detailed error in scraping professor page:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(`Failed to scrape professor page: ${error.message}`);
  }
}
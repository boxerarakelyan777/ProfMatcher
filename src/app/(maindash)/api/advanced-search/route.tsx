import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Professor {
  name: string;
  school: string;
  department: string;
  rating: number;
  teachingStyle: string;
  courseLevel: string;
}

export async function POST(req: Request) {
  try {
    const { teacherName, schoolName, department, minRating, courseLevel, teachingStyle } = await req.json();
    
    console.log('Received search criteria:', { teacherName, schoolName, department, minRating, courseLevel, teachingStyle });

    // Construct the search URL
    const searchQuery = [teacherName, schoolName, department].filter(Boolean).join(' ');
    const searchUrl = `https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(searchQuery)}`;
    console.log('Searching URL:', searchUrl);

    // Fetch the search results page
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Extract professor information from the search results
    const professors: Professor[] = $('.TeacherCard__StyledTeacherCard-syjs0d-0').map((_, el) => {
      const $el = $(el);
      const name = $el.find('.NameTitle__Name-dowf0z-0').text().trim();
      const school = $el.find('.NameTitle__Title-dowf0z-1').text().trim();
      const departmentInfo = $el.find('.Department__StyledDepartment-sc-1v5glsi-0').text().trim();
      const ratingText = $el.find('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2').text().trim();
      const rating = ratingText ? parseFloat(ratingText) : 0;

      // Simulate additional data
      const teachingStyles = ['lecture', 'interactive', 'hands-on'];
      const courseLevels = ['introductory', 'intermediate', 'advanced'];
      
      return {
        name,
        school,
        department: departmentInfo,
        rating,
        teachingStyle: teachingStyles[Math.floor(Math.random() * teachingStyles.length)],
        courseLevel: courseLevels[Math.floor(Math.random() * courseLevels.length)]
      };
    }).get();

    console.log(`Found ${professors.length} professors before filtering`);

    // Filter and rank professors based on criteria
    const filteredProfessors = professors.filter(prof => {
      const schoolMatch = !schoolName || prof.school.toLowerCase().includes(schoolName.toLowerCase());
      const departmentMatch = !department || prof.department.toLowerCase().includes(department.toLowerCase());
      const ratingMatch = prof.rating >= (minRating || 0);
      const courseLevelMatch = !courseLevel || prof.courseLevel === courseLevel;
      const teachingStyleMatch = !teachingStyle || prof.teachingStyle === teachingStyle;
      
      console.log(`Filtering ${prof.name}: school=${schoolMatch}, department=${departmentMatch}, rating=${ratingMatch}, courseLevel=${courseLevelMatch}, teachingStyle=${teachingStyleMatch}`);
      
      return schoolMatch && departmentMatch && ratingMatch && courseLevelMatch && teachingStyleMatch;
    });

    console.log(`Filtered to ${filteredProfessors.length} professors`);

    // Sort professors by rating (descending)
    const rankedProfessors = filteredProfessors.sort((a, b) => b.rating - a.rating);

    // Return top 10 results
    const results = rankedProfessors.slice(0, 10);
    console.log(`Returning ${results.length} professors`);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json({ error: 'Failed to perform advanced search' }, { status: 500 });
  }
}
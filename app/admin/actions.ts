'use server';

import Exa from "exa-js";

export async function scrapeUrl(prevState: any, formData: FormData) {
  const url = formData.get('url') as string;
  if (!url) return { data: null, error: 'URL is required' };

  
  const exa = new Exa("8e22846c-616f-4a1f-a677-db54533d1065");
  
  try {
    const result = await exa.getContents(
      [url],
      {
        subpages: 6,
        summary: true,
        text: true,
        livecrawl: "fallback"
      }
    );
    
    console.log(result);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error scraping URL:', error);
    return { data: null, error: 'Failed to scrape URL' };
  }
}

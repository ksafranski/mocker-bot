/**
 * Number of records to generate
 */

export const COUNT = 1;

/**
 * Give some context as to what this data is being used for, goals for the output
 * and any other relevant information that will help the AI understand how to best
 * generate the data to fit your needs.
 */

export const CONTEXT = `
  The output of this schema will be used to generate mock data for a web application
  that allows users to search for and connect with professionals in the computer
  science and engineering fields. The data will be used to populate the profiles
  of these professionals and should be realistic and representative of the skills
  and experience that professionals in these fields typically have.
`;

/**
 * Define the schema for the JSON data. Be clear and verbose in the descriptions
 * to get the best results from the AI.
 */

export const SCHEMA = {
  id: 'random uuid v4',
  first_name: 'random first name',
  last_name: 'random last name',
  email: 'random email from first and last name',
  skills: `
    random array of 2 to 5 skills, related to computer science and engineering',
  `,
  summary: '2-3 sentence summary of capabilities summating based on the skills',
  experience: `
    array of objects with company, title, start_date, end_date with a range of between 1 and 5 years,
    and 1-2 sentence description which should reflect the skills generated.
  `,
};

/**
 * OPTIONAL: After the data is generated you can run through the output and have
 * images generated for the profiles. This is a good way to make the mock data
 * when creating personas for your application.
 */

export const GENERATE_IMAGES = {
  property_name: 'profile_image',
  prompt: `
    Generate a color, photorealistic image to be used as a profile picture of a
    person based on the first and last name from the root of the JSON data provided.
    
    There should be no other decorations, flourishes, or text on the image;
    only the person's face as someone would use as a LinkedIn profile photo.

    The person should be between the ages of 25 and 75, and with a professional
    appearance.
    
    The image should be on a white background. Crop image to fit a 1:1 aspect ratio with
    no padding, spacing, or border.
  `,
};

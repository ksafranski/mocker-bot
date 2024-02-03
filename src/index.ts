import OpenAI from 'openai';
const { OPEN_AI_API_KEY } = process.env;
import {
  promises as fsPromises,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  lstatSync,
} from 'fs';
import { resolve as resolvePath } from 'path';
const { Readable } = require('stream');

// Random ID for the output directory
let RUN_ID = `output-1`;

// Config data
import { COUNT, CONTEXT, SCHEMA, GENERATE_IMAGES } from '../config';

// New instance of the OpenAI API
const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY as string,
});

/**
 * Generates mock data based on the schema and context provided and retruns the JSON array
 */
export const generateMockData = async (): Promise<string> => {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `
        You are a bot designed to help people generate JSON data array for mocking applications.

        You will be provided a JSON schema where the key represents to key of the output
        data in the resulting JSON file, and the value for the key describes the data to
        generate and associate with that property.

        Regardless of the count, the data should be generated in an array of objects.

        Do not provide any explanation or additional information, only the JSON data that is
        generated, prepared for saving to a JSON file without any formatting or being written
        as a code block in markdown format.
        `,
      },
      {
        role: 'user',
        content: `
        Use the following data to generate a mock JSON file that adheres to the schema:

        """${JSON.stringify(SCHEMA)}"""

        ${CONTEXT}

        Provide a JSON file with ${COUNT} records.
        `,
      },
    ],
    stream: true,
    temperature: 1,
  });
  let compiledOutput = '';
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
    compiledOutput += chunk.choices[0]?.delta?.content || '';
  }
  return compiledOutput;
};

/**
 * Writes the JSON data to a file
 */
const generateOutputFile = async (text: string): Promise<void> => {
  const outputFile = resolvePath(`./output/${RUN_ID}/data.json`);
  await fsPromises.writeFile(outputFile, text);
};

/**
 * Generates an image based on the JSON data provided using DALL-E
 */
const generateImage = async (record: typeof SCHEMA): Promise<string> => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `
      Below is the JSON data that contains the information for the image generation:

      ###${JSON.stringify(record)}###

      ${GENERATE_IMAGES.prompt}
    `,
    n: 1,
    size: '1024x1024',
  });
  return response.data[0].url;
};

/**
 * Itterates through the JSON data and generates images for each record,
 * saving the image to the images directory and updating the JSON data with the image name
 */
const generateImages = async (data: string): Promise<any> => {
  console.log('\n\nGenerating images...');
  // Make the images directory if it doesn't exist
  if (!existsSync(`./output/${RUN_ID}/images`))
    mkdirSync(`./output/${RUN_ID}/images`);
  let imageGenData = JSON.parse(data);
  // Generate the images from DALL-E and save them to the images directory
  await Promise.all(
    imageGenData.map(async record => {
      const res = await generateImage(record);
      const imageName = new URL(res).pathname.split('/').pop();
      await Readable.fromWeb((await fetch(res)).body).pipe(
        createWriteStream(`./output/${RUN_ID}/images/${imageName}`)
      );
      // Update the JSON data with the image name
      record[GENERATE_IMAGES.property_name || 'image'] = imageName;
    })
  );
  return imageGenData;
};

// Set the run ID for the output directory based on count of existing
const setRunId = () => {
  const entries = readdirSync('./output');
  let count = 0;
  for (const entry of entries) {
    if (lstatSync(`./output/${entry}`).isDirectory()) {
      count++;
    }
  }
  RUN_ID = `run-${count + 1}`;
};

/**
 * Runs the bot to generate the mock data and (if applicable) images
 */
const runBot = async (): Promise<void> => {
  console.clear();
  // Make directories if they don't exist
  if (!existsSync('./output')) mkdirSync('./output');
  // Set the run id for the output directory
  setRunId();
  // Create specific output directory for this run
  if (!existsSync(`./output/${RUN_ID}`)) mkdirSync(`./output/${RUN_ID}`);
  // Generate the mock data
  const mockData = await generateMockData();
  await generateOutputFile(mockData);
  // Generate images if applicable
  if (GENERATE_IMAGES.prompt) {
    const updatedDataWithImages = await generateImages(mockData);
    await generateOutputFile(JSON.stringify(updatedDataWithImages, null, 2));
  }
  // Log the completion message
  console.log(
    `\nDone! Generated mock data${
      GENERATE_IMAGES.prompt ? ' and images' : ''
    } in ./output/${RUN_ID}`
  );
};

runBot();

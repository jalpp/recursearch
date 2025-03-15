import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Creates a report file with a unique filename
 * @param filename Name of the file to create (without extension)
 * @param content Content to write to the file
 * @param format Either 'markdown' or 'text' to determine file extension
 * @returns Promise that resolves with the full path of the created report
 */
export async function createReport(
  filename: string, 
  content: string, 
  format: 'markdown' | 'text' = 'markdown'
): Promise<string> {

  const extension = format === 'markdown' ? '.md' : '.txt';
  
  
  const baseFilename = filename.endsWith('.md') || filename.endsWith('.txt') 
    ? filename.substring(0, filename.lastIndexOf('.'))
    : filename;
  
 
  const reportsDir = path.resolve(process.cwd(), 'reports');
  
  
  await fs.mkdir(reportsDir, { recursive: true });
  
  
  let counter = 0;
  let uniqueFilename = `${baseFilename}${extension}`;
  let outputPath = path.join(reportsDir, uniqueFilename);
  

  while (true) {
    try {
     
      await fs.stat(outputPath);
     
      counter++;
      uniqueFilename = `${baseFilename}-${counter}${extension}`;
      outputPath = path.join(reportsDir, uniqueFilename);
    } catch (error) {

      break;
    }
  }
  
 
  await fs.writeFile(outputPath, content, 'utf8');
  
  return outputPath;
}
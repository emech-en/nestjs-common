import { readFileSync } from 'fs';
import { join } from 'path';

export const getXingHtmlText = (consumerKey: string): string => {
  const htmlFile = readFileSync(join(__dirname, 'xing.login.html')).toString();
  htmlFile.replace('[[[[YOUR_CONSUMER_KEY]]]]', consumerKey);
  console.log(htmlFile);
  return htmlFile;
};

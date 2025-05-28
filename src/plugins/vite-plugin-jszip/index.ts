import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import jsZip from 'jszip';
import type {VitePluginJszipOptions} from "./index.d";


export default async function vitePluginJszip(options:VitePluginJszipOptions) {
  let viteConfig;
  const defaultOptions:VitePluginJszipOptions = {
    inputDir: 'dist', // 输入目录，默认为 'dist'
    outputDir: 'dist-zip', // 输出目录，默认为 'dist-zip'
    outputName: 'output.zip', // 输出文件名，默认为 'output.zip'
    exclude: undefined, // 需要排除的文件或目录，默认为空
  }
  const mergedOptions = {...defaultOptions, ...options};

  return {
    name: 'vite-plugin-zip',
    configureResolved(config) {
      viteConfig = config;
    },
    enforce: 'post',
closeBundle: async () => {
//   const zip = new jsZip();
//   const distPath = path.resolve(viteConfig.root, mergedOptions.inputDir!);
//   if (!fs.existsSync(distPath)) {
//     throw new Error(`Source directory ${distPath} does not exist`);
// }
//   const files = await glob('**/*', { cwd: distPath,
//     nodir: true,
//     ignore: mergedOptions.exclude
// });

// for(const file of files) {
// const content = await fs.promises.readFile(path.join(distPath, file));
// zip.file(file, content);
// }

// const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
// const outputPath = path.resolve(viteConfig.root, mergedOptions.outputDir!);
// const outputFileName = path.join(outputPath, mergedOptions.outputName!);

// if (!fs.existsSync(outputPath)) {
// fs.mkdirSync(outputPath, { recursive: true });
// }
// await fs.promises.writeFile(outputFileName, zipContent);

    async generateBundle(_, bundle) {
      const zip = new jsZip();
      for (const [fileName, file] of Object.entries(bundle)) {
        if (file.type === 'asset') {
          zip.file(path.basename(fileName), await fs.promises.readFile(file.source));
        }
      }
      await fs.promises.writeFile('dist/output.zip', await zip.generateAsync
  };

    const {
      src,
      dest,
      include,
      exclude = [],
      filter,
      concurrency = 10,
      onProgress,
      onEnd,
      onZipError,
      onError,
    } = options;

    if (!fs.existsSync(src)) throw new Error(`Source directory ${src} does not exist`);

    let filesToInclude = [];

    try {
      filesToInclude = await glob(path.join(src, '**/*'), { ignore: exclude
    });
    } catch (error) {
      throw new Error(`Error reading source directory: ${error.message}`);
    }

    if (include) {
      filesToInclude = filesToInclude.filter((file) => include.some((pattern) => file.includes(pattern)));
    }

    if (filter) {
      filesToInclude = filesToInclude.filter(filter);
  
      const zip = new jsZip();
      const promises = [];
      let totalFiles = filesToInclude.length;
      let completedFiles = 0;
      let currentIndex = 0;
      const concurrencyLimit = Math.min(concurrency, totalFiles);
      const startTime = Date.now();
      const zipFileName = path.basename(dest);
      const zipFilePath = path.join(dest, zipFileName);
      const zipFileDir = path.dirname(zipFilePath);
      if (!fs.existsSync(zipFileDir)) fs.mkdirSync(zipFileDir, { recursive: true });
      const readFile = (file) => new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
          if (err) {
            reject(err); 
          } 
          else {
            resolve(data); 
          }
        }) 
      })
      const addFileToZip = async (file) => {
        try {
          const relativePath = path.relative(src, file);
          const fileData = await readFile(file);
          zip.file(relativePath, fileData);
          completedFiles++;
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(1, completedFiles / totalFiles);
          const speed = completedFiles / (elapsedTime / 1000);
          const remainingTime = (totalFiles - completedFiles) / speed;
          const formattedElapsedTime = new Date(elapsedTime).toISOString().substr(11, 8);
          const formattedRemainingTime = new Date(remainingTime * 1000).toISOString().substr(11, 8);
          onProgress && onProgress({ file, progress, speed, elapsedTime: formattedElapsedTime, remainingTime: formattedRemainingTime });
          resolve(); 
        } 
        catch (error) {
          onZipError && onZipError({ file, error });
          reject(error); 
        }
      }
      const processNextFile = () => {
        if (currentIndex < totalFiles) {
          const file = filesToInclude[currentIndex];
          currentIndex++;
          addFileToZip(file).then(processNextFile, processNextFile);
        } 
      }
      for (let i = 0; i < concurrencyLimit; i++) {
        processNextFile(); 
      }
      Promise.all(promises).then(() => {
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs.createWriteStream(zipFilePath)).on('finish', () => {
          const elapsedTime = Date.now() - startTime;
          const formattedElapsedTime = new Date(elapsedTime).toISOString().substr(11, 8);
          onEnd && onEnd({ zipFilePath, elapsedTime: formattedElapsedTime }); 
        }) 
      })
    }
  }
}

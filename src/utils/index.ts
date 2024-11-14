export * from './message';

import axios from 'axios';
import sourceMap from 'source-map-js';

const getSourcemap = async (url: string) => {
  return await axios.get(url);
};

/**
 * 通过sourcemap还原源代码
 * @param stackFrame
 */
export const findCodeBySourcemap = async (stackFrame: any) => {
  const sourcemap = await getSourcemap(stackFrame.sourceMapUrl + '.map');
  const fileContent = sourcemap.data;
  // 解析map文件
  const consumer = await new sourceMap.SourceMapConsumer(fileContent);
  // 通过报错的位置查找对应源文件的名称和报错行数
  const originalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber || 0
  });
  // 还原之后的源代码
  const code = consumer.sourceContentFor(originalPosition.source);
  console.log(code);
};

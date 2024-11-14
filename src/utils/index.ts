export * from './message';

import axios from 'axios';
import sourceMap from 'source-map-js';

const getSourcemap = async (url: string) => {
  return await axios.get(url);
};

/**
 * 通过sourcemap还原源代码
 * @param stackFrame
 * 用error-stack-parser和 source-map-js，且sourcemap 开启，sourcemap线上换进会放其他服务器
 */
export const findCodeBySourcemap = async (stackFrame: any) => {
  //   const baseUrl = '存放sourcemap的服务器地址';
  //   const sourcemap = await getSourcemap(baseUrl + stackFrame.fileName + '.map');
  const sourcemap = await getSourcemap(stackFrame.fileName + '.map');
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
  console.log('sourcemap还原之后的源代码', code);
};

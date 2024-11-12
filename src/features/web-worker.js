// const worker = new Worker('./child-progress.js');
// ...

// 使用以下两种方法代替上面代码的实现，不用在worker实例引入child-progress.js文件，
// 而直接在主线程编写子线程代码丢给worker实例执行。
const code = `console.log('子线程代码')`;

// 01 Object URL
const blob = new Blob([code], { type: 'application/javascript' });
let workerUrl = URL.createObjectURL(blob);

// 02 Data URL
workerUrl = `data:application/javascript;utf8,${code}`;

const worker = new Worker(workerUrl);

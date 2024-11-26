/**
 * 计算年龄
 * @param {string} birthday
 */
function getAge(birthday = '2022-11-23') {
  // TODO：输入效验（- /）
  // TODO: 该接口有几十上千万次访问如何优化（setTimeout、requestIdleCallback、postMessage、web Worker）
  // TODO：代码可读性
  const prev = new Date(birthday);
  const now = new Date();

  let age = now.getFullYear() - prev.getFullYear();
  const month = now.getMonth() - prev.getMonth();
  const day = prev.getDate() - now.getDate();

  if (month < 0 || (month === 0 && day > 0)) age--;
  console.log(age);
  // TODO: 格式化输出
  return age;
}

getAge();

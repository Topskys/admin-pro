// 这里是通俗的解释 详情请前往官方文档查阅
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 信息以空格开头
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'], // 信息最大长度
    'header-max-length': [2, 'always', 108], // 信息不能未空
    'subject-empty': [2, 'never'], // 信息类型不能未空
    'type-empty': [2, 'never'], // 提交信息的类型 下文有介绍
    'type-enum': [
      2, // 设定规则的严重性级别：2 表示错误，1 表示警告，0 表示关闭该规则
      'always', // 始终要求使用该规则
      [
        // 允许的提交类型列表，只有这些类型会被认可
        'feat', // 新功能
        'fix', // 修复缺陷
        'perf', // 性能优化
        'style', // 样式修改（不影响逻辑）
        'docs', // 文档更改
        'test', // 测试相关修改
        'refactor', // 代码重构（不改变功能）
        'build', // 构建相关的修改
        'ci', // 持续集成相关的修改
        'chore', // 杂项任务（如更新依赖等）
        'revert', // 回滚先前的提交
        'wip', // 工作进行中，指尚未完成的工作
        'workflow', // 工作流相关的修改
        'types', // 类型定义的修改（例如 TypeScript 类型）
        'release' // 发布相关的修改
      ]
    ]
  }
};

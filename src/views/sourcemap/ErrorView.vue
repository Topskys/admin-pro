<template>
  <div>
    <h1>Throw Error</h1>
    <el-button @click="triggerTypeError()">触发TypeError</el-button>
    <el-button @click="triggerReferenceError">触发ReferenceError</el-button>
    <el-button @click="triggerSyntaxError">触发SyntaxError</el-button>
  </div>
</template>
<script setup lang="ts">
const triggerTypeError = () => {
  throw new TypeError('This is a type error');
};

const triggerReferenceError = () => {
  throw new ReferenceError('This is a reference error');
};

const triggerSyntaxError = () => {
  throw new SyntaxError('This is a syntax error');
};
</script>

<template>
  <div>
    <h1>Error</h1>
    <button @click="triggerTypeError()">触发TypeError</button>
    <button @click="triggerReferenceError">触发ReferenceError</button>
    <button @click="triggerSyntaxError">触发SyntaxError</button>
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

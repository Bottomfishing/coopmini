<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content-container {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  min-width: 1200px;
  display: inline-block;
  width: 90%;
}

.input-tip {
  width: 100px;
  margin: 0 10px;
  line-height: 40px;
}

.input-field {
  width: 200px;
  margin-right: 40px;
}

.content-row {
  margin-bottom: 20px;
}
</style>

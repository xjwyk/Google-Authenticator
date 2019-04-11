<template>
  <div class="home">
    <Header></Header>
    <p>This is the home page.</p>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '../components/common/Header';

export default {
  name: 'home',
  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
body {
  min-width: 1000px;
}
</style>


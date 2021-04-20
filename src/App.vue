<template>
  <div id="app">
    <BarraMenu></BarraMenu>
    <router-view></router-view>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import BarraMenu from './base/components/BarraMenu.vue';

@Options({
  components: {
    BarraMenu
  }
})
export default class App extends Vue {

}
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
</style>

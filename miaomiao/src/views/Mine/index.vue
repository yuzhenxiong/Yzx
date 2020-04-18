<template>
  <div id="main">
    <Head title="登录喵喵"/>
    <div id="content">
      <Login/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Head from "@/components/head";
import Footer from "@/components/TabBar";
import Login from "@/components/Login";
export default {
    name:"mine",
  components: {
    Head,
    Footer,
    Login
  }
};
</script>
<style scoped>
</style>
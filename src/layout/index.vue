<template>
  <n-layout class="w-full h-full">
    <n-layout-header class="p-6 font-sans text-2xl text-center bg-gray-500">
     <div class="text-white">
       {{ $route.meta?.title }}
     </div>
    </n-layout-header>
    <n-layout-content>
      <AppMain/>
    </n-layout-content>
  </n-layout>
</template>
<script>
import AppMain from "@/layout/AppMain.vue";

export default {
  components: {AppMain}
}
</script>
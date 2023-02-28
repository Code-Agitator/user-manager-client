<script setup lang="ts">
import {dateZhCN, zhCN} from 'naive-ui'

</script>

<template>
  <n-config-provider class=" w-full h-full" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

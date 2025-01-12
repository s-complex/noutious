<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "../../../dist/index.d.ts"  
import Localify from "../../../dist/index"

const message = ref<Record<string, Post> | null>(null);

const initLocalify = async () => {
  const localify = new Localify(process.cwd(), {
    localDb: true,
    draft: true,
    excerpt: ''
  })
  await localify.init();
  message.value = localify.getPosts();
}

initLocalify();
</script>
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import Localify from "../../../dist/index"

const message = ref("")

const initLocalify = () => {
  const localify = new Localify(process.cwd())
  message.value = localify.returnMessage();
}

// const initLocalify = () => {
//   const localify = new Localify({
//     localDb: process.env == 'production'
//   })
// }

// const localify = useLocalify("/posts") // return object async
// localify.posts // map of posts
// localify.posts.map()
</script>
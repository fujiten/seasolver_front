<template>
  <div class="m-4">

    <div class="flex items-center">
      <img class="w-24 h-24 rounded-full mr-4" v-lazy="avatar" alt="Avatar">
      <div>
        <h2 class="text-lg font-bold">{{ name }}</h2>
        <p class="mt-2">Lv. {{ level }}</p>
      </div>
    </div>
    <div class="mt-2">
      <p>{{ description }}</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserDescription',
  props: {
    avatar: String,
    name: String,
    level: Number,
    description: String
  }
}
</script>

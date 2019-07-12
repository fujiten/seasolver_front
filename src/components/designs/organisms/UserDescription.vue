<template>
  <div>

    <div class="flex items-center">
      <img class="w-24 h-24 rounded-full mr-4" v-lazy="avatar">
      <div>
        <h2 class="text-lg font-bold">{{ name }}</h2>
        <p class="mt-2">Lv. {{ level }}</p>
        <div class="mt-2">
          <p>{{ description }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserDescription',
  props: {
    user: Object,
    avatar: String,
    name: String,
    level: Number,
    description: String
  }
}
</script>

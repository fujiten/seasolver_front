<template>
  <div class="absolute pin-t pin-r ">
    <div class="flex justify-end">
      <button @click="dropdown" class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-1 px-1 rounded-lg focus:outline-none"><span>…</span></button>
    </div>
    <transition-group name="list">
      <ul v-show="openDropdown"
          v-for="content in dropdownList"
          :key="content.id"
          class="flex flex-col border border-black inline-block">
        <li @click="content.method" class="p-4 bg-grey-lightest text-sm hover:bg-grey-light hover:text-grey-white text-grey-darkest border border-grey no-underline font-bold rounded">
          <font-awesome-icon class="mr-1" :icon="content.icon.name" :size="content.icon.size" />
          {{ content.label }}
        </li>
      </ul>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    dropdownList: Array
  },
  data () {
    return {
      openDropdown: false
    }
  },
  methods: {
    dropdown () {
      this.openDropdown = !this.openDropdown
    }
  }
}
</script>

<style scoped>

.list-enter-active, .list-leave-active {
  transform: translate(0px, 0px);
  transition: transform 5ms cubic-bezier(0, 0, 0.2, 1) 0ms,
              opacity 0.2s;
  position: relative;
}

.list-enter, .list-leave-to {
  transform: translateX(0vw) translateX(0px);
  opacity: 0;
}

</style>

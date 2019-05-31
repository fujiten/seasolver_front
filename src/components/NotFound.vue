<template>
  <div class="ml-20 mt-10 text-grey-darkest">
    {{ $data }}
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      text: 'This page is not found!',
      localStorage: localStorage.signedIn,
      store: this.$store.state
    }
  }
}
</script>

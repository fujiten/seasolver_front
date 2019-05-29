<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h3 class="font-mono font-regular text-3xl mb-4">All Users</h3>
    <div v-if='loading'>
      Loading...
    </div>
    <div v-else>
      <ul class="list-reset mt-4">
        <li class="py-4" v-for="user in users" :key="user.id">

          <div class="flex items-center justify-between flex-wrap">
            <div class="flex-1 flex justify-between flex-wrap pr-4">
              <p class="block font-mono font-semibold flex items-center">
                <svg class="fill-current text-indigo w-6 h-6 mr-2" viewBox="0 0 24 24" width="24" height="24"><title>user vinyl</title><path d="M23.938 10.773a11.915 11.915 0 0 0-2.333-5.944 12.118 12.118 0 0 0-1.12-1.314A11.962 11.962 0 0 0 12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12c0-.414-.021-.823-.062-1.227zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" ></path></svg>
                {{ user.id }} &mdash; {{ user.name }}
                {{ user.email }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      users: [],
      error: '',
      loading: true
    }
  },
  created () {
    this.$http.secured.get('/')
      .then(response => { this.users = response.data })
      .catch(error => this.setError(error, 'Something went wrong'))
      .finally(() => { this.loading = false })
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    }
  }
}
</script>

<template>
  <ul>
    <transition-group name="fade">
    <li class="w-auto overflow-hidden list" v-for="query in queries" :key="query.id">
      <div v-if="isMoreCurrentPointThanRevealedPoint(query.revealed_point)" class="flex items-center justify-between flex-wrap py-2 hover:bg-grey-lighter">

        <div class="border border-black rounded w-full mx-3 p-3">

          <div class="flex justify-between items-center">
            <font-awesome-icon v-tooltip="'質問は慎重に…'" v-show="isRemained" icon="comment" size="lg" class="mr-2" />
            <font-awesome-icon v-tooltip="'手に入れた回答'" v-show="isDone" icon="sticky-note" size="lg" class="mr-2" />
            <div>
              <p class="inline-block mr-4">
                <font-awesome-icon v-tooltip="'出現ポイント'" icon="eye" size="lg" class="mr-1" />
                {{ query.revealed_point }} pt
              </p>
              <p v-if="isDone" class="inline-block font-bold">
                <font-awesome-icon v-tooltip="'獲得ポイント'" icon="fist-raised" size="lg" class="mr-1" />
                {{ query.point }} pt
              </p>
            </div>
          </div>
            <p class="mt-3">
              <span class="font-bold">Q. </span>{{ query.body }} というわけでした？
            </p>

          <p v-if="isDone" class="my-5">
            <span class="font-bold">A. </span>{{ query.answer }}
          </p>
          <div v-if="isRemained" class="flex justify-end">

            <button v-if="isRemained" @click="openShowModal(query)" class="border border-black mt-4 p-2 rounded bg-indigo text-white hover:bg-indigo-darker">
              <font-awesome-icon v-show="isRemained" icon="lock" class="mr-1" />
              質問する
            </button>
          </div>
          <QueryModal v-if="query.id === currentModalId"
            @close="closeShowModal(query)"
            v-bind:query="query" />
        </div>

      </div>
    </li>
    </transition-group>
  </ul>
</template>

<script>
import QueryModal from '@/components/designs/organisms/QueryModal.vue'
export default {
  props: {
    id: Number,
    currentPoint: Number,
    queries: Array,
    doQuery: Function
  },
  components: { QueryModal },
  data () {
    return {
      currentModalId: 0,
      showModal: false
    }
  },
  computed: {
    isRemained () {
      return this.id === 1
    },
    isDone () {
      return this.id === 2
    }
  },
  methods: {
    isMoreCurrentPointThanRevealedPoint (queryRevealedPoint) {
      if (this.currentPoint >= queryRevealedPoint) {
        return true
      } else {
        return false
      }
    },
    openShowModal (query) {
      this.currentModalId = query.id
    },
    closeShowModal (query) {
      this.currentModalId = 0
      this.doQuery(query)
    }
  }
}
</script>

<style scoped>

.fade-enter, .fade-leave-to {
  /* transform: translateX(100px); */
  opacity: 0;
  transform: translateX(100px);
  background-color: rgb(206, 206, 206);
  max-width: 40rem;
  min-width: 40rem;
}
.fade-leave-active {
  position: absolute;
  opacity: 0;
}

.fade-enter-active, .fade-leave-active, .fade-move {
  transition: all 1s;
}

</style>

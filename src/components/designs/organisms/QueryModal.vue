<template>
  <transition name="modal">
    <div  @click="$emit('close', query)" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="inline-black bg-indigo">
            <font-awesome-icon icon="unlock-alt" size="2x" class="text-white py-1" />
          </div>

          <div class="p-5">
            <div class="mt-2">
              Q. {{ query.body }}
            </div>
            <div class="text-lg font-bold mt-3">
              A. {{ query.answer }}
            </div>
            <div class="mt-4">
              ( この質問で <span class="font-bold">{{ query.point }}pt </span>獲得しました。)
            </div>
            <div class="flex justify-end mt-4">
              <button class="text-white bg-black py-1 px-2 rounded">✗</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    query: Object
  }
}
</script>

<style scoped>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(72, 72, 72, 0.5);
  display: table;
  /* transition: all .5s ease */
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 500px;
  margin: 0px auto;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  /* transition: all .5s ease */
}

.modal-enter {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-leave-active {
  transition: all 1s;
}
.modal-enter-active {
  transition: all 1s;
}

.modal-container {
  transition: opacity 1s, transform 1s;
}

</style>

<template>
  <div class="autocomplete">
    <input
      class="form-control"
      type="text"
      :placeholder="placeholder"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @click="isOpen=true"
      @change="onChange;"
    />
    <img src="../assets/arrow.png" alt id="input_img" @click="onChange" />
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
      <li class="loading" v-if="isLoading">Loading results...</li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result);onChange();if(getData != 1){getData()
      }"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ result.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["items", "isAsync", "placeholder", "getData"],
  data() {
    return {
      isOpen: false,
      results: [],
      search: "",
      isLoading: false,
      arrowCounter: 0,
    };
  },

  methods: {
    onChange() {
      if (!this.items) return;
      console.log("emit", this.search);
      // Let's warn the parent that a change was made
      this.$emit("input_data", this.search);

      // Is the data given by an outside ajax request?
      if (this.isAsync) {
        this.isLoading = true;
      } else {
        // Let's  our flat array
        this.filterResults();
        this.isOpen = true;
      }
    },

    filterResults() {
      if (!this.items) return;
      // first uncapitalize all the things
      this.results = this.items.filter((item) => {
        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
    },
    setResult(result) {
      this.search = result.name;
      this.isOpen = false;
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter];
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
  },
  watch: {
    items: function (val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style lang="scss" scoped>
* {
  font-size: 13px;
  box-sizing: border-box;
}
// *::-webkit-scrollbar {
//   width: 5px;
//   background-color: rgb(225, 225, 225);
// }
.autocomplete {
  position: relative;
}

#input_img {
  position: absolute;
  bottom: 10px;
  left: 90%;
  width: 10px;
  z-index: 3;
}

.autocomplete-results {
  background: white;
  position: absolute;
  z-index: 2;
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  max-height: 200px;
  overflow: auto;
  width: 100%;
  overflow-y: scroll;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #007bff;
  color: white;
}
</style>
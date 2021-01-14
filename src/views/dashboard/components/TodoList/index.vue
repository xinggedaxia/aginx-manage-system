<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <el-input v-model="todo" class="new-todo" autocomplete="off" placeholder="在此输入代办事项" @keyup.enter.native="addTodo" />
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input
        id="toggle-all"
        :checked="allChecked"
        class="toggle-all"
        type="checkbox"
        @change="toggleAll({ done: !allChecked })"
      >
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>项待办
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key|keyFilter }}</a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}

export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1),
    keyFilter: key => {
      const textMap = {
        all: '所有',
        active: '激活中',
        completed: '已完成'
      }
      return textMap[key]
    }
  },
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      visibility: 'all',
      filters,
      todo: ''
    }
  },
  computed: {
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  methods: {
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo() {
      const text = this.todo
      const tempArray = [...this.todos]

      if (text.trim()) {
        tempArray.push({
          text,
          done: false
        })
        this.$emit('updateTodo', tempArray)
      }
      this.todo = ''
    },
    toggleTodo(todoItem) {
      const tempArray = [...this.todos]

      tempArray.find((item) => {
        return item.text === todoItem.text
      }).done = !todoItem.done
      this.$emit('updateTodo', tempArray)
    },
    deleteTodo(todo) {
      const tempArray = [...this.todos]

      tempArray.splice(tempArray.indexOf(todo), 1)
      this.$emit('updateTodo', tempArray)
    },
    editTodo({ todo, value }) {
      const tempArray = [...this.todos]

      tempArray[tempArray.indexOf(todo)].text = value
      this.$emit('updateTodo', tempArray)
    },
    toggleAll({ done }) {
      this.$emit('updateTodo', this.todos.map(todo => {
        return {
          ...todo,
          done
        }
      }))
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

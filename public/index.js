// const e = require("express");

const app = {
  data () {
    return {
      title: '',
      priorities: ['None', 'Low', 'Medium', 'High'],
      showDone: false,
      tasks: [],
      doneTasks: []
    }
  },

  mounted () {
    fetch('http://localhost:5000/todos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        this.doneTasks = data.reverse().filter(task => task.done)
        this.tasks = data.filter(task => !task.done)
      })
  },

  methods: {
    addTask () {
      taskObject = {
        id: Date.now(),
        title: '',
        notes: '',
        duedate: '',
        priority: '',
        showhide: false,
        done: false,
        bordercolor: ''
      }

      if (this.title.trim()) {
        taskObject.title = this.title
        this.tasks.push(taskObject)

        fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskObject)
        })
          .then(res => res.json())
          .then(data => console.log(data))
        this.title = ''
      }
    },

    showHideDetails (index, event) {
      this.tasks[index].showhide = !this.tasks[index].showhide
    },

    checkbox (index, event, id) {
      this.tasks[index].done = !this.tasks[index].done
      updateDB(id, 'done', this.tasks[index].done)
      if (this.tasks[index].done) {
        this.doneTasks.push(this.tasks[index])
        if (!this.showDone) this.tasks.splice(index, 1)
      } else {
        this.doneTasks = this.doneTasks.filter(task => task.id !== id)
      }
      const reqChildren = event.target.parentNode.children

      if (!this.showDone) {
        if (reqChildren.title.style.textDecoration === '')
          reqChildren.checkbox.checked = false
      }
      // if (reqChildren.innerContent.style.display === "none")
      //   reqChildren.details.innerText = "\u25BC";
    },

    updateTitle (index, event, id) {
      this.tasks[index].title = event.target.value
      updateDB(id, 'title', event.target.value)
    },

    updateNotes (index, event, id) {
      this.tasks[index].notes = event.target.value
      updateDB(id, 'notes', event.target.value)
    },

    updateDate (index, event, id) {
      this.tasks[index].duedate = event.target.value
      updateDB(id, 'duedate', event.target.value)
    },

    updatePriority (index, event, id) {
      this.tasks[index].priority = event.target.value
      updateDB(id, 'priority', event.target.value)
    },

    priorityBorder (index, taskPriority, id) {
      borderType = 'solid 5px '
      borderColorMapping = {
        None: 'white',
        Low: 'blue',
        Medium: 'orange',
        High: 'rgb(210, 0, 50)'
      }
      this.tasks[index].bordercolor =
        borderType + borderColorMapping[taskPriority]
      updateDB(id, 'bordercolor', borderType + borderColorMapping[taskPriority])
    },

    showHideDoneTasks (showDone, event) {
      if (!showDone) {
        this.doneTasks.forEach(task => {
          task.showhide = false
        })
        this.tasks = this.tasks.concat(this.doneTasks)
        event.target.value = '\u{1F50D} Hide Done Tasks'
      } else {
        this.tasks = this.tasks.filter(task => !task.done)
        event.target.value = '\u{1F50D} Show Done Tasks'
        console.log(this.tasks)
      }
      this.showDone = !this.showDone
    },

    deleteTask (index, event, id) {
      this.tasks.splice(index, 1)
      if (!this.showDone)
        this.doneTasks = this.doneTasks.filter(task => task.id !== id)
      deleteFromDB(id)
      reqNode = event.target.parentNode.parentNode
      setTimeout(() => {
        if (reqNode.style.display === 'none')
          reqNode.parentNode.children.details.innerText = '\u25BC'
      }, 10)
    },

    clearDoneTasks () {
      this.tasks = this.tasks.filter(task => !task.done)
      this.doneTasks.forEach(task => deleteFromDB(task.id))
      this.doneTasks = []
    },

    clearAllTasks () {
      this.tasks = []
      this.doneTasks = []
      this.title = ''
      deleteFromDB('')
    }
  }
}

Vue.createApp(app).mount('#app')

updateDB = (id, element, value) => {
  let jsonObject = {}
  jsonObject[element] = value
  fetch(`http://localhost:5000/todos/${element}/${id}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(jsonObject)
  })
    .then(res => res.json())
    .then(data => console.log(data))
}

deleteFromDB = id => {
  fetch(`http://localhost:5000/todos/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => console.log(data))
}

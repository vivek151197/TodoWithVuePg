const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const { Router } = require('express')
const port = 5000

//middleware
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

//ROUTES//
//get all todos
app.get('/todos/', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo ORDER BY id DESC')
    res.json(allTodos.rows)
  } catch (err) {
    console.error(err.message)
  }
})
//get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id])
    res.json(todo.rows[0])
  } catch (error) {
    console.error(err.message)
  }
})
//create todo
app.post('/todos', async (req, res) => {
  try {
    const {
      id,
      title,
      notes,
      duedate,
      priority,
      showhide,
      done,
      bordercolor
    } = req.body
    const newTodo = await pool.query(
      'INSERT INTO todo (id, title, notes, duedate, priority, showhide, done, bordercolor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, title, notes, duedate, priority, showhide, done, bordercolor]
    )
    res.json(req.body)
  } catch (err) {
    console.error(err.message)
  }
})
//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteTodo = await pool.query('DELETE FROM todo WHERE id = $1', [id])
    res.json('Todo was successfully deleted')
  } catch (err) {
    console.error(err.message)
  }
})
//delete all todos
app.delete('/todos', async (req, res) => {
  try {
    const deleteTodo = await pool.query('DELETE FROM todo')
    res.json('All todos got deleted')
  } catch (err) {
    console.error(err.message)
  }
})
//update todo
function updateData (element) {
  app.put(`/todos/${element}/:id`, async (req, res) => {
    try {
      const { id } = req.params
      const key = req.body[element]
      const updateTodo = await pool.query(
        `UPDATE todo SET ${element} = $1 WHERE id = $2`,
        [key, id]
      )
      res.json(`Todo ${element} was updated`)
    } catch (err) {
      console.error(err.message)
    }
  })
}

//update title
updateData('title')
//update notes
updateData('notes')
//update duedate
updateData('duedate')
//update priority
updateData('priority')
//update done
updateData('done')
//update bordercolor
updateData('bordercolor')

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

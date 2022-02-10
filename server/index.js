require('dotenv').config()
const express = require('express')
const app = express()

const path = require('path')

const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.use(express.json());

const students = ['jimmy', 'sam', 'ben', 'peter']

app.get('/', (req, res) => {
    console.log('hit')
    rollbar.log('Someone hit the server!')

    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('Someone got all the students!')
    
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
    const { name } = req.body
    
    students.unshift(name)

    res.status(200).send(students)
})

app.delete('/api/students/:idx', (req, res) => {

    if (req.params.idx === '0') {
        rollbar.error('Someone tried to delete the first student!')
        return res.status(403).send(students)
    }

    rollbar.info(`Someone deleted student${students[+req.params.idx]}`)

    students.splice(+req.params.idx, 1)

    res.status(200).send(students)
})

const port = process.env.PORT || process.env.SERVER_PORT

app.listen(port, () => console.log(`Server serving on ${port}`))
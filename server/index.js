import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { dirname, join } from 'path'

import { PORT } from './config.js'
import { fileURLToPath } from 'url'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.static(join(__dirname, '../client/build')))
console.log(join(__dirname, '../client/build'))

io.on('connect', (socket) => {
    console.log(socket.id, 'connected')

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', {
            body: data,
            from: socket.id
        })
    })
})

server.listen(PORT)
console.log('Server started in port', PORT)


const express = require('express')
const app = express()
const http = require('http').createServer(app)
const { v4: uuidv4 } = require('uuid')
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(http, {
    debug: true
})
const Authroute=require('./routes/auth')
const mongoose = require('mongoose')
const io = require('socket.io')(http)
mongoose.connect('mongodb://localhost:27017/login',{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on('error',(err)=>{
    console.log(err)
}
)
db.once('open',()=>{
    console.log('Data Base Connection Established')
}
)
// add cors 
var cors = require('cors');
app.use(cors({
  origin:'http://localhost:4200'
}));
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

app.use('/api/auth',Authroute)
app.use('/users',Authroute)   
app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("new connextion");
        socket.join(roomId) //join same socket session(ie. room)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('message', message => {
            io.to(roomId).emit('create-message', message)
          
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId) })
    })
})
http.listen(process.env.PORT || 443, () => {
    console.log('Listening on port 443')
})

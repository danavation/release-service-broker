const net = require('net')
const Msg = require('./protos/msg_pb.js').Msg
const Task = require('./protos/esl_pb.js').Task

// update token
//                   7    12                               -- label id
//                                     25   30             -- label id
//                                                 37 40   -- token
let sample = "@0001B60289FE0000111001A40289FE330700D4B000ED0000FC00000000006700D7000000A900C233F00122F001A8F00122F001A8F00122F001A8F00122F001A8F00122F001A64A81FC8E074D01A54A87FE8E81EFFE01A44A8F478783CFFE01A6F08F83E1E1E1E001A7F08C81E0F3C1E001A7F08F4983DC8701ACF09F4981F88701ACF09F4907F88701ACF09C10F88701ACF09C0FFC83C001A6F09E0EF781E001A7F08E0EF3C1E001A7F8CFC0E1E1E1F101A8478F488E8783FC01A64787489C83C3FC01A8FC87F8B883C1F8001212FC80000000806700D70000000300E856"
let token_num = Math.round(Math.random() * (65535 - 0) + 0)
let token = token_num.toString(16).toUpperCase()
sample = sample.replace('D4B0', token)

// update id
// let id = '0289AB'
let id = '02869D'
sample = sample.split('0289FE').join(id)

// construction
// let id_base = "192.168.1.200-0002-05"
let consumer = "192.168.1.200-0001-01"
let task = new Task()
let task_bytes = Buffer.from(sample, 'ascii')
console.log('token', token, 'id', id, 'length', task_bytes.length, 'task', task_bytes)
task.setConsumer(consumer)
task.setData(task_bytes)
console.log('task', task)

// build data
let msg = new Msg()
msg.setVer(0)
msg.setCode(5)
msg.setData(task.serializeBinary())
let bytes = msg.serializeBinary()

// send data
let port = 1234
let socket = new net.Socket()
socket.connect(port, '192.168.1.92', ()=>{
	socket.on('data', (data)=>{
		console.log('one data', data)
	})
	socket.write(bytes)
})
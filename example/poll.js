const net = require('net')
const Msg = require('./protos/msg_pb.js').Msg
const StatusReq = require('./protos/esl_pb.js').StatusReq
const Status = require('./protos/esl_pb.js').Status

let token = 'D93A'

// construction
let req = new StatusReq()
req.setToken(token)

// build data
let msg = new Msg()
msg.setVer(0)
msg.setCode(7)
msg.setData(req.serializeBinary())
let bytes = msg.serializeBinary()

// send data
let port = 1235
let socket = new net.Socket()
socket.connect(port, '192.168.1.92', ()=>{
	socket.on('data', (data)=>{
		let status = Status.deserializeBinary(data)
		console.log('status.token', status.getToken())
		console.log('status.label', status.getLabel())
		console.log('status.signal', status.getSignal())
		console.log('status.power', status.getPower())
		console.log('status.tempreture', status.getTempreture())
	})
	socket.write(bytes)
})
const net = require('net')
const nacl = require('tweetnacl')
const Msg = require('./protos/msg_pb.js').Msg
const StatusReq = require('./protos/esl_pb.js').StatusReq
const Status = require('./protos/esl_pb.js').Status

const secret = Uint8Array.from(Buffer.from('425172b35dcca86adb460d15d4ef364f9d0a9bab75b300de63f7208d942c92746abf13e9f8c80e325e62a895bf5926542362579472f3a99c5a748ae899d9df59', 'hex'))
// const secret = Uint8Array.from(Buffer.from('d598df95b6a3c57675f2c72ff3bfc7c860e6f71981c214acb492a576c99ef60e552640401f3ab101f4bd93a52386008c4d88f94ba1acbbf54838f82f0c1c2706', 'hex'))
let keypair = nacl.sign.keyPair.fromSecretKey(secret)

const VER = 0, CODE = 7

/* construct query */
let token = 'B5E2'
let req = new StatusReq()
req.setToken(token)
let msg = new Msg()
let data = req.serializeBinary()
msg.setVer(VER)
msg.setCode(CODE)
msg.setData(data)
msg.setPublic(keypair.publicKey)
msg.setSignature(nacl.sign.detached(data, keypair.secretKey))

/* send */
let ip = '3.140.176.47'
// let ip = '3.128.33.4'
// let ip = '192.168.1.92'
let port = 1234
let socket = new net.Socket()
socket.connect(port, ip, _=>{
	socket.on('data', (data)=>{
		let status = Status.deserializeBinary(data)
		console.log('status.token', status.getToken())
		console.log('status.label', status.getLabel())
		console.log('status.signal', status.getSignal())
		console.log('status.power', status.getPower())
		console.log('status.tempreture', status.getTempreture())
	})
	socket.write(msg.serializeBinary())
	setTimeout(_=>socket.destroy(), 1000 * 30)
})
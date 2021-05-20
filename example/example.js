const net = require('net')
const nacl = require('tweetnacl')
const Msg = require('./protos/msg_pb.js').Msg
const Task = require('./protos/esl_pb.js').Task
const Base = require('./protos/esl_pb.js').Base
const Label = require('./protos/esl_pb.js').Label

const labels = ['03CB43']

// const label = '02869D'
const consumer = "0001-00"
// const consumer = '192.168.1.200-0002-05'
const secret = '425172b35dcca86adb460d15d4ef364f9d0a9bab75b300de63f7208d942c92746abf13e9f8c80e325e62a895bf5926542362579472f3a99c5a748ae899d9df59'
// const secret = 'd598df95b6a3c57675f2c72ff3bfc7c860e6f71981c214acb492a576c99ef60e552640401f3ab101f4bd93a52386008c4d88f94ba1acbbf54838f82f0c1c2706'
const keypair = nacl.sign.keyPair.fromSecretKey(Uint8Array.from(Buffer.from(secret, 'hex')))
// const ip = '3.128.33.4', port = 1234
// const ip = '18.191.236.46', port = 1234
const ip = '192.168.1.92', port = 1234

const build = (index) => {
	let label = labels[Math.round(Math.random() * (labels.length - 1) + 0)]
	//let token = 'FFFF'
	let token = Math.round(Math.random() * (65535 - 0) + 0).toString(16).toUpperCase()
	let sample = `@0001B6${label}0000111001A4${label}330700${token}00ED0000FC00000000006700D7000000A900C233F00122F001A8F00122F001A8F00122F001A8F00122F001A8F00122F001A64A81FC8E074D01A54A87FE8E81EFFE01A44A8F478783CFFE01A6F08F83E1E1E1E001A7F08C81E0F3C1E001A7F08F4983DC8701ACF09F4981F88701ACF09F4907F88701ACF09C10F88701ACF09C0FFC83C001A6F09E0EF781E001A7F08E0EF3C1E001A7F8CFC0E1E1E1F101A8478F488E8783FC01A64787489C83C3FC01A8FC87F8B883C1F8001212FC80000000806700D70000000300E856`
	let task = new Task()
	let task_bytes = Buffer.from(sample, 'ascii')
	console.log(`${index} task token=${token} label=${label} data-len=${task_bytes.length}`)
	task.setConsumer(consumer)
	task.setData(task_bytes)
	let msg = new Msg()
	let data = task.serializeBinary()
	let signature = nacl.sign.detached(data, keypair.secretKey)
	msg.setVer(0)
	msg.setCode(7)
	msg.setData(data)
	msg.setPublic(keypair.publicKey)
	msg.setSignature(signature)
	return msg.serializeBinary()
}

const call = (socket, i, max) => {
	if (i >= max) return
	else {
		setTimeout(_=>{
			socket.write(build(i))
			call(socket, i + 1, max)
		}, 10)
	}
}

/* connect */
const socket = new net.Socket()
socket.connect(port, ip, _=>{
	console.log(`connect ${ip}:${port}`)
	socket.on('data', (data)=>{
		let msg = Msg.deserializeBinary(data)
		switch(msg.getCode()) {
			case 6:
				let base = Base.deserializeBinary(msg.getData())
				console.log(`base id=${base.getId()} connect=${base.getConnect()}`)
			break;
			case 8: 
				let label = Label.deserializeBinary(msg.getData())
				console.log(`label token=${label.getToken()} id=${label.getId()} signal=${label.getSignal()} power=${label.getPower()} tempreture=${label.getTempreture()}`)
			break;
			default:
				console.log(`unknown codec=${msg.getCode()}`)
			break;
		}
	})

	// call(socket, 0, 200000000)
	call(socket, 0, 1)
})
const nacl = require('tweetnacl')
let keypair = nacl.sign.keyPair()
console.log('pk=' + Buffer.from(keypair.publicKey).toString('hex'))
console.log('sk=' + Buffer.from(keypair.secretKey).toString('hex'))
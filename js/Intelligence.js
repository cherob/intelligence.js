const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine();

net.addCluser(Functions.volume.CIRCULAR(10), Functions.connection.CLOSE, 100, 0.001)

console.log(net.neurons)
engine.draw(net.neurons)
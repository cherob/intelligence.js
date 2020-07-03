const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine(Functions.activation.SIGMOID);
// window.requestAnimationFrame(engine.render);

net.addCluser(Functions.volume.CIRCULAR(10), 150)
net.addCluser(Functions.volume.CIRCULAR(20), 100)
net.addCluser(Functions.volume.CIRCULAR(30), 50)

net.connectNeurons(Functions.connector.CLOSE(6))

engine.build(net, true)
// net.wakeup(engine)


// for (;;) {
// }
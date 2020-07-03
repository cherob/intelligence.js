const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine();
// window.requestAnimationFrame(engine.render);


net.addCluser(Functions.volume.CIRCULAR(8), 300)
net.addCluser(Functions.volume.CIRCULAR(5), 100)
net.addCluser(Functions.volume.CIRCULAR(2), 20)
net.connectNeurons(Functions.connector.CLOSE(2.2))
engine.connect(net)
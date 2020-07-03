const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine(Functions.activation.SIGMOID);
// window.requestAnimationFrame(engine.render);

net.addCluser(Functions.volume.CIRCULAR(12), 1100)
net.connectNeurons(Functions.connector.CLOSE(8))

engine.build(net, true)

// setInterval(() => {
//     engine.render();
// }, 1000/144);

net.wakeup(engine)



// just in case
// for (;;) {
// }
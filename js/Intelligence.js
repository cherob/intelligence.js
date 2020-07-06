const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine(144);

net.addCluser(Functions.volume.CIRCULAR(5), 25)
net.addCluser(Functions.volume.CIRCULAR(10), 50)
net.addCluser(Functions.volume.CIRCULAR(20), 100)
net.connectNeurons(Functions.connector.CLOSE(12))

engine.build(net, false)
engine.start()

net.wakeup(engine, 144)

document.body.onmouseup = function () {
    if (engine.selectedNeuron && !engine.selectedNeuron.last)
        net.impulses.push({
            target: engine.selectedNeuron,
            uuid: '',
            value: 1
        });
};

// just in case
// for (;;) {
// }
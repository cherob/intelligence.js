const Network = require('./network/Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine(net, 144, 8);

// net.addBoundingNeurons(4)
net.addCluser(Functions.volume.CIRCULAR(4), 150)
net.connectNeurons(4)

engine.build()
engine.start()

document.body.onmousemove = async function () {
    engine.update(net);
}

document.body.onmouseup = async function () {
    engine.update(net);
    if (engine.selectedNeuron) {
        let neuron = net.neurons[net.getNeuronIndexByUUID(engine.selectedNeuron.uuid)];
        console.log(neuron)
        let impulse = Math.random() / 10;
        neuron.impulse(impulse, net, engine);
    }
};

const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')
const Pong = require('./Pong');
const dat = require('dat.gui');
const gui = new dat.GUI();


// let pong = new Pong();

const net = new Network();
const engine = new Engine(30);

let neuron_left = net.addNeuron({ x: 7, y: 0, z: 0 });
let neuron_right = net.addNeuron({ x: -7, y: 0, z: 0 });
net.addCluser(Functions.volume.CIRCULAR(5), 500)

// pong.paddle1.position.x += 10
gui.add({
    impulseRight: () => {
        net.impulses.push({
            target: neuron_right,
            uuid: '',
            value: 0.5
        });
    },

}, 'impulseRight')

// setInterval(() => neuron_left.value == 0 ? false  : console.log(neuron_left.value), 1)


net.connectNeurons(Functions.connector.DIRECTIONAL(6))

engine.build(net, false)
engine.start()


net.wakeup(engine, false)

document.body.onmouseup = function (ev) {
    if (ev.button == 0 && engine.selectedNeuron && !engine.selectedNeuron.last)
        net.impulses.push({
            target: engine.selectedNeuron,
            uuid: '',
            value: 1
        });
};

// just in case
// for (;;) {
// }
const Network = require('./Network')
const Functions = require('./Functions')
const Engine = require('./Engine')

const net = new Network();
const engine = new Engine(Functions.activation.SIGMOID);
// window.requestAnimationFrame(engine.render);

net.addCluser(Functions.volume.CIRCULAR(8), 100)
net.connectNeurons(Functions.connector.CLOSE(10))

engine.build(net)
net.wakeup(engine)

document.body.onmouseup = function () {
    if( engine.selected)
    net.impulse(getIndexByUUID(net.neurons, engine.selected.object.name), 1)
};


function getIndexByUUID(arr, uuid) {
    let index = -1;
    arr.forEach((a, i) => {
        if (a.uuid == uuid) index = i;
    })
    return index
}

// just in case
// for (;;) {
// }
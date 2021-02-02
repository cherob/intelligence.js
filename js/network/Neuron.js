const uuid = require('uuid');

class Neuron {
    constructor(activator = (i) => { return i }) {
        const {
            defaults
        } = this.constructor;
        this.activator = activator;
        this.tolerance = activator(0);
        this.synapses_connectivity = 0.5 + Math.random() / 2;
        this.dendrites_connectivity = 0.5 + Math.random() / 2;
        this.uuid = uuid.v4(); // uuid

        this.position = {
            x: 0,
            y: 0,
            z: 0
        }

        this.synapses = []; // outgoing
        this.dendrites = []; // inputs
        this.value = 0;
    }

    async impulse(value, net, engine) {
        this.value += value;
        let i = 0
        i = this.activator(this.value);
        engine.update(net);
        if (i <= this.tolerance)
            return false

        this.synapses.forEach(async synapse => {
            let neuron = net.neurons[net.getNeuronIndexByUUID(synapse.to.uuid)];
            setTimeout(() => {
                neuron.impulse(i, net, engine);
            }, synapse.distance * 100)
        })
        this.value = 0;
    }

}
module.exports = Neuron;
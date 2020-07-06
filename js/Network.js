const Neuron = require('./Neuron');
const Functions = require('./Functions');
const Engine = require('./Engine');

const uuid = require('uuid');

class Network {
    constructor() {
        const {
            defaults
        } = this.constructor;
        this.neurons = []
        this.impulses = [];
    }

    addCluser(volume, amount) {
        let neurons = new Array(amount).fill(0);

        neurons = neurons.map((neuron) => {
            neuron = new Neuron(Functions.activation.SIGMOID);
            neuron.position = volume();
            return neuron
        });

        this.neurons = this.neurons.concat(...neurons);
    }

    connectNeurons(connector) {
        this.neurons.forEach((neuron) => {
            neuron.synapses = connector(neuron, this.neurons)
        });
    }

    /**
     * 
     * @param {Engine} engine 
     */
    wakeup(engine, ticks) {
        let inverval = 0;
        setInterval(() => {
            if (!this.impulses.length) {
                this.impulses = this.getImpulses()
            } else {
                this.sendImpulseValueToNeuron(this.impulses[0].value, this.impulses[0].target.uuid)
                this.impulses.shift();
                this.applyChange()
            }

            engine.update(this)
            inverval++;
        }, 1000 / ticks);
    }

    applyChange() {
        this.neurons.forEach(neuron => {
            if (neuron.value > neuron.activator(-0.5))
                neuron.value *= 0.2;

            if (neuron.tolerance < 0.5)
                neuron.tolerance += neuron.tolerance * (1 / this.neurons.length)
        })
    }

    /**
     * 
     * @param {Number} impulse_value index
     * @param {String} uuid signal 
     */
    sendImpulseValueToNeuron(impulse_value, uuid) {
        if (!uuid) return;
        this.neurons[this.getNeuronIndexByUUID(uuid)].synapses.forEach(synapse => {
            let index = this.getNeuronIndexByUUID(synapse.target.uuid);
            this.neurons[index].value += impulse_value * synapse.weight
        });
    }

    getImpulses() {
        var impulses = [];
        this.neurons.forEach((neuron, i) => {
            let value = this.neurons[i].getImpulseValue();
            if (!value) return;
            neuron.synapses.forEach(synapse => {
                impulses.push({
                    target: neuron,
                    uuid: uuid.v4(),
                    value: value * synapse.weight
                })
            })

        })

        return impulses
    }

    getNeuronIndexByUUID(uuid) {
        let index = -1;
        this.neurons.forEach((a, i) => {
            if (a.uuid == uuid) index = i;
        })
        return index
    }
}

module.exports = Network;
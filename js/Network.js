const Neuron = require('./Neuron');
const Function = require('./Functions');
const Functions = require('./Functions');
const {
    valHooks
} = require('jquery');
const {
    times
} = require('lodash');
const Engine = require('./Engine');

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
            neuron = new Neuron(Function.size.RANDOM, Functions.activation.SIGMOID);
            neuron.position = volume();
            return neuron
        });

        this.neurons = this.neurons.concat(...neurons);
    }

    connectNeurons(connector) {
        this.neurons.forEach((neuron) => {
            neuron.synapses = connector(neuron, this.neurons)
        });

        this.neurons.forEach((neuron) => {
            this.neurons.forEach(other_neuron => {
                if (neuron.synapses.map((b) => b.uuid) == other_neuron.uuid.indexOf())
                    neuron.dendrites.push({
                        position: other_neuron.position,
                        uuid: other_neuron.uuid
                    })
            });
        });
    }

    /**
     * 
     * @param {Engine} engine 
     */
    wakeup(engine) {
        let inverval = 0;
        // console.log(this.impulses)
        setInterval(() => {
            if ((inverval % 10) == 0) {

                if (!this.impulses.length) {
                    let new_impulses = this.listActivations(Function.activation.SIGMOID)
                    // console.log(this.impulses.length)
                    this.impulses = this.impulses.concat(...new_impulses);
                } else {
                    let index_to = getIndexByUUID(this.neurons, this.impulses[0].uuid);
                    this.impulse(index_to, this.impulses[0].value)
                    this.impulses.shift();
                    if ((inverval % 1) == 0) {
                        this.neurons.forEach(
                            neuron => {
                                if (neuron.value > 0.5)
                                    neuron.value -= neuron.value * 0.9;
                                if (neuron.tolerance < 0.5)
                                    neuron.tolerance += (0.5 - neuron.tolerance) * 0.9
                            })
                    }
                }

            }

            engine.update(this)
            inverval++;
        }, 1000 / 144);
    }

    /**
     * 
     * @param {Number} i index
     * @param {Number} value signal 
     */
    impulse(i, value) {
        this.neurons[i].synapses.forEach(synapse => {
            let index = getIndexByUUID(this.neurons, synapse.uuid);
            this.neurons[index].value += value * synapse.weight
        });
    }

    listActivations() {
        var tasks = [];
        this.neurons.forEach((neuron, i) => {
            let value = this.neurons[i].impulse();
            if (!value) return;
            neuron.synapses.forEach(synapse => {
                tasks.push({
                    from: neuron.uuid,
                    uuid: synapse.uuid,
                    value: value * synapse.weight
                })
            })

        })
        return tasks
    }
}

function getIndexByUUID(arr, uuid) {
    let index = -1;
    arr.forEach((a, i) => {
        if (a.uuid == uuid) index = i;
    })
    return index
}

module.exports = Network;
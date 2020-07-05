const Neuron = require('./Neuron');
const Function = require('./Functions');
const Functions = require('./Functions');
const {
    valHooks
} = require('jquery');
const {
    times
} = require('lodash');

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
            this.neurons.forEach(other_neuron => {
                if (connector(neuron, other_neuron))
                    neuron.synapses.push(other_neuron)
            });
            neuron.synapses = neuron.synapses.map(other_neuron => {
                other_neuron.weight = Math.random();
                // need way here for no recurrent
                // other_neuron.synapses = [];
                // other_neuron.dendrites = [];
                return other_neuron
            })
        });

        this.neurons.forEach((neuron) => {
            this.neurons.forEach(other_neuron => {
                if (neuron.synapses.map((b) => b.id) == other_neuron.id.indexOf())
                    neuron.dendrites.push(other_neuron)
            });

            neuron.dendrites = neuron.dendrites.map(other_neuron => {
                // need way here for no recurrent
                // other_neuron.synapses = [];
                // other_neuron.dendrites = [];
                return other_neuron
            })
        });
    }

    wakeup(engine) {
        this.impulse(Math.round(Math.random() * this.neurons.length), 1)
        let inverval = 0;
        setInterval(() => {
            // add this per function
            // if ((inverval % 1) == 0) {
            //     this.impulse(Math.round(Math.random() * this.neurons.length), Math.random())
            // }


            if ((inverval % 10) == 0) {
                if ((inverval % 1) == 0) {
                    this.neurons.forEach(neuron => {
                        // degrece
                        neuron.value *= 0.7
                    })
                }

                if (!this.impulses.length) {
                    let new_impulses = this.listActivations(Function.activation.SIGMOID)
                    this.impulses = this.impulses.concat(...new_impulses);
                } else {
                    let index_to = getIndexByID(this.neurons, this.impulses[0].id);
                    // let index_from = getIndexByID(this.neurons, this.impulses[0].from);
                    this.impulse(index_to, this.impulses[0].value)
                    this.impulses.shift();
                }
            }

            engine.update(this)
            engine.render();
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
            let index = getIndexByID(this.neurons, synapse.id);
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
                    from: neuron.id,
                    id: synapse.id,
                    value: value * synapse.weight
                })
            })

        })
        return tasks
    }
}

function getIndexByID(arr, b) {
    let index = -1;
    arr.forEach((a, i) => {
        if (a.id == b) index = i;
    })
    return index
}

module.exports = Network;
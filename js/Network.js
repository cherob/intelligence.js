const Neuron = require('./Neuron');

class Network {
    constructor() {
        const {
            defaults
        } = this.constructor;
        this.neurons
    }

    addCluser(volFunc, conFunc, amount) {
        let neurons = new Array(amount).fill(0);

        neurons = neurons.map((neuron) => {
            neuron = new Neuron(Math.random() * 2 - 1);
            neuron.position = volFunc();
            return neuron
        });

        // nicht selbst 
        // connector?
        neurons.forEach((neuron) => {
            neuron.synapses = neurons.filter(other_neuron => {
                return conFunc(neuron.position, other_neuron.position)
            });
            neuron.synapses = neuron.synapses.map(other_neuron => other_neuron.id);
            neuron.synapses.forEach(synapse => {
                var index = neurons.map(function (e) {
                    return e.id;
                }).indexOf(synapse);
                neurons[index].dendrites.push(neuron)
            })
        });

        neurons.forEach((neuron) => {
            neuron.dendrites = neuron.dendrites.map(other_neuron => other_neuron.id);
        });

        this.neurons = neurons;
    }
}

module.exports = Network;
const Neuron = require('./Neuron');

class Network {
    constructor() {
        const {
            defaults
        } = this.constructor;
        this.neurons = []
    }

    addCluser(volume, amount) {
        let neurons = new Array(amount).fill(0);

        neurons = neurons.map((neuron) => {
            neuron = new Neuron(Math.random() * 2 - 1);
            neuron.position = volume();
            return neuron
        });

        this.neurons = this.neurons.concat(...neurons);
    }

    connectNeurons(connector, clean = true){
        this.neurons.forEach((neuron) => {
            neuron.synapses = this.neurons.filter(other_neuron => connector(neuron, other_neuron));
            
            neuron.synapses = neuron.synapses.map(other_neuron => Object.assign({}, other_neuron, {synapses: undefined, dendrites: undefined}));
        });
        
        this.neurons.forEach((neuron) => {
            neuron.dendrites = this.neurons.filter((a) => {
                neuron.synapses.map((b) => b.id) == a.id.indexOf()
            })
            
            neuron.dendrites = neuron.synapses.map(other_neuron => Object.assign({}, other_neuron, {synapses: undefined, dendrites: undefined}));
        });

        if(clean)
            this.cleanup()
    }

    cleanup(){
        this.neurons = this.neurons.filter((neuron) => {
            if(neuron.synapses.length) return true
            if(neuron.dendrites.length) return true
        })
    }
}

module.exports = Network;
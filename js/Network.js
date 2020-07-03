const Neuron = require('./Neuron');
const Function = require('./Functions');
const Functions = require('./Functions');
const {
    valHooks
} = require('jquery');

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

    connectNeurons(connector, clean = true) {
        this.neurons.forEach((neuron) => {
            neuron.synapses = this.neurons.filter(other_neuron => connector(neuron, other_neuron));


            neuron.synapses = neuron.synapses.map(other_neuron => Object.assign({}, other_neuron, {
                weight: Math.random(),
                synapses: undefined,
                dendrites: undefined
            }));
        });
        this.neurons.forEach((neuron) => {
            neuron.dendrites = this.neurons.filter((a) => {
                neuron.synapses.map((b) => b.id) == a.id.indexOf()
            })

            neuron.dendrites = neuron.dendrites.map(other_neuron => Object.assign({}, other_neuron, {
                synapses: undefined,
                dendrites: undefined
            }));
        });

        // if (clean)
        //     this.cleanup()
    }

    cleanup() {
        // this.neurons = this.neurons.filter((neuron) => {
        //     if (neuron.synapses.length) return true
        //     if (neuron.dendrites.length) return true
        // })
    }

    wakeup(engine) {

        let inverval = 0;
        setInterval(() => {
            if ((inverval % 1) == 0){
                this.impulse(0, Math.random())
            }
            inverval++;
            engine.update(this)
            engine.render();
            if (!this.impulses.length) return;
            console.log(this.impulses.length)
            this.impulses = this.impulses.filter((call, i) => {
                let index = getIndexByID(this.neurons, call.id);
                this.impulse(index, call.value)
                return false;
            })
        }, 1000 / 27.5);
    }

    impulse(i, value) {
        this.neurons[i].synapses.forEach(synapse => {
            let index = getIndexByID(this.neurons, synapse.id);
            this.neurons[index].value += value
        });


        let new_impulses = this.listActivations(Function.activation.SIGMOID)
        this.impulses = this.impulses.concat(...new_impulses);

    }

    listActivations() {
        var tasks = [];
        this.neurons.forEach(neuron => {
            let value = neuron.impulse();
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
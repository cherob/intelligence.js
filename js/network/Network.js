const Neuron = require('./Neuron');
const Functions = require('../Functions');
const Connection = require('./Connection');

class Network {
    constructor() {
        this.neurons = []
        this.width;
    }

    addBoundingNeurons(range) {
        // let neuron_start = new Neuron(Functions.activation.SIGMOID);
        // neuron_start.position = { x: -range, y: 0, z: 0 };
        let neuron = new Neuron(Functions.activation.SIGMOID);
        neuron.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.neurons.push(neuron);
    }

    addCluser(volume, amount) {
        let neurons = new Array(amount).fill(0);
        neurons = neurons.map((neuron) => {
            neuron = new Neuron(Functions.activation.SIGMOID);
            neuron.position = volume();
            return neuron
        });
        this.neurons = this.neurons.concat(...neurons);

        this.width = this.getNetworkWidth();
    }

    /**
     * 
     * @param {Neuron} from 
     * @param {Neuron} to
     * @returns
     */
    isCompatibility(from, to) {
        // check if other neuron isnt itself
        if (from.uuid == to.uuid) return;

        // console.log(from.synapses.map((_) => _.to.uuid), to.uuid)
        // console.log(to.uuid.indexOf(to.synapses.map((_) => _.to.uuid)))
        // connection is exsisting
        if (this.isConnected(from, to)) return;


        // check if other neuron is in front of current neuron
        if (from.position.x > to.position.x) return;

        // check other neuron isnt 2 far away
        let distance = Functions.distance(from.position, to.position)
        if (distance > 3) return;

        return true;
    }

    connectNeurons() {
        let unconnected = this.neurons.map((_, i) => i);

        while (unconnected.length) {
            // random definition of neurons tryed to connect
            let will_connections = 10

            // random choosing neuron from unconnected neurons
            let ii = Math.floor(unconnected.length * Math.random());
            let ifrom = unconnected[ii]

            let temp_neurons = this.neurons.map((_, i) => i);
            temp_neurons = temp_neurons.filter((ito) =>
                this.isCompatibility(this.neurons[ifrom], this.neurons[ito])
            )

            if (temp_neurons.length == 0) {
                // console.error("no compatibility neurons found")
                // continue;
            }

            for (let i = 0; i < Math.min(temp_neurons.length, will_connections); i++) {
                // random choosing neuron from unconnected neurons
                let iii = Math.floor(temp_neurons.length * Math.random());
                let ito = temp_neurons[iii];

                let connection = new Connection(this.neurons[ifrom], this.neurons[ito]);

                this.neurons[ito].dendrites.push(connection);
                this.neurons[ifrom].synapses.push(connection);
            }

            if (this.neurons[ifrom].dendrites.length !== 0 || this.neurons[ifrom].position.x < (this.width / 2) * 0.1)
                if (this.neurons[ifrom].synapses.length !== 0 || this.neurons[ifrom].position.x > (this.width / 2) * 0.1)
                    unconnected = unconnected.filter((x) => x !== ifrom)

        }


    }

    /**
     * 
     * @param {Neuron} from
     * @param {Neuron} to
     */
    isConnected(from, to) {
        return from.dendrites.some(connection => to.synapses.includes(connection)) || from.synapses.some(connection => to.dendrites.includes(connection));
    }

    getNetworkWidth() {
        let leftMostNeuron, rightMostNeuron;

        for (let i = 0; i < this.neurons.length; i++) {
            let neuron = this.neurons[i];

            if (!leftMostNeuron) {
                leftMostNeuron = neuron;
                continue;
            }
            if (!rightMostNeuron) {
                rightMostNeuron = neuron;
                continue;
            }

            if (neuron.position.x <= leftMostNeuron.position.x) leftMostNeuron = neuron;
            if (neuron.position.x > rightMostNeuron.position.x) rightMostNeuron = neuron;
        }

        return Math.abs(leftMostNeuron.position.x) + Math.abs(rightMostNeuron.position.x);
    }


    /**
     * 
     * @param {String} uuid 
     * @returns
     */
    getNeuronIndexByUUID(uuid) {
        let index = -1;
        this.neurons.forEach((a, i) => {
            if (a.uuid == uuid) index = i;
        })
        return index
    }
}

module.exports = Network;
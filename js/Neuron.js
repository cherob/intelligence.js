var uuid = require('uuid');

class Neuron {
    constructor(bias) {
        const {
            defaults
        } = this.constructor;
        this.id = uuid.v1(); // ID
        this.bias = bias == undefined ? 0 : bias; // this.bias ∈ ℝ && -1 < this.bias < 1
        this.position = {
            x: 0,
            y: 0,
            z: 0
        }
        this.synapses = []; // outgoing
        this.dendrites = []; // incoming

        this.voltage = 0;
    }

    input(v) {
        this.voltage += v
    }
}
module.exports = Neuron;
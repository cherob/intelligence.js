var uuid = require('uuid');

class Neuron {
    constructor(size, activator) {
        const {
            defaults
        } = this.constructor;
        this.activator = activator;
        this.connectifity = 0.8;
        this.capacity = 3;

        this.tolerance = 0.5;

        this.uuid = uuid.v4(); // uuid

        this.size = size();


        this.position = {
            x: 0,
            y: 0,
            z: 0
        }

        this.synapses = []; // outgoing
        this.dendrites = []; // incoming
        this.value = 0;
    }

    impulse() {
        let i = 0
        i = this.activator(this.value);
        this.value = 0;
        if (i  > this.tolerance){
            this.tolerance *= 0.9;
            return i
        }
    }
}
module.exports = Neuron;
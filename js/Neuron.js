var uuid = require('uuid');

class Neuron {
    constructor(size, activator) {
        const {
            defaults
        } = this.constructor;
        this.activator = activator;

        this.id = uuid.v4(); // ID
        this.color = 0xFFFFFF

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
        if (i > this.size) {
            this.value = 0;
            return i;
        }
        return 0
    }
}
module.exports = Neuron;
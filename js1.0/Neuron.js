const uuid = require('uuid');

class Neuron {
    constructor(activator) {
        const {
            defaults
        } = this.constructor;
        this.activator = activator;
        this.synapses_len = 5;
        this.tolerance = activator(0.5);

        this.uuid = uuid.v4(); // uuid

        this.position = {
            x: 0,
            y: 0,
            z: 0
        }

        this.synapses = []; // outgoing
        // this.dendrites = []; // incoming
        this.value = 0;
    }

    getImpulseValue() {
        if (this.value == 0)
            return
        
        let i = 0
        // let value = this.value;
        i = this.activator(this.value);
        this.value = 0;
        if (i <= this.tolerance)
            return false

        // if (this.tolerance <= 1)
        //     this.tolerance -= this.tolerance * 0.1;
        // console.log(value)
        return i

    }
}
module.exports = Neuron;
const uuid = require('uuid');
const Functions = require('../Functions');
const Neuron = require('./Neuron');

class Connection {
    /**
     * 
     * @param {Neuron} from 
     * @param {Neuron} to
     */
    constructor(from, to) {
        this.uuid = uuid.v4(); // uuid

        this.to = to;
        this.from = from;
        this.distance = Functions.distance(to.position, from.position);

        this.weight = Math.random() * 10;
    }

}
module.exports = Connection;
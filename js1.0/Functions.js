const Neuron = require("./Neuron");
const uuid = require('uuid');

module.exports = {
    volume: {
        // TODO NOT CIRCULAR
        CIRCULAR: (dimeter = 1) => {
            return () => {
                let d, x, y, z;
                do {
                    x = (Math.random() * 2.0 - 1.0);
                    y = (Math.random() * 2.0 - 1.0);
                    z = (Math.random() * 2.0 - 1.0);
                    d = x * x + y * y + z * z;
                } while (d > 1.0);

                x *= dimeter;
                y *= dimeter;
                z *= dimeter;
                return {
                    x: x,
                    y: y,
                    z: z
                };
            }
        },
        BOX: (a = 1, b = 1, c = 1) => {
            return () => {
                return {
                    x: (Math.random() * a * 2 - a),
                    y: (Math.random() * b * 2 - b),
                    z: (Math.random() * c * 2 - c)
                };
            }
        },
    },
    connector: {
        CLOSE: (radius = 1 / 4) => {
            /**
             * 
             * @param {Neuron} neuron 
             * @param {Array<Neuron>} neurons 
             */
            function func(neuron, neurons) {
                let synapses = [];

                neurons.forEach(
                    /**
                     * @param {Neuron} other
                     */
                    function (other) {
                        let d = Math.pow((
                            Math.pow((neuron.position.x - other.position.x), 2) +
                            Math.pow((neuron.position.y - other.position.y), 2) +
                            Math.pow((neuron.position.z - other.position.z), 2)), 0.5)

                        let random = (Math.random() * neuron.connectifity)
                        if (random > 0.6) return

                        if (d > radius) return
                        if (other.uuid == neuron.uuid) return
                        if (synapses.length > neuron.capacity) return
                        if (neuron.uuid.indexOf(other.synapses.map((_) => _.target.uuid))) return


                        synapses.push({
                            target: other,
                            uuid: uuid.v4(),
                            weight: Math.random() * 10
                        })
                    });
                return synapses
            }
            return func
        },
        DIRECTIONAL: (radius = 1 / 4) => {
            /**
             * 
             * @param {Neuron} neuron 
             * @param {Array<Neuron>} neurons 
             */
            function func(neuron, neurons) {
                let synapses = [];

                neurons.forEach(
                    /**
                     * @param {Neuron} other
                     */
                    function (other) {
                        if (other.uuid == neuron.uuid) return
                        if (neuron.position.x > other.position.x) return
                        if (synapses.length > neuron.synapses_len) return

                        let distance = Math.pow((
                            Math.pow((neuron.position.x - other.position.x), 2) +
                            // Math.pow((neuron.position.y - other.position.y), 2) +
                            Math.pow((neuron.position.z - other.position.z), 2)), 0.5)
                        if (distance > radius) return
                        if (neuron.uuid.indexOf(other.synapses.map((_) => _.target.uuid))) return
                        
                        

                        synapses.push({
                            target: other,
                            uuid: uuid.v4(),
                            weight: Math.random() * 10
                        })
                    });
                return synapses
            }
            return func
        }
    },
    activation: {
        SIGMOID: (t) => {
            return 1 / (1 + Math.pow(Math.E, -t))
        }
    }
}
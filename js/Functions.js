const Neuron = require("./Neuron");

module.exports = {
    volume: {
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
                    x:  (Math.random() * a * 2 - a),
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

                        let random = (Math.random() * neuron.connectifity * 2)
                        if (random > 0.3) return
                        if (d > radius) return
                        if (other.uuid == neuron.uuid) return
                        if (synapses.length > neuron.capacity) return
                        if (neuron.uuid.indexOf(other.synapses.map((_) => _.uuid))) return


                        synapses.push({
                            position: other.position,
                            uuid: other.uuid,
                            weight: Math.random()
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
    },
    size: {
        RANDOM: () => {
            return Math.random();
        }
    }
}
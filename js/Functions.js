const Neuron = require("./network/Neuron");
const uuid = require('uuid');

module.exports = {
    distance: (a, b) => {
        return Math.pow((
            Math.pow((a.x - b.x), 2) +
            Math.pow((a.y - b.y), 2) +
            Math.pow((a.z - b.z), 2)), 0.5);
    },
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
                    x: (Math.random() * a * 2 - a),
                    y: (Math.random() * b * 2 - b),
                    z: (Math.random() * c * 2 - c)
                };
            }
        },
    },
    activation: {
        SIGMOID: (t) => {
            return 1 / (1 + Math.pow(Math.E, -t))
        }
    }
}
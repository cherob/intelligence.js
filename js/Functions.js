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
    },
    connector: {
        CLOSE: (radius = 1 / 4) => {
            return (other, another) => {

                let d = Math.pow((
                    Math.pow((another.position.x - other.position.x), 2) +
                    Math.pow((another.position.y - other.position.y), 2) +
                    Math.pow((another.position.z - other.position.z), 2)), 0.5)

                let already_connected = another.synapses.filter(synapse => {
                    return synapse.id == other.id
                }).length == 1;
                if (d < radius && other.id != another.id && !already_connected)
                    return true;
                else
                    return false
            }
        }
    },
    activation: {
        SIGMOID: (t) => {
            return 1 / (1 + Math.pow(Math.E, -t))
        }
    },
    size: {
        RANDOM: () => {
            return Math.random()/10;
        }
    }
}
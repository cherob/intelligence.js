module.exports = {
    volume: {
        CIRCULAR: (dimeter) => {
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
    connection: {
        CLOSE: (other, another) => {
            var radius = 0.001;

            let d = Math.pow((
                Math.pow((another.x - other.x), 2) +
                Math.pow((another.y - other.y), 2) +
                Math.pow((another.z - other.z), 2)), 0.5)
            if (d < radius)
                return true;
            else
                return false
        }
    }
}
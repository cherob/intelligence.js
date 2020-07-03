const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const dat = require('dat.gui');
const Network = require('./Network');

class Engine {
    constructor() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xf5eded)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
        this.camera.position.z = 20

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        document.body.appendChild(this.renderer.domElement)

        this.raycaster = new THREE.Raycaster();

        /** AxesHelper
         * An axis object to visualize the 3 axes in a simple way.
         * The X axis is red. The Y axis is green. The Z axis is blue.
         */
        var axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        /** OrbitControls
         * Orbit controls allow the camera to orbit around a target.
         * To use this, as with all files in the /examples directory, you will
         * have to include the file seperately in your HTML.
         */
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    }

    render() {
        // this.updateIntersect();
        this.camera.updateMatrixWorld();
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * 
     * @param {Network} net 
     */
    update(net) {
        net.neurons.forEach((neuron, i) => {
            let n = this.scene.getObjectByName(neuron.id)
            n.material.color = {
                r: i == 0 ? 1 : neuron.value,
                g: i == 0 ? 1 : neuron.value*0.2,
                b: i == 0 ? 1 : neuron.value*0.2
            };
        })
    }

    /**
     * 
     * @param {Network} net 
     */
    build(net) {
        net.neurons.forEach((neuron, i) => {
            var geometry = new THREE.SphereGeometry(neuron.size / 2, 32, 32);
            var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                color: neuron.color
            }));
            sphere.position.x = neuron.position.x
            sphere.position.y = neuron.position.y
            sphere.position.z = neuron.position.z
            sphere.uuid = neuron.id
            sphere.name = neuron.id
            this.scene.add(sphere);

            neuron.synapses.forEach(synapse => {
                var points = [];
                points.push(new THREE.Vector3(synapse.position.x, synapse.position.y, synapse.position.z));
                points.push(new THREE.Vector3(neuron.position.x, neuron.position.y, neuron.position.z));

                var geometry = new THREE.BufferGeometry().setFromPoints(points);

                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                    color: 0x0
                }));
                // this.scene.add(line);
            })
        })
    }

    updateIntersect() {
        // find intersections
        this.raycaster.setFromCamera(getMouse(), this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        intersects = intersects.filter(intersect => intersect.object.type == 'Mesh');
        if (intersects.length) {
            this.selected = intersects[0];
        }
    }


}

module.exports = Engine
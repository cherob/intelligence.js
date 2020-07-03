const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const dat = require('dat.gui');
const Network = require('./Network');

class Engine {
    constructor(frame_rate = 27.5) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.z = 10

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

        /** Render
         * Start rendring functions
         */
        let frames = setInterval(() => this.render(), 1000 / frame_rate);
    }

    render() {
        this.camera.updateMatrixWorld();
        this.updateIntersect();
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * 
     * @param {Network} net 
     */
    connect(net) {
        net.neurons.forEach(neuron => {
            var geometry = new THREE.SphereGeometry((neuron.bias + 1) / 10, 32, 32);
            var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                color: 0xffff00
            }));
            sphere.position.x = neuron.position.x
            sphere.position.y = neuron.position.y
            sphere.position.z = neuron.position.z
            this.scene.add(sphere);

            

            neuron.synapses.forEach(synapse => {
                var points = [];
                points.push(new THREE.Vector3(synapse.position.x, synapse.position.y, synapse.position.z));
                points.push(new THREE.Vector3(neuron.position.x, neuron.position.y, neuron.position.z));

                var geometry = new THREE.BufferGeometry().setFromPoints(points);

                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                    color: 0xff00ff,
                    linewidth: 100
                }));
                line.uuid = synapse.id
                this.scene.add(line);
            })
        })

    }

    updateIntersect() {
        // find intersections
        this.raycaster.setFromCamera(getMouse(), this.camera);

        if (this.selected)
            this.selected.object.material.color = {
                r: 1,
                g: 1,
                b: 0
            }

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        intersects = intersects.filter(intersect => intersect.object.type == 'Mesh');
        if (intersects.length) {
            intersects[0].object.material.color = {
                r: 1,
                g: 1,
                b: 1
            }
            this.selected = intersects[0];
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

}

module.exports = Engine
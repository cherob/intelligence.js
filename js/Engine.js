const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const dat = require('dat.gui');
const Network = require('./Network');
const Neuron = require('./Neuron');

class Engine {
    /**
     * 
     * @param {Number} zoom 
     * @param {Array<Number>} render_range 
     */
    constructor(fps = 144, zoom = 20, view_range = [0.1, 100]) {
        this.fps = fps
        this.selectedNeuron = {
            uuid: undefined,
            last: false
        }

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xf5eded)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, view_range[0], view_range[1])
        this.camera.position.z = zoom

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        document.body.appendChild(this.renderer.domElement)

        /** Raycaster
         * This class is designed to assist with raycasting. 
         * Raycasting is used for mouse picking amongst other things.
         *  (working out what objects in the 3d space the mouse is over) 
         */
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

    /** 
     * Start render with given fps
     */
    start() {
        setInterval(() => {
            this.camera.updateMatrixWorld();
            this.controls.update();
            this.renderer.render(this.scene, this.camera)
        }, 1000 / this.fps);
    }

    /** 
     * 
     * @param {Network} net 
     */
    update(net) {
        this.selectedNeuron = this.getSelectedNeuron();
        this.updateNeurons(net);
    }

    /**
     * 
     * @param {Network} net 
     */
    build(net, lines = true) {
        net.neurons.forEach(neuron => {
            this.generateNeuron(neuron);

            if (lines)
                this.generateConnections(neuron);
        })
    }

    /**
     * 
     * @param {Network} net 
     */
    updateNeurons(net) {
        net.neurons.forEach((neuron, i) => {
            let neuron3D = this.scene.getObjectByProperty('uuid', neuron.uuid)
            neuron3D.scale.setScalar(1 - neuron.tolerance)
            neuron3D.material.color = {
                r: neuron.uuid == this.selectedNeuron.uuid ? 0.3 : neuron.value,
                g: neuron.uuid == this.selectedNeuron.uuid ? 0.7 : neuron.value * 0.2,
                b: neuron.uuid == neuron.value * 0.2
            };
        })

        if (!this.selectedNeuron.uuid) return

        net.neurons.forEach((neuron) => neuron.synapses.forEach(synapse => {
            let synapse3D = this.scene.getObjectByProperty('uuid', synapse.uuid)
            if (!synapse3D) return
            
            synapse3D.visible = false;
        }));

        net.neurons[net.getNeuronIndexByUUID(this.selectedNeuron.uuid)].synapses.forEach(synapse => {
            let synapse3D = this.scene.getObjectByProperty('uuid', synapse.uuid)
            if (!synapse3D) return

            synapse3D.visible = true;
            synapse3D.material.color = {
                r: synapse.weight / 10,
                g: 0,
                b: 0
            };
        });


    }

    /**
     * 
     * @param {Neuron} neuron 
     */
    generateNeuron(neuron) {
        var geometry = new THREE.SphereGeometry(1 - neuron.tolerance, 4, 4);
        var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0x000000
        }));

        sphere.position.set(...Object.values(neuron.position));
        sphere.uuid = neuron.uuid
        this.scene.add(sphere);
    }

    /**
     * 
     * @param {Neuron} neuron 
     */
    generateConnections(neuron) {
        neuron.synapses.forEach(synapse => {

            var points = [];
            points.push(new THREE.Vector3(synapse.target.position.x, synapse.target.position.y, synapse.target.position.z));
            points.push(new THREE.Vector3(neuron.position.x, neuron.position.y, neuron.position.z));

            var geometry = new THREE.BufferGeometry().setFromPoints(points);


            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0x0
            }));
            line.uuid = synapse.uuid;
            line.visible = false;

            this.scene.add(line);
        })
    }

    /**
     * @returns {THREE.Object3D}
     */
    getSelectedNeuron() {
        // find intersections
        this.raycaster.setFromCamera(getMouse(), this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        intersects = intersects.filter(intersect => intersect.object.type == 'Mesh');
        if (intersects.length)
            return intersects[0].object;
        this.selectedNeuron.last = true;
        return this.selectedNeuron;
    }


}

module.exports = Engine
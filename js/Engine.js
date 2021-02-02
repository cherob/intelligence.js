const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const dat = require('dat.gui');
const Network = require('./network/Network');
const Neuron = require('./network/Neuron');

class Engine {
    /**
     * 
     * @param {Number} zoom 
     * @param {Array<Number>} render_range 
     */
    constructor(network, fps = 144, zoom = 20, view_range = [0.1, 100]) {
        this.fps = fps
        this.selectedNeuron = {};
        this.network = network;

        this.neuron_size_factor = 0.7

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
        window.requestAnimationFrame(this.render.bind(this));
        window.onresize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };
    }

    render() {
        this.camera.updateMatrixWorld();
        this.controls.update();
        this.renderer.render(this.scene, this.camera)

        window.requestAnimationFrame(this.render.bind(this));
    }

    getSelectedNeuron() {
        // find intersections
        this.raycaster.setFromCamera(getMouse(), this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        intersects = intersects.filter(intersect => intersect.object.type == 'Mesh');

        if (intersects[0]) {
            if (!this.selectedNeuron || intersects[0].uuid !== this.selectedNeuron.uuid)
                return intersects[0].object

        }

        return undefined
    }

    /** 
     * 
     * @param {Network} net 
     */
    update(net) {

        this.selectedNeuron = this.getSelectedNeuron();
        let check_uuid = this.selectedNeuron ? this.selectedNeuron.uuid : false;

        net.neurons.forEach((neuron, i) => {
            let neuron3D = this.scene.getObjectByProperty('uuid', neuron.uuid)
            neuron3D.scale.setScalar(neuron.tolerance * this.neuron_size_factor)
            neuron3D.material.color = {
                r: neuron.uuid == check_uuid ? 0.25 : neuron.value + 0.1,
                g: neuron.uuid == check_uuid ? 0.2 : neuron.value * 0.2 + 0.1,
                b: neuron.uuid == check_uuid ? 0.6 : neuron.value * 0.2 + 0.1
            };
        })

        this.scene.children.forEach((child) => {
            if (child.type == "Line")
                this.scene.remove(child);
        });

        if (!this.selectedNeuron) return;

        let selectedNeuron = net.neurons[net.getNeuronIndexByUUID(this.selectedNeuron.uuid)]
        if (!selectedNeuron) return

        selectedNeuron.synapses.forEach(synapse => {
            var points = [];
            // if (this.scene.getObjectById(synapse.uuid)) return false

            points.push(new THREE.Vector3(synapse.to.position.x, synapse.to.position.y, synapse.to.position.z));
            points.push(new THREE.Vector3(synapse.from.position.x, synapse.from.position.y, synapse.from.position.z));

            let geometry = new THREE.BufferGeometry().setFromPoints(points);

            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0x44BBFF
            }));
            line.uuid = synapse.uuid;
            this.scene.add(line);
        })

        selectedNeuron.dendrites.forEach(dendrite => {
            var points = [];
            // if (this.scene.getObjectById(dendrite.uuid)) return false

            points.push(new THREE.Vector3(dendrite.to.position.x, dendrite.to.position.y, dendrite.to.position.z));
            points.push(new THREE.Vector3(dendrite.from.position.x, dendrite.from.position.y, dendrite.from.position.z));
            let geometry = new THREE.BufferGeometry().setFromPoints(points);

            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0xFFBB44
            }));
            line.uuid = dendrite.uuid;
            this.scene.add(line);
        })

    }

    /**
     * 
     * @param {Network} net 
     */
    build() {
        this.network.neurons.forEach(neuron => {
            this.generateNeuron(neuron);

        })
    }

    /**
     * 
     * @param {Neuron} neuron 
     */
    generateNeuron(neuron) {
        var geometry = new THREE.SphereGeometry(neuron.tolerance * this.neuron_size_factor, 4, 4);
        var sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0x000000
        }));

        sphere.position.set(...Object.values(neuron.position));
        sphere.uuid = neuron.uuid
        this.scene.add(sphere);
    }
}

module.exports = Engine
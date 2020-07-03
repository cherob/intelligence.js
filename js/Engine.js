const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');
const { isEmpty } = require('lodash');

class Engine {
    constructor(frame_rate = 27.5) {
        const width = window.innerWidth
        const height = window.innerHeight

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        document.body.appendChild(this.renderer.domElement)

        this.camera.position.z = 5

        /** AxesHelper
         * An axis object to visualize the 3 axes in a simple way.
         * The X axis is red. The Y axis is green. The Z axis is blue.
         */
        var axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        let updates = setInterval(() => this.update(), 1000 / frame_rate);
    }

    update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * 
     * @param {Array} elements 
     */
    draw(elements) {
        elements.forEach(element => {
            var geometry = new THREE.SphereGeometry(0.1, 32, 32);
            var material = new THREE.MeshBasicMaterial({
                color: 0xffff00
            });
            var sphere = new THREE.Mesh(geometry, material);

            sphere.position.x = element.position.x
            sphere.position.y = element.position.y
            sphere.position.z = element.position.z
            console.log(element)
            this.scene.add(sphere);
        })

    }

    clear() {
        while (this.scene.children.length > 0) {
            clearThree(this.scene.children[0])
            this.scene.remove(this.scene.children[0]);
        }
        if (this.scene.geometry) this.scene.geometry.dispose()

        if (this.scene.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(this.scene.material).forEach(prop => {
                if (!this.scene.material[prop])
                    return
                if (typeof this.scene.material[prop].dispose === 'function')
                    this.scene.material[prop].dispose()
            })
            this.scene.material.dispose()
        }
    }


}

module.exports = Engine
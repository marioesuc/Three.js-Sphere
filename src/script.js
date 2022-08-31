import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }  

const SCREEN_DIRECTIONS = {
    NW: 'NW',
    N: 'N',
    NE: 'NE',
    W: 'W',
    C: 'C',
    E: 'E',
    SW: 'SW',
    S: 'S',
    SE: 'SE',
} 

// Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/NormalMap.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64);
// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7;
material.roughness = 0.2;
material.color = new THREE.Color(0x292929);
material.normalMap = normalTexture; 


// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// const sphere2 = new THREE.Mesh(geometry,material)
// scene.add(sphere)
// sphere.direction = 'nw'
// scene.add(sphere2)
// sphere.position.z = -100

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// LIGHT 2
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-1.86,1,-1.65 )
pointLight2.intensity = 1
scene.add(pointLight2)

// LIGHT 3
const pointLight3 = new THREE.PointLight(0xe1ff, 2)
pointLight3.position.set(2.13,-3,-1.98)
pointLight3.intensity = 6.8 
scene.add(pointLight3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
 document.addEventListener('mousemove', onDocumentMouseMove)

const updateSphere = (event ) => {
    sphere.position.y = window.scrollY * .001
}

window.addEventListener('scroll', updateSphere);

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth /2;
const windowY = window.innerHeight /2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

const clock = new THREE.Clock()

const generatedSpheres = []

let lastTime = 0
const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()
    const timeDifferenceSeconds = elapsedTime-lastTime
    if (timeDifferenceSeconds > .2) {
        const newSphere = new THREE.Mesh(geometry,material)
        scene.add(newSphere)
        generatedSpheres.push(newSphere);
        newSphere.position.z = -50
        const directionsArray = Object.values(SCREEN_DIRECTIONS)
        const directionsAmount = Object.values(SCREEN_DIRECTIONS).length
        const randomDirectionsIndex = getRandomIntInclusive(0, directionsAmount)
        const randomDirection = directionsArray[randomDirectionsIndex]
        newSphere.direction = randomDirection

        lastTime = elapsedTime
    }

    generatedSpheres.forEach( sphere => {
        if (sphere.position.z > 5) {
            const index = generatedSpheres.indexOf(sphere);
            generatedSpheres.splice(index, 1);
            return
        }
        sphere.position.z += .3
    
        switch (sphere.direction) {
            case SCREEN_DIRECTIONS.NW:
                sphere.position.x -= .005
                sphere.position.y += .005
                break;
            
            case SCREEN_DIRECTIONS.N:
                sphere.position.y += .005
                break;

            case SCREEN_DIRECTIONS.NE:
                sphere.position.x += .005
                break;

            case SCREEN_DIRECTIONS.W:
                sphere.position.x -= .005
                break;

            case SCREEN_DIRECTIONS.C:
                break;
                
            case SCREEN_DIRECTIONS.E:
                sphere.position.x += .005
                break;

            case SCREEN_DIRECTIONS.SW:
                sphere.position.x -= .005
                sphere.position.y -= .005
                break;

            case SCREEN_DIRECTIONS.S:
                sphere.position.y -= .005
                break;

            case SCREEN_DIRECTIONS.SE:
                sphere.position.x += .005
                sphere.position.y -= .005
                break;
        }

    })

    camera.position.y += .2 * (targetX - camera.position.y)
    camera.position.x += .2 * (targetY - camera.position.x)
    // camera.position.x += .5 * (targetY - camera.rotation.x)

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
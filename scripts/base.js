import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()

//create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({ 
  color: "#00ff83",
  roughness: 0.5
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7)
light.position.set(0, 10, 10)
scene.add(light)

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene,camera)

//resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width,sizes.height)
})


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5


const renderloop = () => {
  controls.update()
  renderer.render(scene,camera)
  window.requestAnimationFrame(renderloop)
}

renderloop()

//timeline animation
const tl = gsap.timeline({defaults: {duration:1, ease: "power1.out"}})
tl.fromTo(mesh.scale, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

//mouse animation color
let mouseDown = false
let rgb = 0
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      e.pageX/sizes.width,
      e.pageY/sizes.height,
      150/255,
    ]
    
    gsap.to(mesh.material.color, {r:rgb[0], g: rgb[1], b: rgb[2]})
  }
})
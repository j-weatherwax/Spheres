import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()

//create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./src/earth/land_shallow_topo_2048.jpg')
const displacementTexture = textureLoader.load('./src/earth/displacement.jpg')
const normalTexture = textureLoader.load('./src/earth/EarthNormal.png')
const material = new THREE.MeshStandardMaterial({ 
  map: texture,
  displacementMap: displacementTexture,
  displacementScale: 0.25,
  normalMap:normalTexture,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//clouds
const cloudGeometry = new THREE.SphereGeometry(3.05, 64, 64)
const cloudTexture = textureLoader.load('./src/earth/clouds.jpg')
const cloudMaterial = new THREE.MeshStandardMaterial({ 
  alphaMap: cloudTexture,
  map: cloudTexture,
  transparent: true
})
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
scene.add(cloudMesh)

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//light
const light = new THREE.PointLight(0xffffff, 300, 100, 1.7)
light.position.set(-5, 10, 0)
camera.add(light)

// starry background
const starGeometry = new THREE.BufferGeometry()
const sprite = new THREE.TextureLoader().load('./src/earth/star.png');
const starMaterial = new THREE.PointsMaterial({
  map: sprite,
  size: 0.15,
  transparent: true
})

const starVertices = []
for(let i = 0; i < 10000; i++){
  const x = (Math.random() - 0.5) * 200
  const y = (Math.random() - 0.5) * 200
  const z = -Math.random() * 200
  starVertices.push(x,y,z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
const stars = new THREE.Points(starGeometry, starMaterial)
camera.add(stars)

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
tl.fromTo([mesh.scale, cloudMesh.scale], {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})
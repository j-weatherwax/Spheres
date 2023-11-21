import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//set text color for better legibility
document.body.style.color = '#df3f48'
var navlink = document.querySelector('nav a')
navlink.style.color = '#df3f48'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xa0d8f2)

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)


const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
  uniform vec2 iresolution;
  uniform float time;
  uniform float AngPos;
  const float pi = 3.141592654;
  const vec4 white = vec4(1.0);
  const vec4 red = vec4(.8745, 0.2471, 0.2824, 1.0);

  void main() {
    vec2 uv = (gl_FragCoord.xy - iresolution.xy) / iresolution.y;

    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    vec3 color = vec3(fract(3.0 * theta / pi - 11.0 * pow(r, 0.15) - time/4.0 + AngPos/3.0) < 0.5 ? white : red);

    gl_FragColor = vec4(color, 1.0);
  }
`;

//create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.ShaderMaterial({ 
  uniforms:{
    iresolution:{type:'vec2', value: new THREE.Vector2(sizes.width, sizes.height)},
    time:{type:'float', value:0},
    AngPos:{type:'float', value:0},
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//create stick
const stickGeometry = new THREE.BoxGeometry(1, 15, 1)
const stickMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
const stick = new THREE.Mesh(stickGeometry, stickMaterial)
stick.position.set(0, -7, -20)
camera.add(stick)

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
  material.uniforms.iresolution.value = new THREE.Vector2(sizes.width, sizes.height)
})

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false

var AngPos = 0;
var maxAngPos = 0;
var lastMouseX = 0;
var velocity = 0;

const renderloop = () => {
  controls.update()
  renderer.render(scene,camera)
  material.uniforms.time.value += 0.025

  if (velocity !== 0) {

    //ease function
    const ease = 1 - Math.pow(1 - Math.abs(velocity), 3)
    AngPos = ease * velocity

    maxAngPos = Math.max(maxAngPos, Math.abs(AngPos))
    material.uniforms.AngPos.value += AngPos

    // Apply damping to gradually reduce velocity
    velocity *= 0.95;  
  }

  window.requestAnimationFrame(renderloop)
}

renderloop()

let mouseDown = false
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  // let initMouseX = e.clientX
  if (mouseDown) {
    const currentMouseX = e.clientX;
    const deltaX = currentMouseX - lastMouseX;

    // Calculate velocity based on the change in mouse position
    velocity = deltaX * 0.01;

    // Update the last mouse position
    lastMouseX = currentMouseX;
      
  }
})

//timeline animation
const tl = gsap.timeline({defaults: {duration:1, ease: "power1.out"}})
tl.fromTo([mesh.scale, stick.scale], {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

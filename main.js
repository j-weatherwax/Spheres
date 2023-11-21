const scripts = [
    '/scripts/base.js',
    '/scripts/earth.js',
    '/scripts/spiral.js',
]

const randomScript = scripts[Math.floor(Math.random() * scripts.length)]

const script = document.createElement('script')
script.src = randomScript
script.type = 'module'

document.body.appendChild(script)
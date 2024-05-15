<template>
    <section ref="banner" class="banner-text">
        <canvas class="webgl"></canvas>
    </section>
</template>

<script>
import * as THREE from 'three'

export default {
    name: 'BannerText',
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {},
    mounted() {
        const vertexShader = `
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uTime;
uniform vec2 uMouse;
attribute vec2 offset;
attribute float angle;
attribute float pindex;
varying vec2 vUv;
varying vec2 vPUv;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise2(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

#define M_PI 3.1415926535897932384626433832795

float polarPhi(vec2 xy, vec2 center) {
  // https://www.mathsisfun.com/polar-cartesian-coordinates.html
  float result = atan((xy.y - center.y) / (xy.x - center.x));
  if (xy.x - center.x < 0.) {
    return result + M_PI; // II, III
  }
  if (xy.y - center.y < 0.) {
    return result + 2. * M_PI; // IV
  }
  return result; // I
}

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {
  float uDepth = 0.0;
  float uSize = 0.8;
  float uRandom = .05;
  vUv = uv;

	// particle uv
	vec2 puv = offset.xy / uTextureSize;
	vPUv = puv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

	// displacement
	vec3 displaced = vec3(offset.xy, 0.0) + 0.2*random(pindex)+2.0*vec3(1.0*grey, 1.0*grey, 0.2*grey);
	// randomise
	displaced.xy +=  10.* vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
	float rndz = 1.*(random(pindex) + snoise2(vec2(pindex * 0.1, uTime * 0.1)));
	// center
	displaced.xy -=  uTextureSize * 0.5 ;
	// touch
	float t = pow(1.0 - distance(uMouse, puv), 16.0);
	displaced.x += -t*200.*(uMouse.x - puv.x) + cos(angle) * t * 10.0 * rndz;
	displaced.y += -t*200.*(uMouse.y - puv.y) + sin(angle) * t * 10.0 * rndz;

	// particle size
	float psize = 3.*snoise2(vec2(pindex, angle)) + (snoise2(vec2(uTime, pindex) * 0.5) + 2.0);
	psize *= max(grey, 0.2);
	psize *= uSize;

	// final position
	vec4 mvPosition = modelViewMatrix * vec4(displaced.xy, 0.0,  1.0);
	mvPosition.xyz += position * psize;
	vec4 finalPosition = projectionMatrix * mvPosition;
	gl_Position = finalPosition;
}
`

        const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
varying vec2 vUv;
varying vec2 vPUv;

void main() {
  vec2 puv = vPUv;
  vec2 uv = vUv;
  vec4 colA = texture2D(uTexture, puv);
  float border = 0.1;
	float radius = 0.4;
  float dist = radius - distance(uv, vec2(0.5));
	float t = smoothstep(0.0, border, dist);
  gl_FragColor = vec4(mix(vec3(colA.rgb), vec3(1.0, 0.0, 1.0), pow(1.0 - length(uMouse - puv), 14.)), t);
}
`
        let dom = this.$refs.banner

        class World {
            constructor({ canvas }) {
                this.scene = new THREE.Scene()
                this.clock = new THREE.Clock()

                this.width = dom.offsetWidth
                this.height = dom.offsetHeight
                this.aspectRatio = this.width / this.height
                this.perspective = 10
                const fov =
                    2 *
                    (180 / Math.PI) *
                    Math.atan(
                        (0.5 * 256) /
                            Math.min(1, this.aspectRatio) /
                            this.perspective
                    )
                this.camera = new THREE.PerspectiveCamera(
                    fov,
                    this.aspectRatio,
                    0.1,
                    1000
                )
                this.camera.position.set(0, 0, this.perspective)
                this.scene.add(this.camera)
                this.renderer = new THREE.WebGLRenderer({
                    canvas,
                    alpha: true,
                    antialias: true
                })
                this.pixelRatio = Math.min(window.devicePixelRatio, 2)
                this.renderer.setPixelRatio(this.pixelRatio)
                this.renderer.setSize(this.width, this.height)
                this.timer = 0
                this.mousePos = { x: 0, y: 0 }
                this.targetMousePos = { x: 0, y: 0 }
                this.loader = new THREE.TextureLoader()
                this.loadTexture()

                this.listenToResize()
                //console.log(this);
            }

            loadTexture() {
                console.log('load texture')
                const text = 'WEBSTATION'
                const ctx = document.createElement('canvas').getContext('2d')
                ctx.canvas.width = 1200
                ctx.canvas.height = 400
                ctx.scale(1, 1)
                ctx.fillStyle = '#000'
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                ctx.fillStyle = '#64B5F6'
                ctx.font = '180px Impact, sans-serif'
                ctx.textBaseline = 'ideographic'
                ctx.shadowColor = 'white'
                ctx.shadowBlur = 2
                ctx.shadowOffsetX = -2
                ctx.shadowOffsetY = 2

                ctx.lineWidth = 3
                ctx.textAlign = 'center'
                ctx.fillText(text, ctx.canvas.width / 2, 300)

                this.texture = new THREE.CanvasTexture(ctx.canvas)

                this.optimize()
                this.addToScene()
            }

            optimize() {
                const threshold = 50
                const img = this.texture.image
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                canvas.width = this.texture.image.width
                canvas.height = this.texture.image.height
                ctx.scale(1, -1)
                ctx.drawImage(
                    img,
                    0,
                    0,
                    this.texture.image.width,
                    this.texture.image.height * -1
                )

                const imgData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )
                this.originalColors = Float32Array.from(imgData.data)

                const redChannel = this.originalColors.filter(
                    (el, index) => index % 4 === 0
                )

                this.usedCells = redChannel.reduce((acc, curr, index) => {
                    if (curr > threshold) {
                        acc.push(index)
                    }
                    return acc
                }, [])
                console.log(this.usedCells.length)
            }

            render() {
                const elapsedTime = this.clock.getElapsedTime()
                this.controls && this.controls.update()
                this.material.uniforms.uTime.value = elapsedTime
                this.material.uniforms.u_resolution.value.x = this.width
                this.material.uniforms.u_resolution.value.y = this.height
                this.mousePos.x +=
                    (this.targetMousePos.x - this.mousePos.x) * 0.05
                this.mousePos.y +=
                    (this.targetMousePos.y - this.mousePos.y) * 0.05
                this.material.uniforms.uMouse.value.x = this.mousePos.x
                this.material.uniforms.uMouse.value.y = this.mousePos.y
                this.renderer.render(this.scene, this.camera)
            }

            loop() {
                this.render()
                requestAnimationFrame(this.loop.bind(this))
            }

            listenToResize() {
                document.onmousemove = e => {
                    this.material.uniforms.uMouse.value.x =
                        e.pageX * this.pixelRatio
                    this.material.uniforms.uMouse.value.y =
                        (this.height - e.pageY) * this.pixelRatio
                    this.targetMousePos.x = e.pageX / this.width
                    this.targetMousePos.y = 1.0 - e.pageY / this.height
                }
                window.addEventListener('resize', () => {
                    // Update sizes
                    this.width = dom.offsetWidth
                    this.height = dom.offsetHeight

                    // Update camera

                    this.camera.aspect = this.width / this.height
                    this.camera.fov =
                        2 *
                        (180 / Math.PI) *
                        Math.atan(
                            (0.5 * 256) /
                                Math.min(1, this.width / this.height) /
                                this.perspective
                        )
                    this.camera.updateProjectionMatrix()

                    // Update renderer
                    this.renderer.setSize(this.width, this.height)
                })
            }

            addToScene() {
                const width = this.texture.image.width
                const height = this.texture.image.height
                this.material = new THREE.ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    uniforms: {
                        uTime: { value: 1.0 },
                        u_resolution: { value: new THREE.Vector2() },
                        uMouse: { value: new THREE.Vector2() },
                        uTexture: { value: this.texture },
                        uTextureSize: {
                            value: new THREE.Vector2(width, height)
                        }
                    },
                    depthTest: false,
                    transparent: true
                })

                const squareGeometry = new THREE.PlaneGeometry(1, 1)
                this.instancedGeometry = new THREE.InstancedBufferGeometry()
                Object.keys(squareGeometry.attributes).forEach(attr => {
                    this.instancedGeometry.attributes[attr] =
                        squareGeometry.attributes[attr]
                })
                this.instancedGeometry.index = squareGeometry.index
                this.instancedGeometry.maxInstancedCount = 11000

                const indices = Uint16Array.from(this.usedCells)
                const offsets = new Float32Array(this.usedCells.length * 2)
                const angles = new Float32Array(this.usedCells.length)
                let j = 0
                for (let index of this.usedCells) {
                    offsets[j * 2 + 0] = index % width
                    offsets[j * 2 + 1] = Math.floor(index / width)
                    angles[j] = Math.random() * Math.PI
                    j++
                }

                this.instancedGeometry.setAttribute(
                    'pindex',
                    new THREE.InstancedBufferAttribute(indices, 1, false)
                )
                this.instancedGeometry.setAttribute(
                    'offset',
                    new THREE.InstancedBufferAttribute(offsets, 2, false)
                )
                this.instancedGeometry.setAttribute(
                    'angle',
                    new THREE.InstancedBufferAttribute(angles, 1, false)
                )

                this.object = new THREE.Mesh(
                    this.instancedGeometry,
                    this.material
                )
                this.scene.add(this.object)
                this.loop()
            }
        }

        new World({
            canvas: document.querySelector('canvas.webgl')
        })
    }
}
</script>

<style lang="scss" scoped>
.banner-text {
    height: 500px;
}
</style>

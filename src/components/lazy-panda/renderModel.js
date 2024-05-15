import {
    AmbientLight,
    AxesHelper,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    // SpotLight,
    WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import TWEEN from '@tweenjs/tween.js'

let isMoving = true
/**
 * 加载模型文件
 * @param url
 * @returns {Promise<unknown>}
 */
export const loadFile = url => {
    const loader = new GLTFLoader()
    return new Promise(resolve => {
        loader.load(
            url,
            gltf => {
                resolve(gltf)
            },
            args => {
                console.log(args)
            }
        )
    })
}

//---------------------------------------------------------------------------------------------------------------------
let boxWidth = 600,
    boxHeight = 400
let dom
let scene, renderer, camera, controls, myModel
let tween, tweenBack

//1. 创建renderer和场景
const setRendererAndScene = () => {
    scene = new Scene()
    window.scene = scene
    console.log(scene)
    renderer = new WebGLRenderer({
        alpha: true,
        logarithmicDepthBuffer: true,
        antialias: true
    })
    renderer.setSize(boxWidth, boxHeight)
    dom = document.getElementById('model-box')
    //先清空dom，再插入，防止测试情况下插入多个dom元素
    dom.innerHTML = ''
    dom.appendChild(renderer.domElement)
}
//2. 创建相机
let cameraPosition = {
    //相机的默认位置,近大远小
    x: 0,
    y: 0.75,
    z: 5
}
let cameraRotation = {
    x: 3.46,
    y: 0.17,
    z: 0
}
const setCamera = () => {
    const { x, y, z } = cameraPosition
    camera = new PerspectiveCamera(45, boxWidth / boxHeight, 0.1, 1000)
    camera.position.set(x, y, z)
    camera.lookAt(scene.position)
    camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z)
}

//3. 设置灯光
const setLight = () => {
    const ambientLight = new AmbientLight('#666666', 1)
    ambientLight.position.set(0, 1, 0)
    const directLight = new DirectionalLight('#ffffff', 1)
    directLight.position.set(5, 10, 7.5)
    scene.add(directLight)
    scene.add(ambientLight)
}

//4. 添加元素
const addMesh = async () => {
    //添加个正方体测试下
    // addCube()
    //添加辅助的刻度尺
    // addAxis()

    const gltf = await loadFile('model/lazy_panda/scene.gltf')
    console.log('gltf')
    //3d模型加载完成之后onLoad方法
    myModel = scene.add(gltf.scene)
    // myModel.position.y = -0.2
    //开始动画
    tween.start()
}

// const addCube = () => {
//     let cubeGeometry = new BoxGeometry(2, 2, 2)
//     let cubeMaterial = new MeshBasicMaterial({
//         color: 0xff00ff
//     })
//     const cube = new Mesh(cubeGeometry, cubeMaterial)
//     cube.position.x = 10
//     cube.position.y = 10
//     cube.position.y = 10
//     cube.name = 'cube'
//     scene.add(cube)
// }
// const addAxis = () => {
//     //添加辅助线，红色是x轴，绿色是y轴，蓝色是z轴
//     scene.add(new AxesHelper(20))
// }

//5.设置控制器
const setControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI
    controls.enableZoom = false
    controls.addEventListener('change', render)
}
//操作controls控制坐标
const render = () => {
    cameraPosition.x = Number.parseInt(camera.position.x)
    cameraPosition.y = Number.parseInt(camera.position.y)
    cameraPosition.z = Number.parseInt(camera.position.z)
}

let position = { y: -0.1 }
//6. 处理动画
const setAnimation = () => {
    tween = new TWEEN.Tween(position).to({ y: -0.3 }, 5000)
    tween.easing(TWEEN.Easing.Sinusoidal.InOut)
    tweenBack = new TWEEN.Tween(position).to({ y: -0.1 }, 5000)
    tweenBack.easing(TWEEN.Easing.Sinusoidal.InOut)
    tween.chain(tweenBack)
    tweenBack.chain(tween)
    const onUpdate = () => {
        myModel.position.y = position.y
    }
    tween.onUpdate(onUpdate)
    tweenBack.onUpdate(onUpdate)
}

// 循环
const loop = () => {
    requestAnimationFrame(loop)
    //更新tween动画
    TWEEN.update()
    //渲染场景
    renderer.render(scene, camera)
    //拖动controls时坐标进行更新
    controls.update()
}

//执行所有的初始化操作

export const init = async () => {
    setAnimation()
    setRendererAndScene()
    setCamera()
    setLight()
    await addMesh()
    setControls()
    loop()
}

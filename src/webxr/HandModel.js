import { Object3D, Sphere, Box3 } from 'three'
import { XRHandMeshModel } from './XRHandMeshModel.js'

const TOUCH_RADIUS = 0.01
const POINTING_JOINT = 'index-finger-tip'

class HandModel extends Object3D {
  constructor(controller, customModels) {
    super()

    this.controller = controller
    this.motionController = null
    this.envMap = null

    this.mesh = null

    controller.addEventListener('connected', (event) => {
      const xrInputSource = event.data

      if (xrInputSource.hand && !this.motionController) {
        this.xrInputSource = xrInputSource

        this.motionController = new XRHandMeshModel(
          this,
          controller,
          this.path,
          xrInputSource.handedness,
          xrInputSource.handedness === 'left' ? customModels[0] : customModels[1]
        )
      }
    })

    controller.addEventListener('disconnected', () => {
      this.dispose()
    })
  }

  updateMatrixWorld(force) {
    super.updateMatrixWorld(force)

    if (this.motionController) {
      this.motionController.updateMesh()
    }
  }

  getPointerPosition() {
    const indexFingerTip = this.controller.joints[POINTING_JOINT]
    if (indexFingerTip) {
      return indexFingerTip.position
    } else {
      return null
    }
  }

  intersectBoxObject(boxObject) {
    const pointerPosition = this.getPointerPosition()
    if (pointerPosition) {
      const indexSphere = new Sphere(pointerPosition, TOUCH_RADIUS)
      const box = new Box3().setFromObject(boxObject)
      return indexSphere.intersectsBox(box)
    } else {
      return false
    }
  }

  checkButton(button) {
    if (this.intersectBoxObject(button)) {
      button.onPress()
    } else {
      button.onClear()
    }

    if (button.isPressed()) {
      button.whilePressed()
    }
  }

  dispose() {
    this.clear()
    if (this.motionController) this.motionController.dispose?.()
    this.motionController = null
  }
}

export { HandModel }

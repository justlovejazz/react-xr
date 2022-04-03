export class HandModel extends Object3D<import("three").Event> {
    constructor(controller: any, customModels: any);
    controller: any;
    motionController: XRHandMeshModel | null;
    envMap: any;
    mesh: any;
    xrInputSource: any;
    getPointerPosition(): any;
    intersectBoxObject(boxObject: any): boolean;
    checkButton(button: any): void;
    dispose(): void;
}
import { Object3D } from "three/src/core/Object3D";
import { XRHandMeshModel } from "./XRHandMeshModel.js";

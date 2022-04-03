export class XRControllerModelFactory {
    constructor(gltfLoader?: null);
    gltfLoader: GLTFLoader;
    path: string;
    _assetCache: {};
    createControllerModel(controller: any): XRControllerModel;
}
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader";
declare class XRControllerModel extends Object3D<import("three").Event> {
    constructor();
    motionController: any;
    envMap: any;
    setEnvironmentMap(envMap: any): XRControllerModel;
}
import { Object3D } from "three/src/core/Object3D";
export {};

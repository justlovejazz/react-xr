export class XRHandMeshModel {
    constructor(handModel: any, controller: any, path: any, handedness: any, customModel: any);
    controller: any;
    handModel: any;
    bones: any[];
    updateMesh(): void;
    dispose(): void;
}

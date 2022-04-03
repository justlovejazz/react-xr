export namespace MotionControllerConstants {
    const Handedness: Readonly<{
        NONE: string;
        LEFT: string;
        RIGHT: string;
    }>;
    const ComponentState: Readonly<{
        DEFAULT: string;
        TOUCHED: string;
        PRESSED: string;
    }>;
    const ComponentProperty: Readonly<{
        BUTTON: string;
        X_AXIS: string;
        Y_AXIS: string;
        STATE: string;
    }>;
    const ComponentType: Readonly<{
        TRIGGER: string;
        SQUEEZE: string;
        TOUCHPAD: string;
        THUMBSTICK: string;
        BUTTON: string;
    }>;
    const ButtonTouchThreshold: number;
    const AxisTouchThreshold: number;
    const VisualResponseProperty: Readonly<{
        TRANSFORM: string;
        VISIBILITY: string;
    }>;
}
export class MotionController {
    constructor(xrInputSource: Object, profile: Object, assetUrl: Object);
    xrInputSource: Object;
    assetUrl: Object;
    id: any;
    layoutDescription: any;
    components: {};
    get gripSpace(): any;
    get targetRaySpace(): any;
    get data(): any[];
    updateFromGamepad(): void;
}
export function fetchProfile(xrInputSource: any, basePath: any, defaultProfile?: null, getAssetPath?: boolean): Promise<{
    profile: any;
    assetPath: string | undefined;
}>;
export function fetchProfilesList(basePath: any): Promise<any>;

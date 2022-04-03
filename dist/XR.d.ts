import * as React from 'react';
import { XRController } from './XRController';
import { Props as ContainerProps } from '@react-three/fiber/dist/declarations/src/web/Canvas';
import { XRSessionInit, Group, Matrix4, XRFrame, XRHandedness, XRHitTestResult, WebGLRenderer } from 'three';
export interface XRContextValue {
    controllers: XRController[];
    isPresenting: boolean;
    player: Group;
    isHandTracking: boolean;
}
export declare function useHitTest(hitTestCallback: (hitMatrix: Matrix4, hit: XRHitTestResult) => void): void;
export declare function XR({ foveation, children }: {
    foveation?: number;
    children: React.ReactNode;
}): JSX.Element;
export interface XRCanvasProps extends ContainerProps {
    sessionInit?: XRSessionInit;
    foveation?: number;
}
export declare function useXRButton(mode: 'AR' | 'VR', gl: WebGLRenderer, sessionInit?: XRSessionInit, container?: React.MutableRefObject<HTMLElement>): HTMLButtonElement | HTMLAnchorElement;
export declare function XRButton({ mode, sessionInit }: {
    mode: 'AR' | 'VR';
    sessionInit?: XRSessionInit;
}): null;
export declare function VRCanvas({ children, sessionInit, ...rest }: XRCanvasProps): JSX.Element;
export declare function ARCanvas({ children, sessionInit, ...rest }: XRCanvasProps): JSX.Element;
export declare const useXR: () => {
    hoverState: Record<XRHandedness, Map<import("three").Object3D<import("three").Event>, import("three").Intersection<import("three").Object3D<import("three").Event>>>>;
    addInteraction: (object: import("three").Object3D<import("three").Event>, eventType: import("./Interactions").XRInteractionType, handler: import("./Interactions").XRInteractionHandler) => any;
    removeInteraction: (object: import("three").Object3D<import("three").Event>, eventType: import("./Interactions").XRInteractionType, handler: import("./Interactions").XRInteractionHandler) => any;
    controllers: XRController[];
    isPresenting: boolean;
    player: Group;
    isHandTracking: boolean;
};
export declare const useXRFrame: (callback: (time: DOMHighResTimeStamp, xrFrame: XRFrame) => void) => void;
export declare const useController: (handedness: XRHandedness) => XRController | undefined;

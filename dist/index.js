import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import React__default, { useMemo, useContext, useRef, useEffect, forwardRef } from 'react';
import { useThree, useFrame, Canvas } from '@react-three/fiber';
import { Matrix4, Group, Object3D, SphereGeometry, MeshBasicMaterial, Mesh, Color, BoxBufferGeometry, Sphere, Box3 } from 'three';
import mergeRefs from 'react-merge-refs';
import { GLTFLoader } from 'three-stdlib';

class ARButton {
  static createButton(renderer, sessionInit = {}) {
    const button = document.createElement('button');

    function
      /*device*/
    showStartAR() {
      if (sessionInit.domOverlay === undefined) {
        const overlay = document.createElement('div');
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', 38);
        svg.setAttribute('height', 38);
        svg.style.position = 'absolute';
        svg.style.right = '20px';
        svg.style.top = '20px';
        svg.addEventListener('click', function () {
          currentSession.end();
        });
        overlay.appendChild(svg);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28');
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', 2);
        svg.appendChild(path);

        if (sessionInit.optionalFeatures === undefined) {
          sessionInit.optionalFeatures = [];
        }

        sessionInit.optionalFeatures.push('dom-overlay');
        sessionInit.domOverlay = {
          root: overlay
        };
      } //


      let currentSession = null;

      async function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);
        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(session);
        button.textContent = 'STOP AR';
        sessionInit.domOverlay.root.style.display = '';
        currentSession = session;
      }

      function
        /*event*/
      onSessionEnded() {
        currentSession.removeEventListener('end', onSessionEnded);
        button.textContent = 'START AR';
        sessionInit.domOverlay.root.style.display = 'none';
        currentSession = null;
      } //


      button.style.display = '';
      button.style.cursor = 'pointer';
      button.style.left = 'calc(50% - 50px)';
      button.style.width = '100px';
      button.textContent = 'START AR';

      button.onmouseenter = function () {
        button.style.opacity = '1.0';
      };

      button.onmouseleave = function () {
        button.style.opacity = '0.5';
      };

      button.onclick = function () {
        if (currentSession === null) {
          navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      button.style.display = '';
      button.style.cursor = 'auto';
      button.style.left = 'calc(50% - 75px)';
      button.style.width = '150px';
      button.onmouseenter = null;
      button.onmouseleave = null;
      button.onclick = null;
    }

    function showARNotSupported() {
      disableButton();
      button.textContent = 'AR NOT SUPPORTED';
    }

    function stylizeElement(element) {
      element.style.position = 'absolute';
      element.style.bottom = '20px';
      element.style.padding = '12px 6px';
      element.style.border = '1px solid #fff';
      element.style.borderRadius = '4px';
      element.style.background = 'rgba(0,0,0,0.1)';
      element.style.color = '#fff';
      element.style.font = 'normal 13px sans-serif';
      element.style.textAlign = 'center';
      element.style.opacity = '0.5';
      element.style.outline = 'none';
      element.style.zIndex = '999';
    }

    if ('xr' in navigator) {
      button.id = 'ARButton';
      button.style.display = 'none';
      stylizeElement(button);
      navigator.xr.isSessionSupported('immersive-ar').then(function (supported) {
        supported ? showStartAR() : showARNotSupported();
      }).catch(showARNotSupported);
      return button;
    } else {
      const message = document.createElement('a');

      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, 'https:');
        message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
      } else {
        message.href = 'https://immersiveweb.dev/';
        message.innerHTML = 'WEBXR NOT AVAILABLE';
      }

      message.style.left = 'calc(50% - 90px)';
      message.style.width = '180px';
      message.style.textDecoration = 'none';
      stylizeElement(message);
      return message;
    }
  }

}

class VRButton {
  static createButton(renderer, sessionInit = {}) {
    const button = document.createElement('button');

    function
      /*device*/
    showEnterVR() {
      let currentSession = null;

      async function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);
        await renderer.xr.setSession(session);
        button.textContent = 'EXIT VR';
        currentSession = session;
      }

      function
        /*event*/
      onSessionEnded() {
        currentSession.removeEventListener('end', onSessionEnded);
        button.textContent = 'ENTER VR';
        currentSession = null;
      } //


      button.style.display = '';
      button.style.cursor = 'pointer';
      button.style.left = 'calc(50% - 50px)';
      button.style.width = '100px';
      button.textContent = 'ENTER VR';

      button.onmouseenter = function () {
        button.style.opacity = '1.0';
      };

      button.onmouseleave = function () {
        button.style.opacity = '0.5';
      };

      button.onclick = function () {
        if (currentSession === null) {
          // WebXR's requestReferenceSpace only works if the corresponding feature
          // was requested at session creation time. For simplicity, just ask for
          // the interesting ones as optional features, but be aware that the
          // requestReferenceSpace call will fail if it turns out to be unavailable.
          // ('local' is always available for immersive sessions and doesn't need to
          // be requested separately.)
          const optionalFeatures = [sessionInit.optionalFeatures, 'local-floor', 'bounded-floor', 'hand-tracking'].flat().filter(Boolean);
          navigator.xr.requestSession('immersive-vr', { ...sessionInit,
            optionalFeatures
          }).then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      button.style.display = '';
      button.style.cursor = 'auto';
      button.style.left = 'calc(50% - 75px)';
      button.style.width = '150px';
      button.onmouseenter = null;
      button.onmouseleave = null;
      button.onclick = null;
    }

    function showWebXRNotFound() {
      disableButton();
      button.textContent = 'VR NOT SUPPORTED';
    }

    function stylizeElement(element) {
      element.style.position = 'absolute';
      element.style.bottom = '20px';
      element.style.padding = '12px 6px';
      element.style.border = '1px solid #fff';
      element.style.borderRadius = '4px';
      element.style.background = 'rgba(0,0,0,0.1)';
      element.style.color = '#fff';
      element.style.font = 'normal 13px sans-serif';
      element.style.textAlign = 'center';
      element.style.opacity = '0.5';
      element.style.outline = 'none';
      element.style.zIndex = '999';
    }

    if ('xr' in navigator) {
      button.id = 'VRButton';
      button.style.display = 'none';
      stylizeElement(button);
      navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
        supported ? showEnterVR() : showWebXRNotFound();
      });
      return button;
    } else {
      const message = document.createElement('a');

      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, 'https:');
        message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
      } else {
        message.href = 'https://immersiveweb.dev/';
        message.innerHTML = 'WEBXR NOT AVAILABLE';
      }

      message.style.left = 'calc(50% - 90px)';
      message.style.width = '180px';
      message.style.textDecoration = 'none';
      stylizeElement(message);
      return message;
    }
  }

}

const XRController = {
  make: (id, gl, onConnected, onDisconnected) => {
    const controller = gl.xr.getController(id);
    const grip = gl.xr.getControllerGrip(id);
    const hand = gl.xr.getHand(id);
    const xrController = {
      inputSource: undefined,
      grip,
      controller,
      hand
    };
    grip.userData.name = 'grip';
    controller.userData.name = 'controller';
    hand.userData.name = 'hand';
    controller.addEventListener('connected', event => {
      if (event.fake) {
        return;
      }

      xrController.inputSource = event.data;
      onConnected(xrController);
    });
    controller.addEventListener('disconnected', _ => {
      onDisconnected(xrController);
    });
  }
};

/**
 * Store data associated with some objects in the scene
 *
 * For example storing event handlers:
 *
 * objectA:
 *   onClick: [handler, handler]
 * objectB:
 *   onHover: [handler]
 *   onBlur:  [handler]
 *
 */
const ObjectsState = {
  make: function () {
    return new Map();
  },
  add: function (state, object, key, value) {
    if (!state.has(object)) {
      state.set(object, {
        key: [value]
      });
    }

    const entry = state.get(object);

    if (!entry[key]) {
      entry[key] = [];
    }

    entry[key].push(value);
  },
  delete: function (state, object, key, value) {
    const entry = state.get(object);
    if (!entry || !entry[key]) return;
    entry[key] = entry[key].filter(it => it !== value);

    if (entry[key].length === 0) {
      delete entry[key];
    } // Remove entry if nothing left


    if (Object.keys(entry).length === 0) {
      state.delete(object);
    }
  },
  has: function (state, object, key) {
    const entry = state.get(object);
    return !!(entry && entry[key]);
  },
  get: function (state, object, key) {
    const entry = state.get(object);
    return entry && entry[key];
  }
};

const useXREvent = (event, handler, {
  handedness
} = {}) => {
  const handlerRef = React__default.useRef(handler);
  React__default.useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  const {
    controllers: allControllers
  } = useXR();
  React__default.useEffect(() => {
    const controllers = handedness ? allControllers.filter(it => it.inputSource.handedness === handedness) : allControllers;
    const cleanups = [];
    controllers.forEach(it => {
      const listener = e => handlerRef.current({
        originalEvent: e,
        controller: it
      });

      it.controller.addEventListener(event, listener);
      cleanups.push(() => it.controller.removeEventListener(event, listener));
    });
    return () => cleanups.forEach(fn => fn());
  }, [event, allControllers, handedness]);
};

const warnAboutVRARCanvas = () => console.warn('You must provide a ARCanvas or VRCanvas as a wrapper to use interactions');

const InteractionsContext = /*#__PURE__*/React__default.createContext({
  hoverState: {},
  addInteraction: warnAboutVRARCanvas,
  removeInteraction: warnAboutVRARCanvas
});
function InteractionManager({
  children
}) {
  const state = useThree();
  const {
    controllers
  } = useXR();
  const [hoverState] = React__default.useState(() => ({
    left: new Map(),
    right: new Map(),
    none: new Map()
  }));
  const [interactions] = React__default.useState(() => ObjectsState.make());
  const addInteraction = React__default.useCallback((object, eventType, handler) => {
    ObjectsState.add(interactions, object, eventType, handler);
  }, [interactions]);
  const removeInteraction = React__default.useCallback((object, eventType, handler) => {
    ObjectsState.delete(interactions, object, eventType, handler);
  }, [interactions]);
  const intersect = React__default.useCallback(controller => {
    const objects = Array.from(interactions.keys());
    const tempMatrix = new Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    state.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    state.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    return state.raycaster.intersectObjects(objects, true);
  }, [interactions, state.raycaster]); // Trigger hover and blur events

  useFrame(() => {
    if (interactions.size === 0) {
      return;
    }

    controllers.forEach(it => {
      const {
        controller
      } = it;
      const handedness = it.inputSource.handedness;
      const hovering = hoverState[handedness];
      const hits = new Set();
      let intersections = intersect(controller);

      if (state.raycaster.filter) {
        // https://github.com/mrdoob/three.js/issues/16031
        // Allow custom userland intersect sort order
        intersections = state.raycaster.filter(intersections, state);
      } else {
        // Otherwise, filter to first hit
        const hit = intersections.find(i => i == null ? void 0 : i.object);
        if (hit) intersections = [hit];
      }

      intersections.forEach(intersection => {
        let eventObject = intersection.object;

        while (eventObject) {
          if (ObjectsState.has(interactions, eventObject, 'onHover') && !hovering.has(eventObject)) {
            var _ObjectsState$get;

            (_ObjectsState$get = ObjectsState.get(interactions, eventObject, 'onHover')) == null ? void 0 : _ObjectsState$get.forEach(handler => handler({
              controller: it,
              intersection
            }));
          }

          hovering.set(eventObject, intersection);
          hits.add(eventObject.id);
          eventObject = eventObject.parent;
        }
      }); // Trigger blur on all the object that were hovered in the previous frame
      // but missed in this one

      for (const eventObject of hovering.keys()) {
        if (!hits.has(eventObject.id)) {
          var _ObjectsState$get2;

          (_ObjectsState$get2 = ObjectsState.get(interactions, eventObject, 'onBlur')) == null ? void 0 : _ObjectsState$get2.forEach(handler => handler({
            controller: it
          }));
          hovering.delete(eventObject);
        }
      }
    });
  });

  const triggerEvent = interaction => e => {
    const hovering = hoverState[e.controller.inputSource.handedness];

    for (const hovered of hovering.keys()) {
      var _ObjectsState$get3;

      (_ObjectsState$get3 = ObjectsState.get(interactions, hovered, interaction)) == null ? void 0 : _ObjectsState$get3.forEach(handler => handler({
        controller: e.controller,
        intersection: hovering.get(hovered)
      }));
    }
  };

  useXREvent('select', triggerEvent('onSelect'));
  useXREvent('selectstart', triggerEvent('onSelectStart'));
  useXREvent('selectend', triggerEvent('onSelectEnd'));
  useXREvent('squeeze', triggerEvent('onSqueeze'));
  useXREvent('squeezeend', triggerEvent('onSqueezeEnd'));
  useXREvent('squeezestart', triggerEvent('onSqueezeStart'));
  const contextValue = useMemo(() => ({
    addInteraction,
    removeInteraction,
    hoverState
  }), [addInteraction, removeInteraction, hoverState]);
  return /*#__PURE__*/React__default.createElement(InteractionsContext.Provider, {
    value: contextValue
  }, children);
}
const useInteraction = (ref, type, handler) => {
  const {
    addInteraction,
    removeInteraction
  } = useContext(InteractionsContext);
  const isPresent = handler !== undefined;
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!isPresent) return;

    const handlerFn = e => {
      handlerRef.current == null ? void 0 : handlerRef.current(e);
    };

    addInteraction(ref.current, type, handlerFn);
    const maybeRef = ref.current;
    return () => removeInteraction(maybeRef, type, handlerFn);
  }, [type, addInteraction, removeInteraction, isPresent, ref]);
};
const Interactive = /*#__PURE__*/forwardRef((props, passedRef) => {
  const ref = useRef();
  useInteraction(ref, 'onHover', props.onHover);
  useInteraction(ref, 'onBlur', props.onBlur);
  useInteraction(ref, 'onSelectStart', props.onSelectStart);
  useInteraction(ref, 'onSelectEnd', props.onSelectEnd);
  useInteraction(ref, 'onSelect', props.onSelect);
  useInteraction(ref, 'onSqueezeStart', props.onSqueezeStart);
  useInteraction(ref, 'onSqueezeEnd', props.onSqueezeEnd);
  useInteraction(ref, 'onSqueeze', props.onSqueeze);
  return /*#__PURE__*/React__default.createElement("group", {
    ref: mergeRefs([passedRef, ref])
  }, props.children);
});
function RayGrab({
  children
}) {
  const grabbingController = useRef();
  const groupRef = useRef();
  const previousTransform = useRef(undefined);
  useXREvent('selectend', e => {
    if (e.controller.controller === grabbingController.current) {
      grabbingController.current = undefined;
      previousTransform.current = undefined;
    }
  });
  useFrame(() => {
    if (!grabbingController.current || !previousTransform.current || !groupRef.current) {
      return;
    }

    const controller = grabbingController.current;
    const group = groupRef.current;
    group.applyMatrix4(previousTransform.current);
    group.applyMatrix4(controller.matrixWorld);
    group.updateWorldMatrix(false, true);
    previousTransform.current = controller.matrixWorld.clone().invert();
  });
  return /*#__PURE__*/React__default.createElement(Interactive, {
    ref: groupRef,
    onSelectStart: e => {
      grabbingController.current = e.controller.controller;
      previousTransform.current = e.controller.controller.matrixWorld.clone().invert();
    }
  }, children);
}

const XRContext = /*#__PURE__*/React.createContext({});

const useControllers = group => {
  const {
    gl
  } = useThree();
  const [controllers, setControllers] = React.useState([]);
  React.useEffect(() => {
    const ids = [0, 1];
    ids.forEach(id => {
      XRController.make(id, gl, controller => {
        group.add(controller.controller);
        group.add(controller.grip);
        group.add(controller.hand);
        setControllers(it => [...it, controller]);
      }, controller => {
        group.remove(controller.controller);
        group.remove(controller.grip);
        group.remove(controller.hand);
        setControllers(existing => existing.filter(it => it !== controller));
      });
    });
  }, [gl, group]);
  return controllers;
};

function useHitTest(hitTestCallback) {
  const {
    gl
  } = useThree();
  const hitTestSource = React.useRef();
  const hitTestSourceRequested = React.useRef(false);
  const [hitMatrix] = React.useState(() => new Matrix4());
  useFrame(() => {
    if (!gl.xr.isPresenting) return;
    const session = gl.xr.getSession();
    if (!session) return;

    if (!hitTestSourceRequested.current) {
      session.requestReferenceSpace('viewer').then(referenceSpace => {
        session.requestHitTestSource({
          space: referenceSpace
        }).then(source => {
          hitTestSource.current = source;
        });
      });
      session.addEventListener('end', () => {
        hitTestSourceRequested.current = false;
        hitTestSource.current = undefined;
      }, {
        once: true
      });
      hitTestSourceRequested.current = true;
    }

    if (hitTestSource.current && gl.xr.isPresenting) {
      const referenceSpace = gl.xr.getReferenceSpace();

      if (referenceSpace) {
        // This raf is unnecesary, we should get XRFrame from r3f but it's not implemented yet
        session.requestAnimationFrame((time, frame) => {
          const hitTestResults = frame.getHitTestResults(hitTestSource.current);

          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);

            if (pose) {
              hitMatrix.fromArray(pose.transform.matrix);
              hitTestCallback(hitMatrix, hit);
            }
          }
        });
      }
    }
  });
}
function XR({
  foveation = 0,
  children
}) {
  const {
    gl,
    camera
  } = useThree();
  const [isPresenting, setIsPresenting] = React.useState(() => gl.xr.isPresenting);
  const [isHandTracking, setHandTracking] = React.useState(false);
  const [player] = React.useState(() => new Group());
  const controllers = useControllers(player);
  React.useEffect(() => {
    const xr = gl.xr;

    const handleSessionChange = () => setIsPresenting(xr.isPresenting);

    xr.addEventListener('sessionstart', handleSessionChange);
    xr.addEventListener('sessionend', handleSessionChange);
    return () => {
      xr.removeEventListener('sessionstart', handleSessionChange);
      xr.removeEventListener('sessionend', handleSessionChange);
    };
  }, [gl]);
  React.useEffect(() => {
    const xr = gl.xr;

    if (xr.setFoveation) {
      xr.setFoveation(foveation);
    }
  }, [gl, foveation]);
  React.useEffect(() => {
    var _session$inputSources;

    const session = gl.xr.getSession();

    const handleInputSourcesChange = event => setHandTracking(Object.values(event.session.inputSources).some(source => source.hand));

    session == null ? void 0 : session.addEventListener('inputsourceschange', handleInputSourcesChange);
    setHandTracking(Object.values((_session$inputSources = session == null ? void 0 : session.inputSources) != null ? _session$inputSources : []).some(source => source.hand));
    return () => {
      session == null ? void 0 : session.removeEventListener('inputsourceschange', handleInputSourcesChange);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresenting]);
  const value = React.useMemo(() => ({
    controllers,
    isPresenting,
    isHandTracking,
    player
  }), [controllers, isPresenting, isHandTracking, player]);
  return /*#__PURE__*/React.createElement(XRContext.Provider, {
    value: value
  }, /*#__PURE__*/React.createElement("primitive", {
    object: player,
    dispose: null
  }, /*#__PURE__*/React.createElement("primitive", {
    object: camera,
    dispose: null
  })), children);
}

function XRCanvas({
  foveation,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Canvas, _extends({
    vr: true
  }, rest), /*#__PURE__*/React.createElement(XR, {
    foveation: foveation
  }, /*#__PURE__*/React.createElement(InteractionManager, null, children)));
}

function useXRButton(mode, gl, sessionInit, container) {
  const button = React.useMemo(() => {
    const target = mode === 'AR' ? ARButton : VRButton;
    return target.createButton(gl, sessionInit);
  }, [mode, gl, sessionInit]);
  React.useLayoutEffect(() => {
    var _container$current;

    const parent = (_container$current = container == null ? void 0 : container.current) != null ? _container$current : document.body;
    parent.appendChild(button);
    return () => void parent.removeChild(button); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button]);
  return button;
}
function XRButton({
  mode,
  sessionInit
}) {
  const gl = useThree(state => state.gl);
  useXRButton(mode, gl, sessionInit);
  return null;
}
function VRCanvas({
  children,
  sessionInit,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(XRCanvas, rest, /*#__PURE__*/React.createElement(XRButton, {
    mode: "VR",
    sessionInit: sessionInit
  }), children);
}
function ARCanvas({
  children,
  sessionInit,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(XRCanvas, rest, /*#__PURE__*/React.createElement(XRButton, {
    mode: "AR",
    sessionInit: sessionInit
  }), children);
}
const useXR = () => {
  const xrValue = React.useContext(XRContext);
  const interactionsValue = React.useContext(InteractionsContext);
  const contextValue = React.useMemo(() => ({ ...xrValue,
    ...interactionsValue
  }), [xrValue, interactionsValue]);
  return contextValue;
};
/**
 * @deprecated R3F v8's built-in `useFrame` extends the `XRSession.requestAnimationFrame` signature:
 *
 * `useFrame((state, delta, xrFrame) => void)`
 *
 * @see https://mdn.io/XRFrame
 */

const useXRFrame = callback => {
  const {
    gl
  } = useThree();
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const loop = React.useCallback((time, xrFrame) => {
    if (previousTimeRef.current !== undefined) {
      callback(time, xrFrame);
    }

    previousTimeRef.current = time;
    requestRef.current = gl.xr.getSession().requestAnimationFrame(loop);
  }, [gl.xr, callback]);
  React.useEffect(() => {
    const handleSessionChange = () => {
      var _gl$xr;

      if (!((_gl$xr = gl.xr) != null && _gl$xr.isPresenting)) return;

      if (requestRef.current) {
        gl.xr.getSession().cancelAnimationFrame(requestRef.current);
      }

      requestRef.current = gl.xr.getSession().requestAnimationFrame(loop);
    };

    handleSessionChange();
    gl.xr.addEventListener('sessionstart', handleSessionChange);
    gl.xr.addEventListener('sessionend', handleSessionChange);
    return () => {
      gl.xr.removeEventListener('sessionstart', handleSessionChange);
      gl.xr.removeEventListener('sessionend', handleSessionChange);

      if (requestRef.current) {
        gl.xr.getSession().cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loop, gl.xr]);
};
const useController = handedness => {
  const {
    controllers
  } = useXR();
  const controller = React.useMemo(() => controllers.find(it => it.inputSource.handedness === handedness), [handedness, controllers]);
  return controller;
};

/**
 * @webxr-input-profiles/motion-controllers 1.0.0 https://github.com/immersive-web/webxr-input-profiles
 */
const MotionControllerConstants = {
  Handedness: Object.freeze({
    NONE: 'none',
    LEFT: 'left',
    RIGHT: 'right'
  }),
  ComponentState: Object.freeze({
    DEFAULT: 'default',
    TOUCHED: 'touched',
    PRESSED: 'pressed'
  }),
  ComponentProperty: Object.freeze({
    BUTTON: 'button',
    X_AXIS: 'xAxis',
    Y_AXIS: 'yAxis',
    STATE: 'state'
  }),
  ComponentType: Object.freeze({
    TRIGGER: 'trigger',
    SQUEEZE: 'squeeze',
    TOUCHPAD: 'touchpad',
    THUMBSTICK: 'thumbstick',
    BUTTON: 'button'
  }),
  ButtonTouchThreshold: 0.05,
  AxisTouchThreshold: 0.1,
  VisualResponseProperty: Object.freeze({
    TRANSFORM: 'transform',
    VISIBILITY: 'visibility'
  })
};
/**
 * @description Static helper function to fetch a JSON file and turn it into a JS object
 * @param {string} path - Path to JSON file to be fetched
 */

async function fetchJsonFile(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    return response.json();
  }
}

async function fetchProfilesList(basePath) {
  if (!basePath) {
    throw new Error('No basePath supplied');
  }

  const profileListFileName = 'profilesList.json';
  const profilesList = await fetchJsonFile(`${basePath}/${profileListFileName}`);
  return profilesList;
}

async function fetchProfile(xrInputSource, basePath, defaultProfile = null, getAssetPath = true) {
  if (!xrInputSource) {
    throw new Error('No xrInputSource supplied');
  }

  if (!basePath) {
    throw new Error('No basePath supplied');
  } // Get the list of profiles


  const supportedProfilesList = await fetchProfilesList(basePath); // Find the relative path to the first requested profile that is recognized

  let match;
  xrInputSource.profiles.some(profileId => {
    const supportedProfile = supportedProfilesList[profileId];

    if (supportedProfile) {
      match = {
        profileId,
        profilePath: `${basePath}/${supportedProfile.path}`,
        deprecated: !!supportedProfile.deprecated
      };
    }

    return !!match;
  });

  if (!match) {
    if (!defaultProfile) {
      throw new Error('No matching profile name found');
    }

    const supportedProfile = supportedProfilesList[defaultProfile];

    if (!supportedProfile) {
      throw new Error(`No matching profile name found and default profile "${defaultProfile}" missing.`);
    }

    match = {
      profileId: defaultProfile,
      profilePath: `${basePath}/${supportedProfile.path}`,
      deprecated: !!supportedProfile.deprecated
    };
  }

  const profile = await fetchJsonFile(match.profilePath);
  let assetPath;

  if (getAssetPath) {
    let layout;

    if (xrInputSource.handedness === 'any') {
      layout = profile.layouts[Object.keys(profile.layouts)[0]];
    } else {
      layout = profile.layouts[xrInputSource.handedness];
    }

    if (!layout) {
      throw new Error(`No matching handedness, ${xrInputSource.handedness}, in profile ${match.profileId}`);
    }

    if (layout.assetPath) {
      assetPath = match.profilePath.replace('profile.json', layout.assetPath);
    }
  }

  return {
    profile,
    assetPath
  };
}
/** @constant {Object} */


const defaultComponentValues = {
  xAxis: 0,
  yAxis: 0,
  button: 0,
  state: MotionControllerConstants.ComponentState.DEFAULT
};
/**
 * @description Converts an X, Y coordinate from the range -1 to 1 (as reported by the Gamepad
 * API) to the range 0 to 1 (for interpolation). Also caps the X, Y values to be bounded within
 * a circle. This ensures that thumbsticks are not animated outside the bounds of their physical
 * range of motion and touchpads do not report touch locations off their physical bounds.
 * @param {number} x The original x coordinate in the range -1 to 1
 * @param {number} y The original y coordinate in the range -1 to 1
 */

function normalizeAxes(x = 0, y = 0) {
  let xAxis = x;
  let yAxis = y; // Determine if the point is outside the bounds of the circle
  // and, if so, place it on the edge of the circle

  const hypotenuse = Math.sqrt(x * x + y * y);

  if (hypotenuse > 1) {
    const theta = Math.atan2(y, x);
    xAxis = Math.cos(theta);
    yAxis = Math.sin(theta);
  } // Scale and move the circle so values are in the interpolation range.  The circle's origin moves
  // from (0, 0) to (0.5, 0.5). The circle's radius scales from 1 to be 0.5.


  const result = {
    normalizedXAxis: xAxis * 0.5 + 0.5,
    normalizedYAxis: yAxis * 0.5 + 0.5
  };
  return result;
}
/**
 * Contains the description of how the 3D model should visually respond to a specific user input.
 * This is accomplished by initializing the object with the name of a node in the 3D model and
 * property that need to be modified in response to user input, the name of the nodes representing
 * the allowable range of motion, and the name of the input which triggers the change. In response
 * to the named input changing, this object computes the appropriate weighting to use for
 * interpolating between the range of motion nodes.
 */


class VisualResponse {
  constructor(visualResponseDescription) {
    this.componentProperty = visualResponseDescription.componentProperty;
    this.states = visualResponseDescription.states;
    this.valueNodeName = visualResponseDescription.valueNodeName;
    this.valueNodeProperty = visualResponseDescription.valueNodeProperty;

    if (this.valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM) {
      this.minNodeName = visualResponseDescription.minNodeName;
      this.maxNodeName = visualResponseDescription.maxNodeName;
    } // Initializes the response's current value based on default data


    this.value = 0;
    this.updateFromComponent(defaultComponentValues);
  }
  /**
   * Computes the visual response's interpolation weight based on component state
   * @param {Object} componentValues - The component from which to update
   * @param {number} xAxis - The reported X axis value of the component
   * @param {number} yAxis - The reported Y axis value of the component
   * @param {number} button - The reported value of the component's button
   * @param {string} state - The component's active state
   */


  updateFromComponent({
    xAxis,
    yAxis,
    button,
    state
  }) {
    const {
      normalizedXAxis,
      normalizedYAxis
    } = normalizeAxes(xAxis, yAxis);

    switch (this.componentProperty) {
      case MotionControllerConstants.ComponentProperty.X_AXIS:
        this.value = this.states.includes(state) ? normalizedXAxis : 0.5;
        break;

      case MotionControllerConstants.ComponentProperty.Y_AXIS:
        this.value = this.states.includes(state) ? normalizedYAxis : 0.5;
        break;

      case MotionControllerConstants.ComponentProperty.BUTTON:
        this.value = this.states.includes(state) ? button : 0;
        break;

      case MotionControllerConstants.ComponentProperty.STATE:
        if (this.valueNodeProperty === MotionControllerConstants.VisualResponseProperty.VISIBILITY) {
          this.value = this.states.includes(state);
        } else {
          this.value = this.states.includes(state) ? 1.0 : 0.0;
        }

        break;

      default:
        throw new Error(`Unexpected visualResponse componentProperty ${this.componentProperty}`);
    }
  }

}

class Component {
  /**
   * @param {Object} componentId - Id of the component
   * @param {Object} componentDescription - Description of the component to be created
   */
  constructor(componentId, componentDescription) {
    if (!componentId || !componentDescription || !componentDescription.visualResponses || !componentDescription.gamepadIndices || Object.keys(componentDescription.gamepadIndices).length === 0) {
      throw new Error('Invalid arguments supplied');
    }

    this.id = componentId;
    this.type = componentDescription.type;
    this.rootNodeName = componentDescription.rootNodeName;
    this.touchPointNodeName = componentDescription.touchPointNodeName; // Build all the visual responses for this component

    this.visualResponses = {};
    Object.keys(componentDescription.visualResponses).forEach(responseName => {
      const visualResponse = new VisualResponse(componentDescription.visualResponses[responseName]);
      this.visualResponses[responseName] = visualResponse;
    }); // Set default values

    this.gamepadIndices = Object.assign({}, componentDescription.gamepadIndices);
    this.values = {
      state: MotionControllerConstants.ComponentState.DEFAULT,
      button: this.gamepadIndices.button !== undefined ? 0 : undefined,
      xAxis: this.gamepadIndices.xAxis !== undefined ? 0 : undefined,
      yAxis: this.gamepadIndices.yAxis !== undefined ? 0 : undefined
    };
  }

  get data() {
    const data = {
      id: this.id,
      ...this.values
    };
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   * @param {Object} gamepad - The gamepad object from which the component data should be polled
   */


  updateFromGamepad(gamepad) {
    // Set the state to default before processing other data sources
    this.values.state = MotionControllerConstants.ComponentState.DEFAULT; // Get and normalize button

    if (this.gamepadIndices.button !== undefined && gamepad.buttons.length > this.gamepadIndices.button) {
      const gamepadButton = gamepad.buttons[this.gamepadIndices.button];
      this.values.button = gamepadButton.value;
      this.values.button = this.values.button < 0 ? 0 : this.values.button;
      this.values.button = this.values.button > 1 ? 1 : this.values.button; // Set the state based on the button

      if (gamepadButton.pressed || this.values.button === 1) {
        this.values.state = MotionControllerConstants.ComponentState.PRESSED;
      } else if (gamepadButton.touched || this.values.button > MotionControllerConstants.ButtonTouchThreshold) {
        this.values.state = MotionControllerConstants.ComponentState.TOUCHED;
      }
    } // Get and normalize x axis value


    if (this.gamepadIndices.xAxis !== undefined && gamepad.axes.length > this.gamepadIndices.xAxis) {
      this.values.xAxis = gamepad.axes[this.gamepadIndices.xAxis];
      this.values.xAxis = this.values.xAxis < -1 ? -1 : this.values.xAxis;
      this.values.xAxis = this.values.xAxis > 1 ? 1 : this.values.xAxis; // If the state is still default, check if the xAxis makes it touched

      if (this.values.state === MotionControllerConstants.ComponentState.DEFAULT && Math.abs(this.values.xAxis) > MotionControllerConstants.AxisTouchThreshold) {
        this.values.state = MotionControllerConstants.ComponentState.TOUCHED;
      }
    } // Get and normalize Y axis value


    if (this.gamepadIndices.yAxis !== undefined && gamepad.axes.length > this.gamepadIndices.yAxis) {
      this.values.yAxis = gamepad.axes[this.gamepadIndices.yAxis];
      this.values.yAxis = this.values.yAxis < -1 ? -1 : this.values.yAxis;
      this.values.yAxis = this.values.yAxis > 1 ? 1 : this.values.yAxis; // If the state is still default, check if the yAxis makes it touched

      if (this.values.state === MotionControllerConstants.ComponentState.DEFAULT && Math.abs(this.values.yAxis) > MotionControllerConstants.AxisTouchThreshold) {
        this.values.state = MotionControllerConstants.ComponentState.TOUCHED;
      }
    } // Update the visual response weights based on the current component data


    Object.values(this.visualResponses).forEach(visualResponse => {
      visualResponse.updateFromComponent(this.values);
    });
  }

}
/**
 * @description Builds a motion controller with components and visual responses based on the
 * supplied profile description. Data is polled from the xrInputSource's gamepad.
 * @author Nell Waliczek / https://github.com/NellWaliczek
 */


class MotionController {
  /**
   * @param {Object} xrInputSource - The XRInputSource to build the MotionController around
   * @param {Object} profile - The best matched profile description for the supplied xrInputSource
   * @param {Object} assetUrl
   */
  constructor(xrInputSource, profile, assetUrl) {
    if (!xrInputSource) {
      throw new Error('No xrInputSource supplied');
    }

    if (!profile) {
      throw new Error('No profile supplied');
    }

    this.xrInputSource = xrInputSource;
    this.assetUrl = assetUrl;
    this.id = profile.profileId; // Build child components as described in the profile description

    this.layoutDescription = profile.layouts[xrInputSource.handedness];
    this.components = {};
    Object.keys(this.layoutDescription.components).forEach(componentId => {
      const componentDescription = this.layoutDescription.components[componentId];
      this.components[componentId] = new Component(componentId, componentDescription);
    }); // Initialize components based on current gamepad state

    this.updateFromGamepad();
  }

  get gripSpace() {
    return this.xrInputSource.gripSpace;
  }

  get targetRaySpace() {
    return this.xrInputSource.targetRaySpace;
  }
  /**
   * @description Returns a subset of component data for simplified debugging
   */


  get data() {
    const data = [];
    Object.values(this.components).forEach(component => {
      data.push(component.data);
    });
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   */


  updateFromGamepad() {
    Object.values(this.components).forEach(component => {
      component.updateFromGamepad(this.xrInputSource.gamepad);
    });
  }

}

const DEFAULT_PROFILES_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles';
const DEFAULT_PROFILE = 'generic-trigger';

class XRControllerModel extends Object3D {
  constructor() {
    super();
    this.motionController = null;
    this.envMap = null;
  }

  setEnvironmentMap(envMap) {
    if (this.envMap == envMap) {
      return this;
    }

    this.envMap = envMap;
    this.traverse(child => {
      if (child.isMesh) {
        child.material.envMap = this.envMap;
        child.material.needsUpdate = true;
      }
    });
    return this;
  }
  /**
   * Polls data from the XRInputSource and updates the model's components to match
   * the real world data
   */


  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    if (!this.motionController) return; // Cause the MotionController to poll the Gamepad for data

    this.motionController.updateFromGamepad(); // Update the 3D model to reflect the button, thumbstick, and touchpad state

    Object.values(this.motionController.components).forEach(component => {
      // Update node data based on the visual responses' current states
      Object.values(component.visualResponses).forEach(visualResponse => {
        const {
          valueNode,
          minNode,
          maxNode,
          value,
          valueNodeProperty
        } = visualResponse; // Skip if the visual response node is not found. No error is needed,
        // because it will have been reported at load time.

        if (!valueNode) return; // Calculate the new properties based on the weight supplied

        if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.VISIBILITY) {
          valueNode.visible = value;
        } else if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM) {
          valueNode.quaternion.slerpQuaternions(minNode.quaternion, maxNode.quaternion, value);
          valueNode.position.lerpVectors(minNode.position, maxNode.position, value);
        }
      });
    });
  }

}
/**
 * Walks the model's tree to find the nodes needed to animate the components and
 * saves them to the motionContoller components for use in the frame loop. When
 * touchpads are found, attaches a touch dot to them.
 */


function findNodes(motionController, scene) {
  // Loop through the components and find the nodes needed for each components' visual responses
  Object.values(motionController.components).forEach(component => {
    const {
      type,
      touchPointNodeName,
      visualResponses
    } = component;

    if (type === MotionControllerConstants.ComponentType.TOUCHPAD) {
      component.touchPointNode = scene.getObjectByName(touchPointNodeName);

      if (component.touchPointNode) {
        // Attach a touch dot to the touchpad.
        const sphereGeometry = new SphereGeometry(0.001);
        const material = new MeshBasicMaterial({
          color: 0x0000ff
        });
        const sphere = new Mesh(sphereGeometry, material);
        component.touchPointNode.add(sphere);
      } else {
        console.warn(`Could not find touch dot, ${component.touchPointNodeName}, in touchpad component ${component.id}`);
      }
    } // Loop through all the visual responses to be applied to this component


    Object.values(visualResponses).forEach(visualResponse => {
      const {
        valueNodeName,
        minNodeName,
        maxNodeName,
        valueNodeProperty
      } = visualResponse; // If animating a transform, find the two nodes to be interpolated between.

      if (valueNodeProperty === MotionControllerConstants.VisualResponseProperty.TRANSFORM) {
        visualResponse.minNode = scene.getObjectByName(minNodeName);
        visualResponse.maxNode = scene.getObjectByName(maxNodeName); // If the extents cannot be found, skip this animation

        if (!visualResponse.minNode) {
          console.warn(`Could not find ${minNodeName} in the model`);
          return;
        }

        if (!visualResponse.maxNode) {
          console.warn(`Could not find ${maxNodeName} in the model`);
          return;
        }
      } // If the target node cannot be found, skip this animation


      visualResponse.valueNode = scene.getObjectByName(valueNodeName);

      if (!visualResponse.valueNode) {
        console.warn(`Could not find ${valueNodeName} in the model`);
      }
    });
  });
}

function addAssetSceneToControllerModel(controllerModel, scene) {
  // Find the nodes needed for animation and cache them on the motionController.
  findNodes(controllerModel.motionController, scene); // Apply any environment map that the mesh already has set.

  if (controllerModel.envMap) {
    scene.traverse(child => {
      if (child.isMesh) {
        child.material.envMap = controllerModel.envMap;
        child.material.needsUpdate = true;
      }
    });
  } // Add the glTF scene to the controllerModel.


  controllerModel.add(scene);
}

class XRControllerModelFactory {
  constructor(gltfLoader = null) {
    this.gltfLoader = gltfLoader;
    this.path = DEFAULT_PROFILES_PATH;
    this._assetCache = {}; // If a GLTFLoader wasn't supplied to the constructor create a new one.

    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
    }
  }

  createControllerModel(controller) {
    const controllerModel = new XRControllerModel();
    let scene = null;
    controller.addEventListener('connected', event => {
      const xrInputSource = event.data;
      if (xrInputSource.targetRayMode !== 'tracked-pointer' || !xrInputSource.gamepad) return;
      fetchProfile(xrInputSource, this.path, DEFAULT_PROFILE).then(({
        profile,
        assetPath
      }) => {
        controllerModel.motionController = new MotionController(xrInputSource, profile, assetPath);
        const cachedAsset = this._assetCache[controllerModel.motionController.assetUrl];

        if (cachedAsset) {
          scene = cachedAsset.scene.clone();
          addAssetSceneToControllerModel(controllerModel, scene);
        } else {
          if (!this.gltfLoader) {
            throw new Error('GLTFLoader not set.');
          }

          this.gltfLoader.setPath('');
          this.gltfLoader.load(controllerModel.motionController.assetUrl, asset => {
            this._assetCache[controllerModel.motionController.assetUrl] = asset;
            scene = asset.scene.clone();
            addAssetSceneToControllerModel(controllerModel, scene);
          }, null, () => {
            throw new Error(`Asset ${controllerModel.motionController.assetUrl} missing or malformed.`);
          });
        }
      }).catch(err => {
        console.warn(err);
      });
    });
    controller.addEventListener('disconnected', () => {
      controllerModel.motionController = null;
      controllerModel.remove(scene);
      scene = null;
    });
    return controllerModel;
  }

}

const modelFactory = new XRControllerModelFactory();
const modelCache = new WeakMap();
function DefaultXRControllers({
  rayMaterial = {}
}) {
  const {
    scene
  } = useThree();
  const {
    controllers,
    hoverState
  } = useXR();
  const [rays] = React__default.useState(new Map()); // Show ray line when hovering objects

  useFrame(() => {
    controllers.forEach(it => {
      const ray = rays.get(it.controller.id);
      if (!ray) return;
      const intersection = hoverState[it.inputSource.handedness].values().next().value;

      if (!intersection || it.inputSource.handedness === 'none') {
        ray.visible = false;
        return;
      }

      const rayLength = intersection.distance; // Tiny offset to clip ray on AR devices
      // that don't have handedness set to 'none'

      const offset = -0.01;
      ray.visible = true;
      ray.scale.y = rayLength + offset;
      ray.position.z = -rayLength / 2 - offset;
    });
  });
  useEffect(() => {
    const cleanups = [];
    controllers.forEach(({
      controller,
      grip,
      inputSource
    }) => {
      // Attach 3D model of the controller
      let model;

      if (modelCache.has(controller)) {
        model = modelCache.get(controller);
      } else {
        model = modelFactory.createControllerModel(controller);
        controller.dispatchEvent({
          type: 'connected',
          data: inputSource,
          fake: true
        });
        modelCache.set(controller, model);
      }

      grip.add(model); // Add Ray line (used for hovering)

      const ray = new Mesh();
      ray.rotation.set(Math.PI / 2, 0, 0);
      ray.material = new MeshBasicMaterial({
        color: new Color(0xffffff),
        opacity: 0.8,
        transparent: true,
        ...rayMaterial
      });
      ray.geometry = new BoxBufferGeometry(0.002, 1, 0.002);
      rays.set(controller.id, ray);
      controller.add(ray);
      cleanups.push(() => {
        grip.remove(model);
        controller.remove(ray);
        rays.delete(controller.id);
      });
    });
    return () => {
      cleanups.forEach(fn => fn());
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controllers, scene, rays, JSON.stringify(rayMaterial)]);
  return null;
}

const DEFAULT_HAND_PROFILE_PATH = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/';

class XRHandMeshModel {
  constructor(handModel, controller, path, handedness, customModel) {
    this.controller = controller;
    this.handModel = handModel;
    this.bones = [];
    const loader = new GLTFLoader();
    if (!customModel) loader.setPath(path || DEFAULT_HAND_PROFILE_PATH);
    loader.load(customModel != null ? customModel : `${handedness}.glb`, gltf => {
      const object = gltf.scene.children[0];
      this.handModel.add(object);
      const mesh = object.getObjectByProperty('type', 'SkinnedMesh');
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material.side = 0; // Workaround: force FrontSide

      const joints = ['wrist', 'thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip', 'index-finger-metacarpal', 'index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal', 'index-finger-tip', 'middle-finger-metacarpal', 'middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal', 'middle-finger-tip', 'ring-finger-metacarpal', 'ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal', 'ring-finger-tip', 'pinky-finger-metacarpal', 'pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal', 'pinky-finger-tip'];
      joints.forEach(jointName => {
        const bone = object.getObjectByName(jointName);

        if (bone !== undefined) {
          bone.jointName = jointName;
        } else {
          console.warn(`Couldn't find ${jointName} in ${handedness} hand mesh`);
        }

        this.bones.push(bone);
      });
    });
  }

  updateMesh() {
    // XR Joints
    const XRJoints = this.controller.joints;

    for (let i = 0; i < this.bones.length; i++) {
      const bone = this.bones[i];

      if (bone) {
        const XRJoint = XRJoints[bone.jointName];

        if (XRJoint.visible) {
          const position = XRJoint.position;

          if (bone) {
            bone.position.copy(position);
            bone.quaternion.copy(XRJoint.quaternion); // bone.scale.setScalar( XRJoint.jointRadius || defaultRadius );
          }
        }
      }
    }
  }

  dispose() {
    this.handModel.traverse(node => {
      if (!node) return;

      if (node.type !== 'Scene') {
        node.dispose == null ? void 0 : node.dispose(); // Dispose of its properties as well

        for (const property in node) {
          if (property.dispose) property.dispose == null ? void 0 : property.dispose();
          delete node[property];
        }
      }
    });
    this.bones = [];
  }

}

const TOUCH_RADIUS = 0.01;
const POINTING_JOINT = 'index-finger-tip';

class HandModel extends Object3D {
  constructor(controller, customModels) {
    super();
    this.controller = controller;
    this.motionController = null;
    this.envMap = null;
    this.mesh = null;
    controller.addEventListener('connected', event => {
      const xrInputSource = event.data;

      if (xrInputSource.hand && !this.motionController) {
        this.xrInputSource = xrInputSource;
        this.motionController = new XRHandMeshModel(this, controller, this.path, xrInputSource.handedness, xrInputSource.handedness === 'left' ? customModels[0] : customModels[1]);
      }
    });
    controller.addEventListener('disconnected', () => {
      this.dispose();
    });
  }

  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);

    if (this.motionController) {
      this.motionController.updateMesh();
    }
  }

  getPointerPosition() {
    const indexFingerTip = this.controller.joints[POINTING_JOINT];

    if (indexFingerTip) {
      return indexFingerTip.position;
    } else {
      return null;
    }
  }

  intersectBoxObject(boxObject) {
    const pointerPosition = this.getPointerPosition();

    if (pointerPosition) {
      const indexSphere = new Sphere(pointerPosition, TOUCH_RADIUS);
      const box = new Box3().setFromObject(boxObject);
      return indexSphere.intersectsBox(box);
    } else {
      return false;
    }
  }

  checkButton(button) {
    if (this.intersectBoxObject(button)) {
      button.onPress();
    } else {
      button.onClear();
    }

    if (button.isPressed()) {
      button.whilePressed();
    }
  }

  dispose() {
    var _this$motionControlle, _this$motionControlle2;

    this.clear();
    if (this.motionController) (_this$motionControlle = (_this$motionControlle2 = this.motionController).dispose) == null ? void 0 : _this$motionControlle.call(_this$motionControlle2);
    this.motionController = null;
  }

}

function Hands(props) {
  const {
    scene,
    gl
  } = useThree();
  const {
    controllers
  } = useXR();
  useEffect(() => {
    controllers.forEach(({
      hand,
      inputSource
    }) => {
      const handModel = hand.children.find(child => child instanceof HandModel);

      if (handModel) {
        hand.remove(handModel);
        handModel.dispose();
      }

      hand.add(new HandModel(hand, [props.modelLeft, props.modelRight])); // throwing fake event for the Oculus Hand Model so it starts loading

      hand.dispatchEvent({
        type: 'connected',
        data: inputSource,
        fake: true
      });
    });
    return () => {
      controllers.forEach(({
        hand
      }) => {
        const handModel = hand.children.find(child => child instanceof HandModel);

        if (handModel) {
          hand.remove(handModel);
          handModel.dispose();
        }
      });
    };
  }, [scene, gl, controllers, props.modelLeft, props.modelRight]);
  return null;
}

export { ARCanvas, DefaultXRControllers, Hands, InteractionManager, InteractionsContext, Interactive, RayGrab, VRCanvas, XR, XRButton, XRController, useController, useHitTest, useInteraction, useXR, useXRButton, useXREvent, useXRFrame };

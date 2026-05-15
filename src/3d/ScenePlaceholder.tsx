/**
 * React Three Fiber scene placeholder.
 *
 * Architecture-only: this component reserves the DOM mount point and
 * intentionally renders nothing visible. When ready:
 *   1. `bun add three @react-three/fiber @react-three/drei`
 *   2. Replace the empty <div> below with a <Canvas> hosting your scene.
 *
 * The HeroCinematic section exposes <div id="three-canvas-root" /> as the
 * canonical mount target so the same scene can be reused across brands.
 */

export interface ScenePlaceholderProps {
  /** Optional id of the canvas root. Defaults to `three-canvas-root`. */
  rootId?: string;
}

export function ScenePlaceholder({ rootId = "three-canvas-root" }: ScenePlaceholderProps) {
  return (
    <div
      id={rootId}
      aria-hidden="true"
      data-three-canvas-root
      className="pointer-events-none absolute inset-0"
    />
  );
}

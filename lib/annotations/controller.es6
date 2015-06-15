export function Controller(name) {
  return function decorator(target) {
    if (target.registerArtifact) {
      throw new Error('registerArtifact is reserved Interstellar method name.');
    }

    target.registerArtifact = (mod) => {
      mod.controller(name, target);
    }
  }
}

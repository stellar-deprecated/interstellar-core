export function Inject(...dependencies) {
  return function decorator(target) {
    target.$inject = dependencies;
  }
}

import CONFIG from "../consts/config";

export function transDepsToArray(name) {
  return name.split(CONFIG.delimiter).map((dep) => dep.replaceAll(" ", "_"));
}

export function transDepsToArrayForDisplay(name) {
  return name.split(CONFIG.delimiter);
}

export * from "@tellme/core"
export * from "./utils";
export * from "./validation";
export * from "./rest/index";

export function sleep(seconds : number, callback? : Function) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
      resolve(undefined); 
    }, seconds * 1000);
  });
}
// export * from './dto/index';
// export * from './entities/index';
export * from './interfaces/index';
export * from './interfaces/kafka/index';
export * from './services/index';
// export * from './ws/index';


export function helloShared(name: string): string {
  return `---Hello, edit shared common 1${name}`;
}
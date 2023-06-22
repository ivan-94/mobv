const objectPrototype = Object.prototype;
const hasGetOwnPropertySymbols =
  typeof Object.getOwnPropertySymbols !== 'undefined';

export function isObject(value: any): value is object {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

export function isPlainObject(value: any): value is object {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  return true;
}

/**
 * 查看属性是否定义
 * @param target
 * @param key
 * @returns
 */
export function hasProp(target: Object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

/**
 * 添加不能枚举的字段
 * @param target
 * @param key
 */
export function addHiddenProp(target: Object, key: PropertyKey, value: any) {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: true,
    writable: true,
    value,
  });
}

export function isPropertyKey(key: any): key is PropertyKey {
  switch (typeof key) {
    case 'string':
    case 'number':
    case 'symbol':
      return true;
    default:
      return false;
  }
}

export const NOOP = () => {};

export const ownKeys: (target: any) => PropertyKey[] =
  typeof Reflect !== 'undefined' && Reflect.ownKeys
    ? Reflect.ownKeys
    : hasGetOwnPropertySymbols
    ? obj =>
        Object.getOwnPropertyNames(obj).concat(
          Object.getOwnPropertySymbols(obj) as any,
        )
    : /* istanbul ignore next */ Object.getOwnPropertyNames;

export const getDescriptor = (
  target: any,
  key: PropertyKey,
): PropertyDescriptor | undefined => {
  let source = target;

  while (source && source !== objectPrototype) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (descriptor) {
      return descriptor;
    }

    source = Object.getPrototypeOf(source);
  }

  return undefined;
};

/**
 * 检查是否为属性装饰器
 * @param name
 * @param args
 */
export const assertPropertyDecorator = (name: string, args: any[]) => {
  if (
    args.length < 2 ||
    typeof args[0] !== 'object' ||
    !isPropertyKey(args[1])
  ) {
    throw new TypeError(`@${name} 只能用于装饰属性`);
  }
};

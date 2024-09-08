export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

export function hasPropertyWithValue<T, K extends PropertyKey, V>(
  obj: T,
  key: K,
  value: V
): obj is T & Record<K, V> {
  return hasProperty(obj, key) && obj[key] === value;
}

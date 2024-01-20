declare module "*.png" {
  const value: any;
  export default value;
}

declare type Component<T> = {
  [P in keyof T]: T[P];
} & { $template: string; }

declare type StoredItem = {
  id: Item["id"]
  qty: number,
  source: string
}

declare interface StoredItems {
  [K: StoredItem["id"]]: StoredItem;
}
declare module "*.png" {
  const value: any;
  export default value;
}

type Component<T> = {
  [P in keyof T]: T[P];
} & { $template: string; }

type StoredItem = {
  id: Item["id"]
  qty: number,
  source: string
}
export enum SettingType {
  Int = "int",
  String = "string",
  Bool = "bool",
}

export default interface Setting {
  id?: number;
  key: string;
  value: string;
  type: SettingType | string;
}

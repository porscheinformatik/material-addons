export interface NavigationEntry {
  name: string;
  i18n: string;
  matIcon: string;
  route?: string;
  roles?: string[];
  children?: NavigationEntry[];
  showChildren?: boolean;
}

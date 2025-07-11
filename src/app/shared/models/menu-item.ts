export interface MenuItem {
  id: string;
  text: string;
  icon: string;
  link: string;
  children?: MenuItem[];
  global?: boolean;
}

export const emptyMenuItemDTO: MenuItemDTO = {
    label: '',
    routerLink: '',
    url: '',
    to: '',
    items: [],
}

export interface MenuItemDTO {
    label: string;
    icon?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    command?: (event?: any) => void;
    routerLink?: string;
    url?: string;
    to?: string;
    items?: MenuItemDTO[];    
}

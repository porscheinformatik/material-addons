import { QuickListItem } from './base-quick-list.component';

export type QuickListItemFactory<T extends QuickListItem = QuickListItem> = () => T;

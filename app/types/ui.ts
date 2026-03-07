export type IconName =
  | "arrow-left"
  | "panel-left"
  | "panel-right"
  | "grid"
  | "github"
  | "escape"
  | "plus"
  | "arrow-up-left"
  | "alert-circle"
  | "eye-rounded"
  | "home"
  | "charts"
  | "db"
  | "user"
  | "camera"
  | "bell"
  | "terminal"
  | "download"
  | "whatsapp"
  | "arrow-prev-small"
  | "dot-menu"
  | "edit-user"
  | "user-cog"
  | "check-circle";

type DropdownSelectOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type DropdownSelectProps<T extends string> = {
  value: T | null;
  onValueChange: (value: T | null) => void;
  options: DropdownSelectOption<T>[];
  placeholder: string;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  rowClassName?: (row: T, index: number) => string | undefined;
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
  className?: string;
  tableClassName?: string;
  bodyClassName?: string;
};

export interface ActionsProps {
  label: string;
  tooltip: string;
  icon: IconName;
  url: string;
}

export type SidebarCollapsibleGroupItem = {
  label: string;
  tooltip: string;
  icon: IconName;
  url: string;
  isActive: boolean;
};
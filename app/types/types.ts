export type LoginUserProps = {
  id: string | number;
  nombre?: string;
  apellido?: string;
  email: string;
  rol?: string;
};

export type IconName = 
  | 'arrow-left'
  | 'arrow-right'
  | 'grid'
  | 'github'
  | 'escape'
  | 'linkedin'
  | 'panel-left'
  | 'panel-right'
  | 'plus'
  | 'spinner'
  | 'archive-box'
  | 'trash'
  | 'donut'
  | 'arrow-up-left'
  | 'alert-circle'
  | 'eye-rounded';
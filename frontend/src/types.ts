export interface NotificationProps {
  id: string;
  sender: string;
  message: string;
}

export interface ChildrenItemProps {
  id: string;
  title?: string;
  name?: string;
  link: string;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
}

export interface DashboardMenuProps {
  id: string;
  title: string;
  link?: string;
  grouptitle?: boolean;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
}

export interface CustomToggleProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface TeamsDataProps {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActivity: string;
  image: string;
}

export interface ActiveProjectsDataProps {
  id: number;
  projectName: string;
  priority: string;
  priorityBadgeBg: string;
  hours: number;
  progress: number;
  brandLogo: string;
  brandLogoBg: string;
  members: {
    image: string;
  }[];
}

export interface ProjectsStatsProps {
  id: number;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  statInfo: string;
}

export interface CPUStatsProps {
  id: number;
  cpu: string;
  count: number;
  icon: React.ReactNode;
}

export interface ProjectContriProps {
  id: number;
  projectName: string;
  description: string;
  brandLogo: string;
  brandLogoBg: string;
  members: {
    image: string;
  }[];
}

export interface StandardProps {
  plantitle: string;
  description: string;
  monthly: number;
  buttonText: string;
  buttonClass: string;
  featureHeading: string;
  features: {
    feature: string;
  }[];
}

export interface FAQsProps {
  id: number;
  question: string;
  answer: string;
}

export interface FeaturesDataProps {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface ChildrenItemProps {
  id: string;
  title?: string;
  name?: string;
  link: string;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
}

export interface DashboardMenuProps {
  id: string;
  title: string;
  link?: string;
  grouptitle?: boolean;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
}

export interface ReportTableProps {
  reports: Report[];
  onReload: () => void;
}

export interface Report {
  id: number;
  op_name: string;
  date: string;
  platform_brand: string;
  platform: string;
  wlan: string;
  scenario: string;
  bt_driver: string;
  wifi_driver: string;
  // power_type: string;
  urgent_level: string;
  result: string;
  fail_rate: string;
  current_status: string;
  log_path: string;
  [key: string]: any; // ← To accommodate extra fields
}

export interface ReportPieChartProps {
  reports: Report[];
  field: keyof Report;
  title: string;
}

export interface ReportDoughnutChartProps {
  reports: Report[];
  field: keyof Report;
  title: string;
}

export interface ReportBarChartProps {
  reports: Report[];
  field: keyof Report;
  title: string;
}

export interface PlatformStatusProps {
  id: number;
  serial_num: string;
  current_status: string;
  platform_date: string | null;
  platform_brand: string | null;
  platform: string | null;
  cpu: string | null;
  wlan: string | null;
  report_date: string | null;
}

export interface ReportCrossBarChartProps {
  reports?: any[];   // Load filteredReports
  fieldX: string;
  fieldY: string;
  title: string;
}

export interface ReportDurationMultipleBarChartProps {
  reports?: any[];       // Load filteredReports
  title: string;
  fieldX?: string;       // X-axis field, default is bt_driver
  fieldY?: string;       // Cumulative field, default is duration
  groupBy?: string;      // Grouping field, default is scenario
}

export interface Threshold {
  value: number;
  color: string;
  label?: string;
}

export interface ReportGaugeAreaChartProps {
  reports: any[];
  groupBy: string;
  calcField?: string;
  calcType?: "sum" | "count";
  max?: number;
  thresholds?: Threshold[];
  title?: string;
}
export interface Session {
  session_key: number;
  session_name: string;
  country_name: string;
  year: number;
  date_start: string;
  date_end: string;
}

export interface Meeting {
  circuit_key: number;
  circuit_info_url: string;
  circuit_image?: string | null;
  circuit_short_name: string;
  circuit_type: string;
  country_code: string;
  country_flag?: string | null;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  is_cancelled: boolean;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export interface Lap {
  driver_number: number;
  lap_number: number;
  date_start: string;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  sector_1_status?: number | null;
  sector_2_status?: number | null;
  sector_3_status?: number | null;
  segments_sector_1?: number[];
  segments_sector_2?: number[];
  segments_sector_3?: number[];
}

export interface DriverPosition {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  country_code: string;
  headshot_url?: string | null;
}
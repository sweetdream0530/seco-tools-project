export type ISOMaterial = "P" | "M" | "K" | "N" | "S" | "H" | "OD" | "PC" | "GR";

export interface IMaterial {
  Name: string;
  ISOMaterial: ISOMaterial;
  MasterText: string;
  TranslationId: null;
  RefMtrl: string | null;
  RefMtrl_Nafta: string | null;
  kc11: number;
  mc: number;
  SF_k1: number;
  CalibType: string;
  HRC_nom: number;
  HRC_Calib_min: number;
  HRC_Calib_max: number;
  Rm_nom: number;
  Rm_nom_Imperial: number;
  Rm_Calib_min: number;
  Rm_Calib_min_Imperial: number;
  Rm_Calib_max: number;
  Rm_Calib_max_Imperial: number;
  ThreadMill_RadInf: string | null;
  IsFavorite: boolean;
  Calibration: number;
  Checked?: boolean;
}

export interface ICategory {
  ISOMaterial: ISOMaterial;
  MasterText: string;
  TranslationId: string;
}

export interface ISearchEntry {
  GUID: string;
    Name: string;
    Std: string;
    Std_DIN: string | null;
    SMG: string;
    Condition: string | null;
    ConditionTranslationId: null;
    Form: string | null;
    FormTranslationId: string | null;
    Structure: string | null;
    StructureTranslationId: string | null;
    IsFavorite: boolean;
    HRC_nom: number | null;
    HRC_Calib_min: number | null;
    HRC_Calib_max: number | null;
    Rm_nom: number | null;
    Rm_nom_Imperial: number | null;
    Rm_Calib_min: number | null;
    Rm_Calib_min_Imperial: number | null;
    Rm_Calib_max: number | null;
    Rm_Calib_max_Imperial: number | null;
    Calibration: number;
}

import { ISettings } from "~/store/data/types";

export interface SettingsWidgetBaseProps {
    setSettings: (props: ISettings) => void;

    settings: ISettings;
    versions: any;
}
import { IModelPayload } from "~/store/model/types";

export interface ModelUploadWidgetBaseProps {
    resetDataState: () => void;
    resetModelState: () => void;
    setModel: (props: IModelPayload) => void;

    modelName: string;
}
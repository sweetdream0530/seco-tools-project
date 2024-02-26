import { IAuthState } from "./auth/types";
import { IDataState } from "./data/types";
import { IModelState } from "./model/types";
import { IToolsState } from "./tools/types";
import { ITransmormModesState } from "./transformModes/types";

export interface IApplicationState {
  user: { version: string } | null;
  data: IDataState;
  tools: IToolsState;
  model: IModelState,
  transformModes: ITransmormModesState;
  auth: IAuthState
}

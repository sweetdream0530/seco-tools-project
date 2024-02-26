import _ from "lodash";
import { CutDataServicePayload } from "~/store/data/types";
import { calculateCutData } from "~/store/tools/data";

export async function getCutServiceData(material: any, step: any) {
    const materialPayload = {
        id: material.name,
        calibration: material.calibrationType !== "None" ? {
            type: material.calibrationType,
            value: material.calibrationValue
        } : {}
    };

    const payload: CutDataServicePayload = {
        products: _.uniq(step.toolAssemblyId.split(",")),
        cuttingMethod: step.cuttingMethod.id,
        material: materialPayload,
        name: step.name,
        inputValues: step.cuttingDataInputValues
    };

    const data = await calculateCutData(payload);
    return data.results;
}
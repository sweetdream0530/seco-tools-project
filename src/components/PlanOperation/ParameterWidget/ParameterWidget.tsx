import React from "react";
import { round } from "lodash";
import {
    Grid,
    Divider,
    Collapse,
    Stack,
    OutlinedInput,
    InputAdornment,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Add, Remove } from "@mui/icons-material";
import { getSelectedFeature, getSelectedFeatureHash } from "~/store/model/selectors";
import {
    UnknwnFeature,
    FEATURE_GEOM_INPUT_MAP,
} from "../FeaturesViewerWidget/FeaturesViewerWidget.const";
import { useSelector } from "react-redux";
import styles from "./ParameterWidget.scss";

interface ExpandType {
    [key: string]: boolean;
}

export const ParameterWidget: React.FC = () => {
    const selectedHash = useSelector(getSelectedFeatureHash);
    const selectedFeature = useSelector(getSelectedFeature);
    const parameters = (global as any).featureParameters ?? {};
    const selectedParameters = selectedHash ? parameters[selectedHash] ?? [] : [];
    
    console.log(parameters);
    const [expanded, setExpanded] = React.useState({
    } as ExpandType);

    const getUnit = (units: any, name: string) => {
        if (!name) {
            return "";
        }
        return `${units[name]}: `;
    };

    const handleExpansion = (panel: string): void => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [panel]: !prevExpanded[panel],
        }));
    };

    if (!selectedFeature) {
        return null;
    }

    if (selectedFeature.name === UnknwnFeature) {
        return (
            <Grid className={styles.propertiesContainer} container>
                <Grid className={styles.propsWrapper} container>
                    <Grid item xs={12}>
                        Reason: This geometry is currently not supported.
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    return (
        // <Grid className={styles.propertiesContainer} container>
        //     <Grid className={styles.propsWrapper} container>
        //         {selectedFeature?.featureParameters?.map(
        //             ({ name, value }, idx) => (
        //                 <Grid key={idx} item xs={12}>
        //                     {getUnit(units, name)}
        //                     {Number.isFinite(value)
        //                         ? round(value, 3).toFixed(3)
        //                         : value}
        //                 </Grid>
        //             )
        //         )}
        //         <Grid key="facesCount" item xs={12}>
        //             Faces count: {selectedFeature.featureFaceIds.length}
        //         </Grid>
        //     </Grid>
        // </Grid>
        <div className={styles.parameterBar}>
            <div
                className="my-3 ml-6 mr-4 cursor-pointer flex justify-between text-[18px]"
                onClick={() => handleExpansion("scanned_properties")}
            >
                Scanned properties
                <div className="text-[#006CEA]">
                    {expanded.scanned_properties ? <Remove /> : <Add />}
                </div>
            </div>
            <Collapse
                in={expanded.scanned_properties}
                timeout="auto"
                unmountOnExit
            >
                <div className="ml-6 mr-10">
                    <Stack direction="column" alignItems="left" spacing={0}>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>
                            <OutlinedInput
                                className="w-full"
                                size="small"
                                id="outlined-basic"
                                style={{ border: "1px solid #006CEA" }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        unit
                                    </InputAdornment>
                                }
                            />
                        </Stack>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                            className="mt-4"
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>
                            <OutlinedInput
                                className="w-full"
                                size="small"
                                id="outlined-basic"
                                style={{ border: "1px solid #006CEA" }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        unit
                                    </InputAdornment>
                                }
                            />
                        </Stack>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                            className="my-4"
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>
                            <OutlinedInput
                                className="w-full"
                                size="small"
                                id="outlined-basic"
                                style={{ border: "1px solid #006CEA" }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        unit
                                    </InputAdornment>
                                }
                            />
                        </Stack>
                    </Stack>
                </div>
            </Collapse>
            <Divider style={{ borderColor: "#99C4F7", marginTop: "8px" }} />
            {/* <div
                className="my-3 ml-6 mr-4 cursor-pointer flex justify-between text-[18px]"
                onClick={() => handleExpansion("machine_conditions")}
            >
                Machine conditions
                <div className="text-[#006CEA]">
                    {expanded.machine_conditions ? <Remove /> : <Add />}
                </div>
            </div>
            <Collapse
                in={expanded.machine_conditions}
                timeout="auto"
                unmountOnExit
            >
                <div className="ml-6 mr-10">
                    <Stack direction="column" spacing={0} className="text-left">
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                        >
                            <div className="mb-2 text-[14px]">
                                System stability
                            </div>

                            <FormControl
                                sx={{
                                    width: "100%",
                                }}
                                size="small"
                            >
                                <Select
                                    className="w-full"
                                    displayEmpty
                                    style={{
                                        border: "1px solid #006CEA",
                                    }}
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Stable conditions</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                            className="my-4"
                        >
                            <div className="mb-2 text-[14px]">
                                Surface condition
                            </div>
                            <FormControl
                                sx={{
                                    width: "100%",
                                }}
                                size="small"
                            >
                                <Select
                                    className="w-full"
                                    displayEmpty
                                    style={{
                                        border: "1px solid #006CEA",
                                    }}
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Pre machined</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </div>
            </Collapse>
            <Divider style={{ borderColor: "#99C4F7", marginTop: "8px" }} />
            <div
                className="my-3 ml-6 mr-4 cursor-pointer flex justify-between text-[18px]"
                onClick={() => handleExpansion("other_parameters")}
            >
                Other parameters
                <div className="text-[#006CEA]">
                    {expanded.other_parameters ? <Remove /> : <Add />}
                </div>
            </div>
            <Collapse
                in={expanded.other_parameters}
                timeout="auto"
                unmountOnExit
            >
                <div className="ml-6 mr-10">
                    <Stack direction="column" spacing={0} className="text-left">
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>

                            <FormControl
                                sx={{
                                    width: "100%",
                                }}
                                size="small"
                            >
                                <Select
                                    className="w-full"
                                    displayEmpty
                                    style={{
                                        border: "1px solid #006CEA",
                                    }}
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Data</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                            className="mt-4"
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>
                            <FormControl
                                sx={{
                                    width: "100%",
                                }}
                                size="small"
                            >
                                <Select
                                    className="w-full"
                                    displayEmpty
                                    style={{
                                        border: "1px solid #006CEA",
                                    }}
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Data</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack
                            direction="column"
                            alignItems={"flex-start"}
                            width={"100%"}
                            className="my-4"
                        >
                            <div className="mb-2 text-[14px]">Parameter</div>

                            <FormControl
                                sx={{
                                    width: "100%",
                                }}
                                size="small"
                            >
                                <Select
                                    displayEmpty
                                    style={{
                                        border: "1px solid #006CEA",
                                    }}
                                    inputProps={{
                                        "aria-label": "Without label",
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Data</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </div>
            </Collapse>
            <Divider style={{ borderColor: "#99C4F7", marginTop: "8px" }} /> */}
        </div>
    );
};

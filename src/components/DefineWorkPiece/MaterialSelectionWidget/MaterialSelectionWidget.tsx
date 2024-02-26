import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { categoryIconColor } from "./consts";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ArrowBackIos";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import CachedIcon from "@mui/icons-material/Cached";
import Slider from "@mui/material/Slider/Slider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./MaterialSelectionWidget.scss";

import { materialList, categoryList } from "~/datamocktmp/data";
import { IMaterial, ISOMaterial } from "./types";
import { store } from "~/store";
import { setMaterial } from "~/store/model/actions";
import { IMaterialPayload } from "~/store/model/types";
import { setPageNumber } from "~/store/data/actions";
import { useSelector } from "react-redux";
import { getSelectedMaterial } from "~/store/model/selectors";


// hard-coded color data for material categories

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MaterialSelectionWidget(props: any) {
    const stateMaterial = useSelector(getSelectedMaterial);

    const [expanded, setExpanded] = React.useState(-1);
    const [materialType, setMaterialType] = React.useState("");
    const [sliderValue, setSliderValue] = React.useState<
        number | string | Array<number | string>
    >(0);
    const [checkedMaterial, setCheckedMaterial] =
        React.useState<null | IMaterialPayload>(stateMaterial ?? null);
    const [hasCalibration, setHasCalibration] = React.useState(false);
    const [calibMin, setCalibMin] = React.useState(0);
    const [calibMax, setCalibMax] = React.useState(0);
    const [unit] = React.useState(0);
    const [searchString, setSearchString] = React.useState("");

    // initialising default Calibration value depending on unit(Metric/Imperial) selected
    if (unit == 0) {
        for (let i = 0; i < materialList.length; ++i) {
            if (materialList[i].CalibType == "Rm") {
                materialList[i].Calibration = materialList[i].Rm_nom;
            } else {
                materialList[i].Calibration = materialList[i].HRC_nom;
            }
        }
    } else {
        for (let i = 0; i < materialList.length; ++i) {
            if (materialList[i].CalibType == "Rm") {
                materialList[i].Calibration = materialList[i].Rm_nom_Imperial;
            } else {
                materialList[i].Calibration = materialList[i].HRC_nom;
            }
        }
    }

    const nextScreen = () => {
        if (!checkedMaterial) {
            return;
        }
        setMaterialType("");
        setSearchString("");
        store.dispatch(setMaterial(checkedMaterial));
        store.dispatch(setPageNumber(2));
    };

    const handleExpandCalibrationClick = (
        id: number,
        material: IMaterial | null = null
    ) => {
        if (expanded !== id) {
            setExpanded(id);
        } else {
            setExpanded(-1);
        }
        // initialize calibration slider and min/max values
        if (material == null) {
            return;
        }
        if (material.CalibType == "Rm") {
            setSliderValue(material.Calibration);
            setCalibMin(
                unit == 0
                    ? material.Rm_Calib_min
                    : material.Rm_Calib_min_Imperial
            );
            setCalibMax(
                unit == 0
                    ? material.Rm_Calib_max
                    : material.Rm_Calib_max_Imperial
            );
        } else if (material.CalibType == "HRC") {
            setSliderValue(material.Calibration);
            setCalibMin(material.HRC_Calib_min);
            setCalibMax(material.HRC_Calib_max);
        }
    };
    // filtering function to find all materials of specified type
    const getMaterials = (type: string, material: IMaterial) =>
        material.ISOMaterial === type;

    const handleMaterialSelection = (index: number) => {
        setSearchString("");
        const input = document?.getElementById(
            "searchInput"
        ) as HTMLInputElement;
        if (input && input?.value) input.value = "";
        handleExpandCalibrationClick(-1); // if new material is selected, fold calibration menu if it was open
        if (categoryList[index].ISOMaterial == materialType) {
            setMaterialType("");
        } else {
            setMaterialType(categoryList[index].ISOMaterial);
        }
        // check if materials of this type have calibration
        const selectedList = materialList.filter(
            getMaterials.bind(null, categoryList[index].ISOMaterial)
        );
        let calibration = false;
        for (let i = 0; i < selectedList.length; ++i) {
            if (selectedList[i].CalibType != "None") {
                calibration = true;
                break;
            }
        }

        setHasCalibration(calibration);
    };

    const toggleMaterialCheckbox = (
        materialName: string,
        calibrationType: string,
        calibrationValue: number,
        isoMaterial: ISOMaterial
    ) => {
        let _material = null;
        if (checkedMaterial?.name !== materialName) {
            _material = {
                name: materialName,
                calibrationType,
                calibrationValue,
                isoMaterial,
            };
        }
        setCheckedMaterial(_material);
        store.dispatch(setMaterial(_material));
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSliderValue(
            event.target.value === "" ? "" : Number(event.target.value)
        );
    };

    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        // search request here
        setSearchString(event.target.value);
    };

    const setNewCalibration = (materialName: string) => {
        for (let i = 0; i < materialList.length; ++i) {
            if (materialList[i].Name == materialName) {
                materialList[i].Calibration = Number(sliderValue);
                break;
            }
        }
    };

    const getSearchItems = () => {
        const searchText = searchString.toLowerCase();
        const searchItems =
            searchString.length > 0
                ? materialList.filter(
                    (item: IMaterial) =>
                        item.Name.toLowerCase().includes(searchText) ||
                          item.MasterText.toLowerCase().includes(searchText)
                )
                : [];
        return searchItems;
    };

    const itemList: IMaterial[] =
        searchString.length > 0
            ? getSearchItems()
            : materialList.filter(getMaterials.bind(null, materialType));

    const getSelectedMaterials = () => {
        return (
            <div className={styles.materialIconSpanLabel}>
                <label>Selected materials</label>
                <div
                    className={styles.selectedMaterialIcon}
                    style={{
                        backgroundColor:
                            categoryIconColor[
                                stateMaterial?.isoMaterial ?? "P"
                            ],
                    }}
                >
                    {stateMaterial?.name}
                    {stateMaterial?.calibrationType === "Rm"
                        ? `(${stateMaterial.calibrationValue} N/mm²)`
                        : stateMaterial?.calibrationType === "HRC"
                            ? `(${stateMaterial.calibrationValue} HRC)`
                            : ""}
                </div>
            </div>
        );
    };

    const buttonDisabled = () => {
        return !checkedMaterial || checkedMaterial?.name.length === 0;
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.materialListContainer}
                style={{
                    display:
                        materialType == "" && searchString.length === 0
                            ? "none"
                            : "block",
                }}
            >
                <Stack direction="column" alignItems="left" spacing={0}>
                    <Stack
                        direction="row"
                        className={styles.materialSearchHeader}
                    >
                        <span className={styles.listHeaderCheckbox} />
                        <span className={styles.listHeaderFavourite} />
                        <span className={styles.listHeaderIcon}>
                            <p
                                className={styles.listHeaderText}
                            >
                                {materialType}
                            </p>
                        </span>
                        <span className={styles.listHeaderDescription}>
                            <p className={styles.listHeaderText}>Description</p>
                        </span>
                        <span className={styles.listHeaderRefMaterial}>
                            <p className={styles.listHeaderText}>
                                Reference Material
                            </p>
                        </span>
                        <span
                            className={styles.listHeaderCalibration}
                            style={{
                                visibility: hasCalibration
                                    ? "visible"
                                    : "hidden",
                            }}
                        >
                            <Stack direction="row" spacing={0}>
                                <p className={styles.listHeaderText}>
                                    Calibration
                                </p>
                                <span
                                    className={styles.calibrationHelpIconSpan}
                                >
                                    <Tooltip
                                        className={styles.calibrationHelpIcon}
                                        title="Nominal calibration value of RM or HRC"
                                        arrow
                                    >
                                        <HelpOutlineIcon
                                            style={{ fontSize: "small" }}
                                        />
                                    </Tooltip>
                                </span>
                            </Stack>
                        </span>
                    </Stack>
                    <div className={styles.tableWrapper}>
                        {itemList.length > 0 ? (
                            itemList.map((material, idx) => (
                                <div
                                    key={idx}
                                    onClick={() =>
                                        toggleMaterialCheckbox(
                                            material.Name,
                                            material.CalibType,
                                            material.Calibration,
                                            material.ISOMaterial
                                        )
                                    }
                                >
                                    <div
                                        className={styles.listHeader}
                                        style={{
                                            background:
                                                checkedMaterial?.name ==
                                                material.Name
                                                    ? "#005b94"
                                                    : "#f4f9fd",
                                        }}
                                    >
                                        <span
                                            className={
                                                styles.materialCheckboxSpan
                                            }
                                        >
                                            <button
                                                className={
                                                    styles.materialCheckbox
                                                }
                                            >
                                                {/* <CheckBoxOutlineBlankIcon
                    style={{ fontSize: "medium", display: material.Checked == true ? "none" : "block" }}
                    ></CheckBoxOutlineBlankIcon> */}
                                                <RadioButtonUncheckedIcon
                                                    style={{
                                                        fontSize: "medium",
                                                        display:
                                                            checkedMaterial?.name ==
                                                            material.Name
                                                                ? "none"
                                                                : "block",
                                                    }}
                                                />
                                                <DoneOutlineIcon
                                                    style={{
                                                        fontSize: "medium",
                                                        display:
                                                            checkedMaterial?.name ==
                                                            material.Name
                                                                ? "block"
                                                                : "none",
                                                        color: "white",
                                                    }}
                                                />
                                            </button>
                                        </span>

                                        <span
                                            className={
                                                styles.favouriteButtonSpan
                                            }
                                        >
                                            <button
                                                className={
                                                    styles.favouriteButton
                                                }
                                            >
                                                <StarBorderIcon
                                                    className={
                                                        styles.favouriteIcon
                                                    }
                                                    style={{
                                                        fontSize: "medium",
                                                        color:
                                                            checkedMaterial?.name ==
                                                            material.Name
                                                                ? "white"
                                                                : "#005b94",
                                                    }}
                                                />
                                            </button>
                                        </span>

                                        <span
                                            className={styles.materialIconSpan}
                                        >
                                            <a
                                                className={styles.materialIcon}
                                                style={{
                                                    backgroundColor:
                                                        categoryIconColor[
                                                            material.ISOMaterial
                                                        ],
                                                }}
                                            >
                                                {material.Name}
                                            </a>
                                        </span>
                                        <span
                                            className={
                                                styles.materialDescriptionSpan
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.materialDescription
                                                }
                                                style={{
                                                    color:
                                                        checkedMaterial?.name ==
                                                        material.Name
                                                            ? "white"
                                                            : "#333",
                                                }}
                                            >
                                                {material.MasterText}
                                            </span>
                                        </span>
                                        <span
                                            className={
                                                styles.referenceMaterialSpan
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.referenceMaterial
                                                }
                                                style={{
                                                    color:
                                                        checkedMaterial?.name ==
                                                        material.Name
                                                            ? "white"
                                                            : "#333",
                                                }}
                                            >
                                                {material.RefMtrl}
                                            </span>
                                        </span>
                                        <span
                                            className={
                                                styles.calibrationButtonSpan
                                            }
                                            style={{
                                                background:
                                                    expanded == idx
                                                        ? "white"
                                                        : "inherit",
                                                visibility:
                                                    material.CalibType == "None"
                                                        ? "hidden"
                                                        : "visible",
                                            }}
                                            onClick={() =>
                                                handleExpandCalibrationClick(
                                                    idx,
                                                    material
                                                )
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.calibrationValueContainer
                                                }
                                                style={{
                                                    color:
                                                        checkedMaterial?.name ==
                                                            material.Name &&
                                                        expanded != idx
                                                            ? "white"
                                                            : "#333",
                                                }}
                                            >
                                                {material.Calibration}
                                                <span
                                                    className={
                                                        styles.calibrationUnit
                                                    }
                                                    style={{
                                                        display:
                                                            material.CalibType ==
                                                            "Rm"
                                                                ? "inherit"
                                                                : "none",
                                                    }}
                                                >
                                                    N/mm²
                                                </span>
                                                <span
                                                    className={
                                                        styles.calibrationUnit
                                                    }
                                                    style={{
                                                        display:
                                                            material.CalibType ==
                                                            "HRC"
                                                                ? "inherit"
                                                                : "none",
                                                    }}
                                                >
                                                    HRC
                                                </span>
                                            </span>
                                            <span
                                                className={
                                                    styles.calibrationIconSpan
                                                }
                                            >
                                                <SettingsIcon
                                                    className={
                                                        styles.calibrationIcon
                                                    }
                                                    style={{
                                                        display:
                                                            expanded == idx
                                                                ? "none"
                                                                : "inherit",
                                                        color:
                                                            checkedMaterial?.name ==
                                                            material.Name
                                                                ? "white"
                                                                : "#005b94",
                                                    }}
                                                />
                                                <CachedIcon
                                                    className={
                                                        styles.calibrationIcon
                                                    }
                                                    style={{
                                                        display:
                                                            expanded == idx
                                                                ? "inherit"
                                                                : "none",
                                                    }}
                                                />
                                            </span>
                                        </span>
                                    </div>

                                    <Collapse
                                        in={expanded == idx}
                                        timeout="auto"
                                        unmountOnExit
                                        onLoad={() =>
                                            setSliderValue(material.Calibration)
                                        }
                                    >
                                        <div className={styles.calibrationMenu}>
                                            <span
                                                className={
                                                    styles.calibrationRangeValue
                                                }
                                            >
                                                {calibMin}
                                            </span>
                                            <span className={styles.sliderSpan}>
                                                <Slider
                                                    value={
                                                        typeof sliderValue ===
                                                        "number"
                                                            ? sliderValue
                                                            : 0
                                                    }
                                                    min={calibMin}
                                                    max={calibMax}
                                                    onChange={
                                                        handleSliderChange
                                                    }
                                                />
                                            </span>
                                            <span
                                                className={
                                                    styles.calibrationRangeValue
                                                }
                                            >
                                                {calibMax}
                                            </span>
                                            <span
                                                className={
                                                    styles.sliderInputSpan
                                                }
                                            >
                                                <Input
                                                    className={
                                                        styles.sliderInput
                                                    }
                                                    value={sliderValue}
                                                    size="small"
                                                    onChange={handleInputChange}
                                                    disableUnderline
                                                    fullWidth
                                                    inputProps={{
                                                        type: "number",
                                                        min: calibMin,
                                                        max: calibMax,
                                                        "aria-labelledby":
                                                            "input-slider",
                                                    }}
                                                />
                                            </span>
                                            <span
                                                className={
                                                    styles.confirmButtonSpan
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.confirmButton
                                                    }
                                                    onClick={() =>
                                                        setNewCalibration(
                                                            material.Name
                                                        )
                                                    }
                                                >
                                                    <DoneOutlineIcon fontSize="small" />
                                                    Confirm
                                                </button>
                                            </span>
                                        </div>
                                    </Collapse>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noMaterials}>
                                No materials
                            </div>
                        )}
                    </div>
                </Stack>
            </div>
            <div className={styles.panelContainer}>
                <div className="pt-3 pb-3 pl-6 pr-2 text-left text-[18px]">
                    Material
                </div>
                <Stack
                    direction="column"
                    alignItems="top"
                    style={{ height: "100%", overflow: "auto" }}
                >
                    <div className={styles.categoryContainer}>
                        <Stack direction="column" alignItems="left" spacing={0}>
                            <div className={styles.searchContainer}>
                                <div className={styles.favouriteListIconSpan}>
                                    <SearchIcon
                                        className={styles.favouriteListIcon}
                                    />
                                </div>
                                <span className={styles.favouriteListTextSpan}>
                                    <input
                                        id="searchInput"
                                        type="text"
                                        className={styles.searchMaterialInput}
                                        placeholder="Input Title"
                                        onChange={handleSearchChange}
                                    />
                                </span>
                                <span className={styles.favouriteListArrowSpan}>
                                    <Tooltip
                                        title="Search for national material standards or material brands"
                                        arrow
                                    >
                                        <HelpOutlineIcon
                                            className={
                                                styles.favouriteListArrow
                                            }
                                        />
                                    </Tooltip>
                                </span>
                            </div>
                            <div className={styles.categoryList}>
                                {categoryList.map((category, idx) => (
                                    <button
                                        key={idx}
                                        className={
                                            categoryList[idx].ISOMaterial ===
                                            materialType
                                                ? styles.categoryDivSelected
                                                : styles.categoryDiv
                                        }
                                        onClick={() =>
                                            handleMaterialSelection(idx)
                                        }
                                    >
                                        <span
                                            className={
                                                styles.categoryArrowIconSpan
                                            }
                                        >
                                            <ExpandMoreIcon
                                                className={
                                                    styles.categoryArrowIcon
                                                }
                                                style={{ fontSize: "small" }}
                                            />
                                        </span>
                                        <span
                                            className={styles.categoryIconSpan}
                                        >
                                            <a
                                                className={styles.categoryIcon}
                                                style={{
                                                    backgroundColor:
                                                        categoryIconColor[
                                                            category.ISOMaterial
                                                        ],
                                                }}
                                            >
                                                {category.ISOMaterial}
                                            </a>
                                        </span>
                                        <span
                                            className={styles.materialTextSpan}
                                        >
                                            <span
                                                className={styles.materialText}
                                            >
                                                {category.MasterText}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Stack>
                    </div>
                </Stack>
                <div className={styles.configBtn}>
                    <div
                        className={
                            !stateMaterial
                                ? styles.materialIconSpanLabelHidden
                                : ""
                        }
                    >
                        {getSelectedMaterials()}
                    </div>
                    <Button
                        disabled={buttonDisabled()}
                        variant="contained"
                        component="label"
                        onClick={() => nextScreen()}
                        className={styles.nextButton}
                        style={{
                            backgroundColor: buttonDisabled() ? "#666" : "#333",
                            color: "white",
                            textTransform: "none",
                        }}
                    >
                        Apply and to next step
                        <ArrowForwardIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

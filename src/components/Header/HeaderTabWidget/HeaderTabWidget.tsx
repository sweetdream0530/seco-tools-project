import React from "react";
import { Grid, Tabs, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPageNumber } from "~/store/data/actions";
import { getPageNumber } from "~/store/data/selectors";

interface ITab {
    title: string;
    id: number;
}

const tabViews: ITab[] = [
    {
        title: "Define workpiece",
        id: 1,
    },
    {
        title: "Plan operation",
        id: 2,
    },
    {
        title: "Tool recommendation",
        id: 3,
    },
    {
        title: "Summary",
        id: 4,
    },
];

const tabStyle = (selected: boolean) => ({
    position: "relative",
    marginLeft: "2px",
    marginRight: "2px",
    width: "100%",
    fontSize: "24px",
    fontStyle: "normal",
    fontWight: "400",
    lineHeight: "32px",
    textTransform: "none",
    color: `${selected ? "#333333" : "#cccccc"} !important`,
    "& .MuiTab-wrapper": {
        position: "relative",
    },
    "&::after": {
        content: "\"\"",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "8px",
        backgroundColor: selected ? "#333333" : "#cccccc",
        borderRadius: "3px",
        transition: "background-color 0.5s",
    },
});

const HeaderTabWidget: React.FC = () => {
    const pageNumber = useSelector(getPageNumber);
    const dispatch = useDispatch();

    const handleChange = (
        event: React.SyntheticEvent,
        newPageNumber: number
    ) => {
        dispatch(setPageNumber(newPageNumber));
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Tabs
                    value={pageNumber}
                    onChange={handleChange}
                    variant="fullWidth"
                    TabIndicatorProps={{
                        style: { display: "none" },
                    }}
                >
                    {tabViews.map(({ title, id }) => (
                        <Tab
                            label={title}
                            value={id}
                            key={id}
                            sx={tabStyle(id === pageNumber)}
                        />
                    ))}
                </Tabs>
            </Grid>
        </Grid>
    );
};

export default HeaderTabWidget;

import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./HomePageComponent.scss";

interface HomePageComponentProps {
    setShowMainPage: (isShow: boolean) => void;
}

const HomePageComponent: React.FC<HomePageComponentProps> = ({
    setShowMainPage,
}) => {
    return (
        <Grid className={styles.homePageComponent}>
            <div className="flex items-center justify-center w-full">
                <div
                    className={styles.imageBox}
                >
                    <Typography className={styles.subTitle}>
                        Picture of either a workpiece or display on the using
                        scene of app
                    </Typography>
                </div>
                <div className={styles.textBox}>
                    <Typography
                        variant="h3"
                        component="h1"
                        color="#006CEA"
                        style={{ marginBottom: "24px" }}
                    >
                        Pre machining
                    </Typography>
                    <Typography
                        className={styles.subTitle}
                        style={{ marginBottom: "82px" }}
                    >
                        - some cool sub title
                    </Typography>
                    <Typography>
                        Qorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Etiam eu turpis molestie, dictum est a, mattis tellus.
                        Sed dignissim, metus nec fringilla accumsan, risus sem
                        sollicitudin lacus, ut interdum tellus elit sed risus.
                        Maecenas eget condimentum velit, sit amet feugiat
                        lectus. Class aptent taciti sociosqu ad litora torquent
                        per conubia nostra, per inceptos himenaeos. Praesent
                        auctor purus luctus enim egestas, ac scelerisque ante
                        pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus
                        nisl, eu tempor urna. Curabitur vel bibendum lorem.
                        Morbi convallis convallis diam sit amet lacinia. Aliquam
                        in elementum tellus.
                    </Typography>
                    <Typography>
                        Curabitur tempor quis eros tempus lacinia. Nam bibendum
                        pellentesque quam a convallis. Sed ut vulputate nisi.
                        Integer in felis sed leo vestibulum venenatis.
                        Suspendisse quis arcu sem. Aenean feugiat ex eu
                        vestibulum vestibulum.
                    </Typography>
                    <Button
                        variant="contained"
                        className={styles.getStartedButton}
                        onClick={() => setShowMainPage(true)}
                    >
                        <div className="flex flex-row justify-between w-full items-center">
                            <div>Get started</div>
                            <ArrowForwardIcon />
                        </div>
                    </Button>
                </div>
            </div>
        </Grid>
    );
};

export default HomePageComponent;

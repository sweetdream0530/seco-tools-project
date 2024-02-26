import React, { useRef, FC } from "react";
import { Views } from "./consts";
import { CameraView } from "./types";

import s from "./ViewCube.scss";
import useHover from "./hooks/useHover";

interface ViewCubeProps {
  toggleViewCube: (cameraView: CameraView) => void;
}

// eslint-disable-next-line react/function-component-definition
const ViewCube: FC<ViewCubeProps> = ({ toggleViewCube }) => {
    const FTL_ref = useRef(null);
    const FTM_ref = useRef(null);
    const FTR_ref = useRef(null);
    const FML_ref = useRef(null);
    const FMM_ref = useRef(null);
    const FMR_ref = useRef(null);
    const FGL_ref = useRef(null);
    const FGM_ref = useRef(null);
    const FGR_ref = useRef(null);

    const BTL_ref = useRef(null);
    const BTM_ref = useRef(null);
    const BTR_ref = useRef(null);
    const BML_ref = useRef(null);
    const BMM_ref = useRef(null);
    const BMR_ref = useRef(null);
    const BGL_ref = useRef(null);
    const BGM_ref = useRef(null);
    const BGR_ref = useRef(null);

    const TTL_ref = useRef(null);
    const TTM_ref = useRef(null);
    const TTR_ref = useRef(null);
    const TML_ref = useRef(null);
    const TMM_ref = useRef(null);
    const TMR_ref = useRef(null);
    const TGL_ref = useRef(null);
    const TGM_ref = useRef(null);
    const TGR_ref = useRef(null);

    const GTL_ref = useRef(null);
    const GTM_ref = useRef(null);
    const GTR_ref = useRef(null);
    const GML_ref = useRef(null);
    const GMM_ref = useRef(null);
    const GMR_ref = useRef(null);
    const GGL_ref = useRef(null);
    const GGR_ref = useRef(null);
    const GGM_ref = useRef(null);

    const LTL_ref = useRef(null);
    const LTM_ref = useRef(null);
    const LTR_ref = useRef(null);
    const LML_ref = useRef(null);
    const LMM_ref = useRef(null);
    const LMR_ref = useRef(null);
    const LGL_ref = useRef(null);
    const LGM_ref = useRef(null);
    const LGR_ref = useRef(null);

    const RTL_ref = useRef(null);
    const RTM_ref = useRef(null);
    const RTR_ref = useRef(null);
    const RML_ref = useRef(null);
    const RMM_ref = useRef(null);
    const RMR_ref = useRef(null);
    const RGL_ref = useRef(null);
    const RGM_ref = useRef(null);
    const RGR_ref = useRef(null);

    const FTL = useHover(FTL_ref);
    const FTM = useHover(FTM_ref);
    const FTR = useHover(FTR_ref);
    const FML = useHover(FML_ref);
    const FMM = useHover(FMM_ref);
    const FMR = useHover(FMR_ref);
    const FGL = useHover(FGL_ref);
    const FGM = useHover(FGM_ref);
    const FGR = useHover(FGR_ref);

    const BTL = useHover(BTL_ref);
    const BTM = useHover(BTM_ref);
    const BTR = useHover(BTR_ref);
    const BML = useHover(BML_ref);
    const BMM = useHover(BMM_ref);
    const BMR = useHover(BMR_ref);
    const BGL = useHover(BGL_ref);
    const BGM = useHover(BGM_ref);
    const BGR = useHover(BGR_ref);

    const TTL = useHover(TTL_ref);
    const TTM = useHover(TTM_ref);
    const TTR = useHover(TTR_ref);
    const TML = useHover(TML_ref);
    const TMM = useHover(TMM_ref);
    const TMR = useHover(TMR_ref);
    const TGL = useHover(TGL_ref);
    const TGM = useHover(TGM_ref);
    const TGR = useHover(TGR_ref);

    const GTL = useHover(GTL_ref);
    const GTM = useHover(GTM_ref);
    const GTR = useHover(GTR_ref);
    const GML = useHover(GML_ref);
    const GMM = useHover(GMM_ref);
    const GMR = useHover(GMR_ref);
    const GGL = useHover(GGL_ref);
    const GGM = useHover(GGM_ref);
    const GGR = useHover(GGR_ref);

    const LTL = useHover(LTL_ref);
    const LTM = useHover(LTM_ref);
    const LTR = useHover(LTR_ref);
    const LML = useHover(LML_ref);
    const LMM = useHover(LMM_ref);
    const LMR = useHover(LMR_ref);
    const LGL = useHover(LGL_ref);
    const LGM = useHover(LGM_ref);
    const LGR = useHover(LGR_ref);

    const RTL = useHover(RTL_ref);
    const RTM = useHover(RTM_ref);
    const RTR = useHover(RTR_ref);
    const RML = useHover(RML_ref);
    const RMM = useHover(RMM_ref);
    const RMR = useHover(RMR_ref);
    const RGL = useHover(RGL_ref);
    const RGM = useHover(RGM_ref);
    const RGR = useHover(RGR_ref);

    const part = (hovered: boolean) => (hovered ? s["part-hovered"] : s.part);

    // Div order within a face:
    // Front   Back    Left    Right   Top     Bottom
    // 9 8 7   9 8 7   9 8 7   9 8 7   1 2 3   1 2 3
    // 6 5 4   6 5 4   6 5 4   6 5 4   4 5 6   4 5 6
    // 3 2 1   3 2 1   3 2 1   3 2 1   7 8 9   7 8 9
    return (
        <div className={s.container}>
            {/* prettier-ignore */}
            <div id="cube" className={s.cube}>
                <div className={`${s.cubeFace} ${s.cubeFaceFront}`}>
                    <div ref={FGR_ref} className={part(FGR || GTR || RGL)} onClick={() => toggleViewCube(Views.Corner1)} />
                    <div ref={FGM_ref} className={part(FGM || GTM)} onClick={() => toggleViewCube(Views.Edge10)} />
                    <div ref={FGL_ref} className={part(FGL || GTL || LGR)} onClick={() => toggleViewCube(Views.Corner0)} />
                    <div ref={FMR_ref} className={part(FMR || RML)} onClick={() => toggleViewCube(Views.Edge51)} />
                    <div ref={FMM_ref} className={part(FMM)} onClick={() => toggleViewCube(Views.Front)} />
                    <div ref={FML_ref} className={part(FML || LMR)} onClick={() => toggleViewCube(Views.Edge04)} />
                    <div ref={FTR_ref} className={part(FTR || RTL || TGR)} onClick={() => toggleViewCube(Views.Corner5)} />
                    <div ref={FTM_ref} className={part(FTM || TGM)} onClick={() => toggleViewCube(Views.Edge45)} />
                    <div ref={FTL_ref} className={part(FTL || LTR || TGL)} onClick={() => toggleViewCube(Views.Corner4)} />
                    <span className={FMM ? s.hoveredText : ""}>front</span>
                </div>
                <div className={`${s.cubeFace} ${s.cubeFaceBack}`}>
                    <div ref={BGR_ref} className={part(BGR || LGL || GGL)} onClick={() => toggleViewCube(Views.Corner3)} />
                    <div ref={BGM_ref} className={part(BGM || GGM)} onClick={() => toggleViewCube(Views.Edge32)} />
                    <div ref={BGL_ref} className={part(BGL || RGR || GGR)} onClick={() => toggleViewCube(Views.Corner2)} />
                    <div ref={BMR_ref} className={part(BMR || LML)} onClick={() => toggleViewCube(Views.Edge73)} />
                    <div ref={BMM_ref} className={part(BMM)} onClick={() => toggleViewCube(Views.Back)} />
                    <div ref={BML_ref} className={part(BML || RMR)} onClick={() => toggleViewCube(Views.Edge26)} />
                    <div ref={BTR_ref} className={part(BTR || LTL || TTL)} onClick={() => toggleViewCube(Views.Corner7)} />
                    <div ref={BTM_ref} className={part(BTM || TTM)} onClick={() => toggleViewCube(Views.Edge67)} />
                    <div ref={BTL_ref} className={part(BTL || RTR || TTR)} onClick={() => toggleViewCube(Views.Corner6)} />
                    <span className={BMM ? s.hoveredText : ""}>back</span>
                </div>
                <div className={`${s.cubeFace} ${s.cubeFaceRight}`}>
                    <div ref={RGR_ref} className={part(RGR || BGL || GGR)} onClick={() => toggleViewCube(Views.Corner2)} />
                    <div ref={RGM_ref} className={part(RGM || GMR)} onClick={() => toggleViewCube(Views.Edge21)} />
                    <div ref={RGL_ref} className={part(RGL || FGR || GTR)} onClick={() => toggleViewCube(Views.Corner1)} />
                    <div ref={RMR_ref} className={part(RMR || BML)} onClick={() => toggleViewCube(Views.Edge62)} />
                    <div ref={RMM_ref} className={part(RMM)} onClick={() => toggleViewCube(Views.Right)} />
                    <div ref={RML_ref} className={part(RML || FMR)} onClick={() => toggleViewCube(Views.Edge15)} />
                    <div ref={RTR_ref} className={part(RTR || BTL || TTR)} onClick={() => toggleViewCube(Views.Corner6)} />
                    <div ref={RTM_ref} className={part(RTM || TMR)} onClick={() => toggleViewCube(Views.Edge56)} />
                    <div ref={RTL_ref} className={part(RTL || FTR || TGR)} onClick={() => toggleViewCube(Views.Corner5)} />
                    <span className={RMM ? s.hoveredText : ""}>right</span>
                </div>
                <div className={`${s.cubeFace} ${s.cubeFaceLeft}`}>
                    <div ref={LGR_ref} className={part(LGR || FGL || GTL)} onClick={() => toggleViewCube(Views.Corner0)} />
                    <div ref={LGM_ref} className={part(LGM || GML)} onClick={() => toggleViewCube(Views.Edge03)} />
                    <div ref={LGL_ref} className={part(LGL || BGR || GGL)} onClick={() => toggleViewCube(Views.Corner3)} />
                    <div ref={LMR_ref} className={part(LMR || FML)} onClick={() => toggleViewCube(Views.Edge40)} />
                    <div ref={LMM_ref} className={part(LMM)} onClick={() => toggleViewCube(Views.Left)} />
                    <div ref={LML_ref} className={part(LML || BMR)} onClick={() => toggleViewCube(Views.Edge37)} />
                    <div ref={LTR_ref} className={part(LTR || FTL || TGL)} onClick={() => toggleViewCube(Views.Corner4)} />
                    <div ref={LTM_ref} className={part(LTM || TML)} onClick={() => toggleViewCube(Views.Edge74)} />
                    <div ref={LTL_ref} className={part(LTL || BTR || TTL)} onClick={() => toggleViewCube(Views.Corner7)} />
                    <span className={LMM ? s.hoveredText : ""}>left</span>
                </div>
                <div className={`${s.cubeFace} ${s.cubeFaceTop}`}>
                    <div ref={TTL_ref} className={part(TTL || BTR || LTL)} onClick={() => toggleViewCube(Views.Corner7)} />
                    <div ref={TTM_ref} className={part(TTM || BTM)} onClick={() => toggleViewCube(Views.Edge76)} />
                    <div ref={TTR_ref} className={part(TTR || BTL || RTR)} onClick={() => toggleViewCube(Views.Corner6)} />
                    <div ref={TML_ref} className={part(TML || LTM)} onClick={() => toggleViewCube(Views.Edge47)} />
                    <div ref={TMM_ref} className={part(TMM)} onClick={() => toggleViewCube(Views.Top)} />
                    <div ref={TMR_ref} className={part(TMR || RTM)} onClick={() => toggleViewCube(Views.Edge65)} />
                    <div ref={TGL_ref} className={part(TGL || FTL || LTR)} onClick={() => toggleViewCube(Views.Corner4)} />
                    <div ref={TGM_ref} className={part(TGM || FTM)} onClick={() => toggleViewCube(Views.Edge54)} />
                    <div ref={TGR_ref} className={part(TGR || FTR || RTL)} onClick={() => toggleViewCube(Views.Corner5)} />
                    <span className={TMM ? s.hoveredText : ""}>top</span>
                </div>
                <div className={`${s.cubeFace} ${s.cubeFaceBottom}`}>
                    <div ref={GTL_ref} className={part(GTL || FGL || LGR)} onClick={() => toggleViewCube(Views.Corner0)} />
                    <div ref={GTM_ref} className={part(GTM || FGM)} onClick={() => toggleViewCube(Views.Edge01)} />
                    <div ref={GTR_ref} className={part(GTR || FGR || RGL)} onClick={() => toggleViewCube(Views.Corner1)} />
                    <div ref={GML_ref} className={part(GML || LGM)} onClick={() => toggleViewCube(Views.Edge30)} />
                    <div ref={GMM_ref} className={part(GMM)} onClick={() => toggleViewCube(Views.Bottom)} />
                    <div ref={GMR_ref} className={part(GMR || RGM)} onClick={() => toggleViewCube(Views.Edge12)} />
                    <div ref={GGL_ref} className={part(GGL || BGR || LGL)} onClick={() => toggleViewCube(Views.Corner3)} />
                    <div ref={GGM_ref} className={part(GGM || BGM)} onClick={() => toggleViewCube(Views.Edge23)} />
                    <div ref={GGR_ref} className={part(GGR || BGL || RGR)} onClick={() => toggleViewCube(Views.Corner2)} />
                    <span className={GMM ? s.hoveredText : ""}>bottom</span>
                </div>
            </div>
        </div>
    );
};

export default ViewCube;

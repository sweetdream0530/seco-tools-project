export const NonManufacturableFeature = "NonManufacturableFeature";
export const UnknwnFeature = "UnknwnFeature";

export const FEATURE_GEOM_INPUT_MAP = {
    UnknwnFeature: {
        name: "Unknown feature",
    },
    NonManufacturableFeature: {
        name: "Non-manufacturable feature",
        units: {
            Onm: "Feature type",
            Rnm: "Reason",
            Vnm: "Volume",
        },
    },
    NonRotFlatSurface: {
        name: "Flat surface",
        units: {
            Wf: "Width of surface (Wf)",
            Lf: "Length of surface (Lf)",
            Sf: "Stock of surface (Sf)",
            Vf: "Volume (Vf)",
        },
    },
    NonRotFreeShapePocket: {
        name: "Free-shape pocket",
        units: {
            Wp: "Smallest width of pocket (Wp)",
            Dp: "Depth of pocket (Dp)",
            Ct: "Bottom corner type (Ct)",
            Rg: "Bottom corner radius (Rg)",
            RgMin: "Bottom corner radius min (RgMin)",
            RgMax: "Bottom corner radius max (RgMax)",
            Rp: "Side corner radius min (Rp)",
            Lp: "Length of pocket (Lp)",
            Vp: "Volume (Vp)",
        },
    },
    NonRotRectangularThroughPocket: {
        name: "Rectangular through pocket",
        units: {
            Wp: "Width of pocket (Wp)",
            Lp: "Length of pocket (Lp)",
            Dp: "Depth of pocket (Dp)",
            Rp: "Side corner radius min (Rp)",
            Vp: "Volume (Vp)",
        },
    },
    NonRotShoulderStraight: {
        name: "Straight shoulder",
        units: {
            Ws: "Width of shoulder (Ws)",
            Ds: "Depth of shoulder (Ds)",
            Ls: "Length of shoulder (Ls)",
            Ct: "Corner type (Ct)",
            Rg: "Corner radius (Rg)",
            RgMin: "Corner radius (Rg) minimum",
            RgMax: "Corner radius (Rg) maximum",
            Vs: "Volume (Vs)",
        },
    },
    NonRotFreeShapeOpenPocket: {
        name: "Free-shape open pocket",
        units: {
            Wp: "Smallest width of pocket (Wp)",
            Dp: "Depth of pocket (Dp)",
            Ct: "Bottom corner type (Ct)",
            Rg: "Bottom corner radius (Rg)",
            RgMin: "Bottom corner radius (Rg) minimum",
            RgMax: "Bottom corner radius (Rg) maximum",
            Rp: "Side corner radius min (Rp)",
            Lp: "Length of pocket (Lp)",
            Ws: "Open side width (Ws)",
            Vp: "Volume (Vp)",
        },
    },
    NonRotFreeShapeThroughPocket: {
        name: "Free-shape through pocket",
        units: {
            Wp: "Smallest width of pocket (Wp)",
            Dp: "Depth of pocket (Dp)",
            Rp: "Side corner radius min (Rp)",
            Lp: "Length of pocket (Lp)",
            Vp: "Volume (Vp)",
        },
    },
    NonRotShoulderConvex: {
        name: "Convex contour shoulder",
        units: {
            Ws: "Width of shoulder (Ws)",
            Ds: "Depth of shoulder (Ds)",
            Ct: "Corner type (Ct)",
            Ls: "Length of shoulder (Ls)",
            Rg: "Corner radius (Rg)",
            RgMin: "Corner radius (Rg) minimum",
            RgMax: "Corner radius (Rg) maximum",
            Vs: "Volume (Vs)",
        },
    },
    NonRotShoulderContourGeneral: {
        name: "General contour shoulder",
        units: {
            Ws: "Width of shoulder (Ws)",
            Ds: "Depth of shoulder (Ds)",
            Ct: "Corner type (Ct)",
            Ls: "Length of shoulder (Ls)",
            Rg: "Corner radius (Rg)",
            RgMin: "Corner radius (Rg) minimum",
            RgMax: "Corner radius (Rg) maximum",
            Rm: "Curvature radius min (Rm)",
            Vs: "Volume (Vs)",
        },
    },
    NonRotSlotStraight: {
        name: "Straight slot",
        units: {
            Ws: "Width of slot (Ws)",
            Ds: "Depth of slot (Ds)",
            Ls: "Length of slot (Ls)",
            Ct: "Corner type (Ct)",
            Rg: "Corner radius (Rg)",
            RgMin: "Corner radius (Rg) minimum",
            RgMax: "Corner radius (Rg) maximum",
            Vs: "Volume (Vs)",
        },
    },
    NonRotSlotTSlot: {
        name: "T-slot",
        units: {
            SsMetric: "Standard t-slot",
            SsImperial: "Standard t-slot",
            Ls: "Length of slot (Ls)",
        },
    },
    NonRotRectangularPocket: {
        name: "Rectangular pocket",
        units: {
            Wp: "Width of pocket (Wp)",
            Dp: "Depth of pocket (Dp)",
            Lp: "Length of pocket (Lp)",
            Rp: "Side corner radius min (Rp)",
            Ct: "Bottom corner type (Ct)",
            Rg: "Bottom corner radius (Rg)",
            RgMin: "Bottom corner radius (Rg) minimum",
            RgMax: "Bottom corner radius (Rg) maximum",
            Vp: "Volume (Vp)",
        },
    },
    NonRotChamferStraight: {
        name: "Straight chamfer",
        units: {
            Ac: "Angle of chamfer (Ac)",
            Wc: "Width of chamfer (Wc)",
            Lc: "Length of chamfer (Lc)",
            Vc: "Volume (Vc)",
        },
    },
    NonRotChamferCircularInt: {
        name: "Internal circular chamfer",
        units: {
            Ac: "Angle of chamfer (Ac)",
            Wc: "Width of chamfer (Wc)",
            Di: "Inner diameter (Di)",
            Vc: "Volume (Vc)",
            Vf: "Volume (Vc)",
        },
    },
    NonRotChamferCircularExt: {
        name: "External circular chamfer",
        units: {
            Ac: "Angle of chamfer (Ac)",
            Wc: "Width of chamfer (Wc)",
            Do: "Outer diameter (Do)",
            Vc: "Volume (Vc)",
        },
    },
    NonRotCounterbore: {
        name: "Counterbore",
        units: {
            Rw: "Hole radius bigger (Rw)",
            Rn: "Hole radius smaller (Rn)",
            Lw: "Depth of bigger hole (Lw)",
            Ln: "Depth of smaller hole (Ln)",
            Vc: "Volume (Vc)",
        },
    },
    NonRot2DProfileConvex: {
        name: "Convex contour surface",
        units: {
            Sf: "Stock of surface (Sf)",
            Df: "Depth of face (Df)",
            Lf: "Length of face (Lf)",
            Vf: "Volume (Vf)",
        },
    },
    NonRot2DProfileGeneral: {
        name: "General contour surface",
        units: {
            Sf: "Stock of surface (Sf)",
            Df: "Depth of face (Df)",
            Wmin: "Minimum width (Wmin)",
            Rm: "Minimum radius in concave corner (Rm)",
            Lf: "Length of face (Lf)",
            Vf: "Volume (Vf)",
        },
    },
    NonRotChamferFreeShape: {
        name: "Free-shape chamfer",
        units: {
            Ac: "Angle of chamfer (Ac)",
            Wc: "Width of chamfer (Wc)",
            Lc: "Length of chamfer (Lc)",
            Rm: "Minimum concave radius (Rm)",
            Vc: "Volume (Vc)",
        },
    },
    NonRotFaceWith90DegreeWalls: {
        name: "Face with 90-degree walls",
        units: {
            Wmin: "Minimum width (Wmin)",
            Wmax: "Maximum width (Wmax)",
            Rm: "Minimum concave radius (Rm)",
            Dmax: "Maximum depth (Dmax)",
            S: "Area (S)",
            Vf: "Volume (Vf)",
        },
    },
    NonRotHoleEnlarging: {
        name: "Enlarged hole",
        units: {
            Ht: "Hole type",
            Dh: "Diameter (Dh)",
            D: "Pre hole diameter (D)",
            Lh: "Depth (Lh)",
            TolClass: "Tolerance class",
            DiaTolLo: "Lower diameter tolerance",
            DiaTolUp: "Upper diameter tolerance",
            SF: "Surface finish (Ra)",
            CylTol: "Cylindricity",
            CrossHole: "Cross hole",
            AngledEntrance: "Angled entrance",
            AngledExit: "Angled exit",
        },
    },
    NonRotHoleFromSolidMaterial: {
        name: "Hole from solid material",
        units: {
            Ht: "Hole type",
            Dh: "Diameter (Dh)",
            Lh: "Depth (Lh)",
            TolClass: "Tolerance class",
            DiaTolLo: "Lower diameter tolerance",
            DiaTolUp: "Upper diameter tolerance",
            SF: "Surface finish (Ra)",
            CylTol: "Cylindricity",
            CrossHole: "Cross hole",
            AngledEntrance: "Angled entrance",
            AngledExit: "Angled exit",
            Vh: "Volume (Vh)",
        },
    },
    NonRotHoleChamfer: {
        name: "Chamfered hole from solid material",
        units: {
            Ht: "Hole type",
            Dh: "Diameter (Dh)",
            Lh: "Depth (Lh)",
            Ds: "Chamfer depth (Ds)",
            TolClass: "Tolerance class",
            DiaTolLo: "Lower diameter tolerance",
            DiaTolUp: "Upper diameter tolerance",
            SF: "Surface finish (Ra)",
            CylTol: "Cylindricity",
            CrossHole: "Cross hole",
            AngledExit: "Angled exit",
            Ac: "Angle of chamfer (AC)",
            Vh: "Volume (Vh)",
        },
    },
    NonRotThreadWithTap: {
        name: "Thread with tap",
        units: {
            Ht: "Hole type",
            ThdType: "Thread type",
            ThdDim: "Thread dimension",
            Lt: "Thread length (Lt)",
            Lc: "Clearance length (Lc)",
            ThdTol: "Tolerance class",
        },
    },
    NonRotThreadMillingInt: {
        name: "Thread milling - Internal",
        units: {
            ThdType: "Thread type",
            UseStd: "Use standard dimensions",
            ThdDim: "Thread dimension",
            ThdPitchListInch: "Thread pitch",
            ThdPitchMetric: "Thread pitch",
            ThdPitchInch: "Thread pitch",
            MajDia: "Major diameter (Ø)",
            Lt: "Thread length (Lt)",
            HoT: "Hand of thread",
        },
    },
    NonRotThreadMillingIntFromSolidMaterial: {
        name: "Thread milling - Internal from solid material ",
        units: {
            ThdType: "Thread type",
            ThdDim: "Thread dimension",
            ThdPitchListInch: "Thread pitch",
            Lt: "Thread length (Lt)",
            HoT: "Hand of thread",
        },
    },
    NonRotThreadMillingExt: {
        name: "Thread milling - External",
        units: {
            ThdType: "Thread type",
            UseStd: "Use standard dimensions",
            ThdDim: "Thread dimension",
            ThdPitchListInch: "Thread pitch",
            ThdPitchMetric: "Thread pitch",
            ThdPitchInch: "Thread pitch",
            MajDia: "Major diameter (Ø)",
            Lt: "Thread length (Lt)",
            HoT: "Hand of thread",
        },
    },
    NonRot3DProfileGeneral: {
        name: "3D General contour surface",
        units: {
            Sf: "Stock of surface (Sf)",
            Dp: "Depth of profile (Dp)",
            Rp: "Minimum concave radius of profile (Rp)",
            Rt: "Maximum scallop (Rt)",
        },
    },
    RotExtCylindricalSurface: {
        name: "Cylindrical surface",
        units: {
            Dc: "Diameter of cylinder (Dc)",
            Lc: "Length of cylinder (Lc)",
            Sr: "Stock in radial direction (Sr)",
        },
    },
    RotExtCylindricalSurfaceShoulder: {
        name: "Cylindrical surface with shoulder",
        units: {
            Dc: "Diameter of cylinder (Dc)",
            Lc: "Length of cylinder (Lc)",
            Sr: "Stock in radial direction (Sr)",
            Rc: "Corner radius of shoulder (Rc)",
            As: "Angle of shoulder (As)",
        },
    },
    RotExtCylinder: {
        name: "Cylinder",
        units: {
            Dc: "Diameter of cylinder (Dc)",
            Lc: "Length of cylinder (Lc)",
            Sr: "Stock in radial direction (Sr)",
            Sa: "Stock in axial direction (Sa)",
        },
    },
    RotExtPlanarSurface: {
        name: "Planar surface",
        units: {
            Dc: "Diameter of cylinder (Dc)",
            Sa: "Stock in axial direction (Sa)",
        },
    },
    RotExtGrooveRadial: {
        name: "Radial groove",
        units: {
            D1: "Start diameter (D1)",
            D2: "Finish diameter (D2)",
            W: "Groove width (W)",
            RcMin: "Minimum corner radius (Rc)",
            RcMax: "Maximum corner radius (Rc)",
        },
    },
    RotExtPartOffBar: {
        name: "Part-off bar",
        units: {
            Db: "Diameter of bar (Db)",
            W: "Maximum cutting width (W)",
        },
    },
    RotExtPartOffTube: {
        name: "Part-off tube",
        units: {
            Do: "Outer diameter of tube (Do)",
            Di: "Inner diameter of tube (Di)",
            W: "Maximum cutting width (W)",
        },
    },
    RotExtGrooveAxial: {
        name: "Axial groove",
        units: {
            Do: "Outer diameter of tube (Do)",
            Di: "Inner diameter of tube (Di)",
            Dg: "Groove depth (Dg)",
            RcMin: "Minimum corner radius (Rc)",
            RcMax: "Maximum corner radius (Rc)",
        },
    },
    RotExtThreadTurning: {
        name: "Thread turning",
        units: {
            ThdType: "Thread type",
            UseStd: "Use standard dimensions",
            ThdDim: "Thread dimension",
            ThdPitchListMetric: "Thread pitch",
            ThdPitchListInch: "Thread pitch",
            ThdPitchMetric: "Thread pitch",
            ThdPitchInch: "Thread pitch",
            MajDia: "Major diameter (Ø)",
            Lt: "Thread length (Lt)",
            HoT: "Hand of thread",
            Lc: "Clearance length (Lc)",
        },
    },
    RotIntCylindricalSurface: {
        name: "Cylindrical surface",
        units: {
            Ds: "Start diameter (Ds)",
            De: "End diameter (De)",
            Lh: "Length (Lh)",
        },
    },
    RotIntCylindricalSurfaceShoulder: {
        name: "Cylindrical surface shoulder",
        units: {
            Ds: "Start diameter (Ds)",
            De: "End diameter (De)",
            Lh: "Length (Lh)",
            Rc: "Corner radius (Rc)",
        },
    },
    RotIntGrooveRadial: {
        name: "Radial groove",
        units: {
            Dh: "Diameter of hole (Dh)",
            Dg: "Diameter of groove (Dg)",
            Lg: "Distance to groove (Lg)",
            W: "Groove width (W)",
            RcMin: "Minimum corner radius (Rc)",
            RcMax: "Maximum corner radius (Rc)",
        },
    },
    RotIntHoleFromSolidMaterial: {
        name: "Hole from solid material",
        units: {
            Ht: "Hole type",
            Dh: "Diameter (Dh)",
            Lh: "Depth (Lh)",
            TolClass: "Tolerance class",
            DiaTolLo: "Lower diameter tolerance",
            DiaTolUp: "Upper diameter tolerance",
            SF: "Surface finish (Ra)",
            CylTol: "Cylindricity",
            CrossHole: "Cross hole",
        },
    },
    RotIntHoleChamfer: {
        name: "Chamfered hole from solid material",
        units: {
            Ht: "Hole type",
            Dh: "Diameter (Dh)",
            Lh: "Depth (Lh)",
            Ds: "Chamfer depth (Ds)",
            TolClass: "Tolerance class",
            DiaTolLo: "Lower diameter tolerance",
            DiaTolUp: "Upper diameter tolerance",
            SF: "Surface finish (Ra)",
            CylTol: "Cylindricity",
            CrossHole: "Cross hole",
        },
    },
    RotIntThreadWithTap: {
        name: "Thread with tap",
        units: {
            Ht: "Hole type",
            ThdType: "Thread type",
            ThdDim: "Thread dimension",
            Lt: "Thread length (Lt)",
            Lc: "Clearance length (Lc)",
            ThdTol: "Tolerance class",
        },
    },
    RotIntThreadTurning: {
        name: "Thread turning",
        units: {
            ThdType: "Thread type",
            UseStd: "Use standard dimensions",
            ThdDim: "Thread dimension",
            ThdPitchListMetric: "Thread pitch",
            ThdPitchListInch: "Thread pitch",
            ThdPitchMetric: "Thread pitch",
            ThdPitchInch: "Thread pitch",
            MajDia: "Major diameter (Ø)",
            Lt: "Thread length (Lt)",
            HoT: "Hand of thread",
            Lc: "Clearance length (Lc)",
        },
    },
} as any;

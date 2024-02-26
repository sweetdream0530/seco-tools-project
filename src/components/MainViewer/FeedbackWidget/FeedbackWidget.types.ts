export interface FeedbackWidgetBaseState {
    expanded: boolean;
    files: { file: File; name: string; }[];
    email: string;
    title: string;
    material: string;
    axes: string;
    actualResult: string;
    expectedResult: string;
    isEmailValid: boolean;
    isTitleValid: boolean;
    submitDisabled: boolean;
}

export interface FeedbackWidgetBaseProps {
    loading: () => void;
    loadingDone: () => void;
}
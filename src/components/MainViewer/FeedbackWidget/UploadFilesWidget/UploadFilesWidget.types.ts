export interface FeedbackWidgetProps {
    onDrop: (acceptedFiles: any) => void;
    removeItem: (index: number) => void;


    files: { file: File; name: string; }[];
}
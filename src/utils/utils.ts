export const errorify = (error: unknown): string => {
    if (error instanceof Error) {
        return String(error);
    }

    return String(Error(error?.toString() || "An unknown error occurred"));
};

export function base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function splitCamelCase(word: string) {
    if (typeof (word) !== "string") {
        throw new Error("The \"word\" parameter must be a string.");
    }

    let i, l;
    const output = [];
    const capRe = /[A-Z]/;
    for (i = 0, l = word.length; i < l; i += 1) {
        if (i === 0) {
            output.push(word[i].toUpperCase());
        }
        else {
            if (i > 0 && capRe.test(word[i])) {
                output.push(" ");
            }
            output.push(word[i]);
        }
    }
    return output.join("");
}

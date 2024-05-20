export const capitalizeFirstOnly = (input: string | undefined): string | undefined => {
    if(input) {
        if (input.length === 0) return input;
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }

    return undefined;
}

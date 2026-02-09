const required = <T>(v: T | undefined, name: string): T => {
    if (v === undefined) {
        throw new Error(`Missing env var: ${name}`);
    }
    return v;
};

export const ENV = {
    BASE_LINK: required(
        import.meta.env.VITE_BASE_LINK,
        "VITE_BASE_LINK"
    ),
};

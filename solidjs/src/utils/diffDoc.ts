import type { Doc } from "@/domain/contract"

export function diffDoc(
    current: Partial<Doc>,
    saved: Partial<Doc>
): Partial<Doc> {
    const diff: Partial<Doc> = {};

    for (const key in current) {
        if (current[key as keyof Doc] !== saved[key as keyof Doc]){
            diff[key as keyof Doc] = current[key as keyof Doc];
        }
    }

    return diff;
}

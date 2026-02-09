import { createSignal } from "solid-js";
import { patchDoc } from "@/api/contract";
import type { Doc } from "@/domain/contract";

export function useUpdatedContract(docId: number) {
    const [saving, setSaving] = createSignal(false);
    const [error, setError] = createSignal<Error | null>(null);

    async function update(patch: Partial<Doc>) {
        if (Object.keys(patch).length === 0) return;

        setSaving(true);
        setError(null);

        try {
            await patchDoc(docId, patch);
        } catch (e) {
            setError(e as Error);
            throw e;
        } finally {
            setSaving(false);
        }
    }

    return { update, saving, error };
}

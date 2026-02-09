import { createResource, createSignal, createEffect } from "solid-js";
import { loadDoc } from "@/api/contract";
import type { Doc } from "@/domain/contract";

export function useContract(docId: number) {
    const [doc, setDoc] = createSignal<Partial<Doc>>({});
    const [savedDoc, setSavedDoc] = createSignal<Partial<Doc>>({});
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal<Error | null>(null);

    loadDoc(docId).then((data) => {
        setDoc(data);
        setSavedDoc(data);
    })
    .catch((e) => setError(e as Error))
    .finally(() => setLoading(false));

    return {
        doc, 
        setDoc,
        savedDoc,
        setSavedDoc,
        loading, 
        error
    };
}

import type { Doc } from "@/domain/contract";
import { ENV } from "@/config/env";


export async function loadDoc(id: number): Promise<Doc> {
    const res = await fetch(`${ENV.BASE_LINK}/api/contract/data/${id}`);

    if (!res.ok){
        throw new Error("Failed to load document");
    }
    const data = await res.json();
    return data; 
}

export async function patchDoc(
    id: number,
    patch: Partial<Doc>
) {
    const res = await fetch(`${ENV.BASE_LINK}/api/contract/update/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(patch),
    });

    if (!res.ok) {
        throw new Error("Failed to patch document");
    }

    return res.json();
}


export async function exportPdf(doc: Partial<Doc>) {
    const res = await fetch(`${ENV.BASE_LINK}/api/contract/pdf`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(doc),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.pdf";
    a.click();
    URL.revokeObjectURL(url);
}

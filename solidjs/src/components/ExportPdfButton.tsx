import { exportPdf } from "@/api/contract";
import type { Doc } from "@/domain/contract";
import type { Accessor } from "solid-js";

type ExportPdfProps = {
    doc: Accessor<Partial<Doc>>;
};

export default function ExportPdfButton(props: ExportPdfProps) {
    const onClick = async () => {
        const currentDoc = props.doc();
        console.log(currentDoc);
        await exportPdf(currentDoc);
    };

    return (
        <>
            <button 
                onClick={onClick}
                class="buttons"
                >
               PDF 
            </button>
        </>
    );
}

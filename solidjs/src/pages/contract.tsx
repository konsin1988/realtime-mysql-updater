import { createSignal, onMount, createEffect, Suspense, createResource } from 'solid-js';
import { useParams, useLocation } from "@solidjs/router";

import FileButton from "@/components/FileButton"; 
import EditableField from "@/components/EditableField";
import Spinner from "@/components/Spinner";
import BackButton from "@/components/BackButton";
import ExportPdfButton from "@/components/ExportPdfButton";
import ZoomControl from "@/components/ZoomControl";
import RealtimeCars from "@/components/RealtimeCars";

import { formatRuDate } from "@/utils/formatRuDate";

import { useContract } from "@/hooks/useContract";
import { useUpdatedContract } from "@/hooks/useUpdatedContract";
import { diffDoc } from "@/utils/diffDoc";
import { debounce } from "@/utils/debounce";

export default function Contract() {
  const location = useLocation();
  const params = useParams();
  const docId = Number(params.id);

  const { doc, setDoc, savedDoc, setSavedDoc, loading, error } = useContract(docId);
  const { update } = useUpdatedContract(docId);
  const [ scale, setScale ] = createSignal(0.8);
  
  onMount(() => {
    document.title = "Формирование договора";

  });

  createEffect(() => {
    const from = location.state?.from ?? document.referrer;
  })

  const debouncedSave = debounce(async (patch) => {
    await update(patch);
    setSavedDoc((prev) => ({...prev, ...patch }));
  }, 800);

  createEffect(() => {
    const current = doc();
    const saved = savedDoc();

    const patch = diffDoc(current, saved);

    if (Object.keys(patch).length > 0) {
        debouncedSave(patch);
    }
  });


  return (
    <Show when={!loading()} fallback={<Spinner />}>
    <section class={`w-full overflow-x-hidden overflow-y-hidden bg-[#dadce5] text-justify`}
                style={{
                    "height": `${297 * scale() + 25}mm`,
                }}>
        <div class="fixed flex w-full px-10 py-15 justify-between">
            <BackButton/>
            <ExportPdfButton doc={doc}/>
        </div>
        <ZoomControl onChange={setScale} scale={scale()} max="1.5"/>
        <div class="z-5 pt-15 flex items-center justify-center bg-[#dadce5] select-none" id="contract-pdf">
            <div 
                style={{
                    "transform": `scale(${scale()})`,
                    "transform-origin": "top center",
                }}
                class="text-[0.7rem] w-[210mm] h-[297mm] px-[15mm] bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] origin-top">
		<RealtimeCars/>
            </div>
        </div>
    </section>
    </Show>
  );
}


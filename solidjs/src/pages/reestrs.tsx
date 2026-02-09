import { createSignal, onMount, createEffect, Suspense, createResource } from 'solid-js';
import { useParams, useLocation } from "@solidjs/router";
import FileButton from "../components/FileButton" 

export default function ReestrCheck() {
  const location = useLocation();
  const params = useParams();

  onMount(() => {
    document.title = `${params.docname}`;
  });

  createEffect(() => {
    const from = location.state?.from ?? document.referrer;
    console.log("from:", from);
  })

  return (
    <section class="w-screen h-screen flex items-center justify-center bg-[#dadce5] select-none">
        <div class="px-12 py-5 text-center bg-white rounded-lg shadow-lg w-9/10 max-w-[600px]">
            <div class="flex justify-end">
                <a class="bg-[linear-gradient(135deg,#a67f5e,#ba9679)] text-white border-none py-1 px-5 rounded-sm text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out no-underline gap-2 mb-3 shadow-md" href="{from}">
                       <p> Назад в форму</p>
                </a>
                <div></div>
            </div>
            <h1 class="text-[#24252E] text-[28px] font-normal mb-8 relative after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-[#DCB799] after:to-[#a87952] after:rounded">Выберите формат файла</h1>
            <div class="flex justify-center gap-6 flex-wrap">
               <FileButton file_url={`/auditso/api/${params.db}/${params.docname}/pdf`} file_type="pdf" text="Переносимый формат" />  
               <FileButton file_url={`/auditso/api/${params.db}/${params.docname}/xlsx`} file_type="xlsx" text="Табличные данные" />  
               <FileButton file_url={`/auditso/api/${params.db}/${params.docname}/doc`} file_type="doc" text="Текстовый документ" />  
            </div>
        </div>
    </section>
  );
}


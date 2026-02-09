import { createSignal } from  'solid-js';

export default function FileButton({file_url, file_type, text}: { 
  file_url: string; 
  file_type: string;
  text: string;
}) {
    const [loading, setLoading] = createSignal(false);

    const downloadFile = async () => {
        try {
            setLoading(true);
            const response = await fetch(file_url);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            let filename = `download.${file_type}`;
            const contentDisposition = response.headers.get('content-disposition');
            
            if (contentDisposition) {
              const match = contentDisposition.match(/filename\*=utf-8''(.+)/i);
              if (match && match[1]) {
                filename = decodeURIComponent(match[1]);
              }
            }
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; 
            
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
        }   catch (error) {
            console.error('Download failed:', error);
            alert('Не удалось скачать файл');
        }   finally {
            setLoading(false);
        }
    };
    return (
        <button 
            onClick={downloadFile} disabled={loading()}
            class="flex-1 min-w-[120px] py-3 px-3 border-0 rounded-xl text-lg font-semibold no-underline cursor-pointer transition-all duration-300 ease-in-out text-center inline-block text-[#ba9477] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-all before:duration-500 hover:before:left-full hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(0,0,0,0.2)] active:-translate-y-0.25 active:shadow-[0_6px_12px_rgba(0,0,0,0.15)] bg-[linear-gradient(135deg,#4c4c52,#55555e)] hover:bg-[linear-gradient(135deg,#4c4c52,#55555e)]">
            <span class="uppercase">{file_type}</span>
            <span class="block text-white text-[12px] font-normal opacity-90 mt-1 normal-case">{loading() ? 'Скачивание...' : text}</span>
        </button>

    )
} 

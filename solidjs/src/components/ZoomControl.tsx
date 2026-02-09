import { createSignal } from "solid-js"

type ZoomProps = {
    onChange: (scale: number) => void;
    scale: number;
    initial?: number;
    min?: number;
    max?: number;
    step?: number;
};

export default function ZoomControl(props: ZoomProps){
    const min = props.min ?? 0.6;
    const max = props.max ?? 1.0;
    const step = props.step ?? 0.1;

    const handleInput = (e: Event) => {
        const val = Number((e.currentTarget as HTMLInputElement).value);
        props.onChange(val);
    };

    return (
        <div class="
            fixed bottom-4 right-4 z-50 
            bg-white shadow-lg rounded-xl
            px-4 py-2
            border w-55">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={props.scale}
                    onInput={handleInput}
                    class="w-full accent-[#ad9179] h-2"
                />

            <div class="mt-0 flex justify-between text-xs text-gray-400 leading-none">
                <span>{Math.round(min * 100)}%</span>
                <span>{Math.round(max * 100)}%</span>
            </div>
        </div>
    );
}


import { onMount, createEffect } from "solid-js";

type EditableFieldProps = {
    type?: "text" | "date" | "number";
    value?: string;
    placeholder?: string;
    readonly?: boolean;
    format?: (v: string) => string;
    parse?: (v: string) => string;
    onChange: (v: string) => void;
};

export default function EditableField(props: EditableFieldProps) {
    let span!: HTMLSpanElement;
    let input!: HTMLInputElement;

    onMount(() => {
        span.innerText = props.format
            ? props.format(props.value ?? "")
            : props.value ?? "";
    });

    
    function openPicker(){
        input.showPicker?.();
        input.focus();
    }

    function update(value: string) {
        props.onChange(props.parse ? props.parse(value) : value);
        if (props.type === "date"){ 
            span.innerText = props.format ? props.format(input.value) : input.value;
        }
    }

    if (props.type === "date") {
        return (
            <>
                <span
                    ref={span}
                    value={props.value}
                    class="fillable"
                    onClick={() => input.showPicker?.()}
                />
                <input
                    ref={input}
                    type="date"
                    value={props.value}
                    class="absolute opacity-0 pointer-events-none"
                    onInput={(e) => 
                        update((e.target as HTMLInputElement).value)
                    }
                />
            </>
        );
    }

    return (
        <span
            ref={span}
            contenteditable={!props.readonly}
            class="fillable"
            onInput={() => update(span.innerText)}
            data-placeholder={props.placeholder}
        />
    );
}

import { createSignal, onMount, createEffect, Suspense, createResource } from 'solid-js';
import { useParams, useLocation } from "@solidjs/router";

import FileButton from "@/components/FileButton"; 
import EditableField from "@/components/EditableField";
import Spinner from "@/components/Spinner";
import BackButton from "@/components/BackButton";
import ExportPdfButton from "@/components/ExportPdfButton";
import ZoomControl from "@/components/ZoomControl";

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
                <div class="text-center">
                    <div class="mt-7 text-[0.9rem] underline font-bold">ДОГОВОР 
                <EditableField
                    value={doc().DogovorNumber}
                    onChange={(v) =>
                        setDoc((d) => ({ ...d, DogovorNumber: v }))
                    }
                />
                    </div><h1 class="text-[0.9rem] underline font-bold"> ПОСТАВКИ АВТОМОБИЛЯ</h1>
                </div>
                <div class="flex justify-between px-4 items-center py-0.7">
                    <p><strong>г. Москва</strong></p><p><strong>
                    <EditableField
                        value={doc().Car_date}
                        type="date"
                        format={formatRuDate}
                        onChange={(val) => 
                            setDoc(prev => ({...prev, Car_date: val }))
                        }
                    />
                    </strong></p>
                </div>
                <div class="my-2">ООО «РТ-ПЦ», именуемое в дальнейшем «Продавец», в лице Генерального
                директора Э.Г. Тихомирова, действующего на основании Устава, с одной
                стороны, и company_name , именуемое в дальнейшем «Покупатель», в лице 
                <EditableField
                    value={doc().contactFIO}
                    onChange={(v) =>
                        setDoc((d) => ({ ...d, contactFIO: v }))
                    }
                />
               , действующего на основании 
                <EditableField
                    value={doc().ContactPerson}
                    onChange={(v) =>
                        setDoc((d) => ({ ...d, ContactPerson: v }))
                    }
                />
              , с другой стороны, каждый в отдельности или вместе могут именоваться, соответственно, "Сторона"
                или "Стороны", заключили настоящий Договор о нижеследующем:</div>
                
                <p class="pt-4 text-center text-[0.8rem]"><strong>1.  ПРЕДМЕТ ДОГОВОРА</strong></p>
                <p><strong>1.1.</strong> Продавец обязуется передать, а Покупатель –
                    принять и оплатить новый автомобиль (далее именуется «Товар»).
                    Характеристики, параметры, технические данные, спецификация и
                    дополнительное оборудование Товара устанавливаются в Приложении №1 к
                    настоящему Договору, являющимся неотъемлемой его частью.</p>
                    
                <p class="pt-4 text-center text-[0.8rem]"><strong>2.  ЦЕНА ТОВАРА И ПОРЯДОК РАСЧЕТОВ</strong></p>
                <p><strong>2.1.</strong> Поставляемый по настоящему договору автомобиль
                    оплачивается по согласованной сторонами цене, указанной в Приложении №1.
                    В вышеуказанную цену включены стоимость автомобиля, его доставка,
                    таможенная очистка (для автомобилей иностранного производства), расходы
                    на проведение предпродажной подготовки, а также стоимость
                    дополнительного оборудования, указанного в спецификации, и расходы по
                    его установке на автомобиль, приобретаемый Покупателем по настоящему
                    Договору, и иные расходы Продавца.</p>
                    <p><strong>2.2.</strong> Оплата производится Покупателем в следующем
                    порядке:</p>
                    <p><strong>2.2.1</strong> Оплата в размере 100% предоплаты от полной
                    стоимости, указанной в Приложении № 1 настоящему Договору, производится
                    в течение 10 (десяти) календарных дней с даты заключения Договора, но не
                    позднее предполагаемой даты поставки Товара на основании счета
                    Продавца.</p>
                    <p><strong>2.3.</strong> Днем оплаты Товара Покупателем считается день
                    списания денежных средств с расчетного счета Покупателя, при условии
                    правильного заполнения реквизитов Продавца. В противном случае, днем
                    оплаты Товара Покупателем считается день зачисления денежных средств на
                    расчетный счет Продавца.</p>
                    <p><strong>2.4.</strong> Стороны признают условия и сроки оплаты по
                    настоящему Договору существенным условием Договора.</p>
                
                <p class="pt-4 text-center text-[0.8rem]"><strong>3.  СРОКИ И УСЛОВИЯ ПОСТАВКИ И ПЕРЕДАЧИ
                    ТОВАРА</strong></p>
                    <p><strong>3.1.</strong> Продавец обязуется:</p>
                    <p><strong>3.1.1.</strong> Доставить Товар до места доставки и
                    предъявить Покупателю Товар в состоянии полной готовности к эксплуатации
                    по адресу, согласованному Сторонами в Приложении № 1 к настоящему
                    Договору (в настоящем Договоре именуется «место доставки»). Сроки
                    поставки Товара указываются в Приложении №1.</p>
                    <p><strong>3.1.2.</strong> Немедленно после поступления, но не более
                    5-ти рабочих дней, к Продавцу полного комплекта документов на Товар
                    Продавец уведомляет Покупателя о возможности получения Товара путем
                    факсимильного сообщения по телефону или по электронной почте.</p>
                    <p><strong>3.1.3.</strong> Провести предпродажную подготовку Товара в
                    течение 3 (трех) дней после уведомления покупателя, а именно: все
                    приборы и дополнительное оборудование должны быть установлены на Товаре,
                    Товар должен быть полностью укомплектован, все параметры Товара, его
                    оборудования (приборов, узлов, агрегатов и деталей) должны быть
                    проверены и приведены в соответствие с установленными нормами, емкости
                    Товара должны быть полностью заполнены (уровень топлива в бензобаке – не
                    ниже минимально допустимой отметки). Товар должен быть вымыт и вычищен,
                    и полностью готов к эксплуатации. Продавец обязан предоставить
                    заполненные Сервисную книжку, Гарантийную книжку и Руководство по
                    эксплуатации на русском языке с информацией о применяемых кодах.</p>
                    <p><strong>3.1.4.</strong> В срок не более 10 (десяти) дней после
                    письменного уведомления Покупателя о доставке Товара, вручить Товар, в
                    полной готовности к эксплуатации, полностью укомплектованный и прошедший
                    предпродажную подготовку как это предусмотрено настоящим Договором, всю
                    документацию на Товар: счет, счет-фактуру и Товарную накладную или
                    универсальный-передаточный документ (УПД), выписку из электронного
                    паспорта транспортного средства, прочие документы, необходимые для
                    постановки Товара на учет в органах ГИБДД, Сервисную книжку, Гарантийную
                    книжку и Руководство по эксплуатации на русском языке, а также
                    обеспечить, чтобы Покупатель с Товаром и указанной документацией смог
                    беспрепятственно и без каких либо задержек покинуть место доставки.</p>
                    <p><strong>3.2.</strong> Перед подписанием документов о передаче Товара
                    Покупатель обязан проверить Товар на предмет отсутствия внешних
                    повреждений и соответствия спецификации Товара условиям, указанным в
                    Приложении №1 к настоящему Договору.</p>
                    <p><strong>3.3.</strong> Обязательства Продавца по поставке Товара
                    считаются выполненными с момента подписания Сторонами Акта приема -
                    передачи Товара (Приложение № 2 к Договору), по которому Продавец
                    передает, а Покупатель принимает Товар в состоянии полной готовности к
                    эксплуатации, полностью укомплектованным и прошедшим предпродажную
                    подготовку, а также всю документацию на Товар, в соответствии с
                    перечнем, предусмотренным пунктом 3.1.4. настоящего Договора.</p>
                    <p><strong>3.4.</strong> Переход права собственности на Товар от
                    Продавца к Покупателю, а также рисков, связанных с утратой и порчей
                    Товара, происходит в момент подписания Акта приема - передачи
                    Товара.</p>
                    <p class="pt-4 text-center text-[0.8rem]"><strong>4.  КАЧЕСТВО ТОВАРА И УСЛОВИЯ ГАРАНТИИ</strong></p>
            </div>
        </div>
    </section>
    </Show>
  );
}


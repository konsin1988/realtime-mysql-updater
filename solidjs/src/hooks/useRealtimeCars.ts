import { createSignal, onCleanup, onMount } from "solid-js";
import { wsService } from "@/api/ws";
import type { DataFormCar } from "@/api/types";

export function useRealtimeCars() {
  const [cars, setCars] = createSignal<DataFormCar[]>([]);

  onMount(() => {
    const unsubscribe = wsService.subscribe<DataFormCar>((car) => {
      setCars((prev) => {
	const existing = prev.find((c) => c.id === car.id);

	if (existing) {
	  return prev.map((c) => (c.id === car.id ? car : c));
	}

	return [...prev, car];
      });
    });

    onCleanup(unsubscribe);
  });

  return { cars };
}

import { For } from "solid-js";
import { useRealtimeCars } from "@/hooks/useRealtimeCars";

export default function RealtimeCars() {
  const { cars } = useRealtimeCars();

  return (
    <div class="mt-10 p-4 bg-white shadow rounded">
      <h2 class="text-lg font-bold mb-3">Debezium Test</h2>

      <For each={cars()}>
        {(car) => (
          <div class="border-b py-2">
            <div><strong>ID:</strong> {car.id}</div>
            <div><strong>Model:</strong> {car.model}</div>
            <div><strong>Count:</strong> {car.count}</div>
            <div><strong>Price:</strong> {car.price}</div>
            <div><strong>Total:</strong> {car.totalPrice}</div>
            <div><strong>Description:</strong> {car.modelDescription}</div>
          </div>
        )}
      </For>
    </div>
  );
}

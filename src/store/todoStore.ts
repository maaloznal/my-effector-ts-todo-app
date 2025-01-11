import { createEffect, createEvent, createStore } from "effector";

interface Item {
  id: number;
  text: string;
  completed: boolean;
}

export const addItem = createEvent<Item>();
export const deleteItem = createEvent<number>();
export const toggleCompleted = createEvent<number>();
export const filterItem = createEvent<string>();

export const $itemStore = createStore<Item[]>([])
  .on(addItem, (state, newItem) => [...state, newItem])
  .on(deleteItem, (state, id) => state.filter((item) => item.id !== id))
  .on(toggleCompleted, (state, id) =>
    state.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  );

export const addTaskWithDelayFx = createEffect<Item, void, Error>(
  async (task) => {
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      addItem(task);
    } catch (error) {
      console.error("error", error);
    }
  }
);

export const addTaskAsync = createEvent<Item>();
addTaskAsync.watch((task) => {
  addTaskWithDelayFx(task);
});


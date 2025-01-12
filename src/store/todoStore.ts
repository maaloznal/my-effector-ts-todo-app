import { createEffect, createEvent, createStore } from "effector";

interface Item {
  id: number;
  text: string;
  completed: boolean;
  deleted?: boolean;
}

type FilterStatus = "all" | "completed" | "deleted";

export const addItem = createEvent<Item>();
export const deleteItem = createEvent<number>();
export const toggleCompleted = createEvent<number>();
export const changeFilterStatus = createEvent<FilterStatus>();

export const $itemStore = createStore<Item[]>([])
  .on(addItem, (state, newItem) => [...state, newItem])
  .on(deleteItem, (state, id) => state.filter((item) => item.id !== id))
  .on(toggleCompleted, (state, id) =>
    state.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  );

export const $filterStatus = createStore<FilterStatus>("all").on(
  changeFilterStatus,
  (_, status) => status
);

export const $filteredItemStore = $itemStore.map((items) => {
  const filterStatus = $filterStatus.getState();

  switch (filterStatus) {
    case "completed":
      return items.filter((item) => item.completed);
    case "deleted":
      return items.filter((item) => item.deleted);
    case "all":
    default:
      return items;
  }
});

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

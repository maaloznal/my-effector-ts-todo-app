import {
  createEffect,
  createEvent,
  createStore,
  combine,
  sample,
} from "effector";

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
  .on(deleteItem, (state, id) =>
    state.map((item) => (item.id === id ? { ...item, deleted: true } : item))
  )
  .on(toggleCompleted, (state, id) =>
    state.map((item) =>
      item.id === id && !item.deleted
        ? { ...item, completed: !item.completed }
        : item
    )
  );

export const $filterStatus = createStore<FilterStatus>("all").on(
  changeFilterStatus,
  (_, status) => status
);

export const $filteredItemStore = combine(
  $itemStore,
  $filterStatus,
  (items, filterStatus) => {
    switch (filterStatus) {
      case "completed":
        return items.filter((item) => item.completed && !item.deleted);
      case "deleted":
        return items.filter((item) => item.deleted);
      case "all":
      default:
        return items.filter((item) => !item.deleted);
    }
  }
);

export const addTaskWithDelayFx = createEffect<Item, void, Error>(
  async (task) => {
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      console.log(task);
    } catch (error) {
      console.error("error", error);
    }
  }
);

addTaskWithDelayFx.done.watch(({ params: task }) => {
  addItem(task);
});

export const addTaskAsync = createEvent<Item>();
sample({
  clock: addTaskAsync,
  target: addTaskWithDelayFx,
});

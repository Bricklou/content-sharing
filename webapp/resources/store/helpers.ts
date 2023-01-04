import store, { RootState } from "./init";
import { computed, inject } from "vue";
import { storeKey } from "./plugin";

export const useDispatch = () => store.dispatch;

export const useSelector = <Selected, State extends RootState = RootState>(
  fn: (state: RootState) => Selected
) => {
  const rootStore = inject(storeKey) as { state: RootState };
  return computed(() => fn(rootStore.state as State));
};

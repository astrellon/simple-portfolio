import DataStore, { Modifier } from "simple-data-store";
import { setStore, State } from "../../common/store";

setStore(new DataStore<State>({
    categories: [],
    posts: {},
    selectedCategoryId: ''
}));

export function setInitialState(state: State): Modifier<State>
{
    return () => { return state; }
}
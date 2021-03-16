import DataStore, { Modifier } from "simple-data-store";
import { setStore, State } from "./store";

setStore(new DataStore<State>({
    pages: [],
    posts: {},
    selectedPageId: ''
}));

export function setInitialState(state: State): Modifier<State>
{
    return () => { return state; }
}
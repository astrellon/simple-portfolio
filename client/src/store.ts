import DataStore, { Modifier } from "simple-data-store";
import { setStore, State } from "../../common/store";
import { PageId } from "./common/store";

setStore(new DataStore<State>({
    pages: [],
    posts: {},
    selectedPageId: ''
}));

export function setInitialState(state: State): Modifier<State>
{
    return () => { return state; }
}
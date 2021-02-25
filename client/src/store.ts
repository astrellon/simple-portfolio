import DataStore, { Modifier } from "simple-data-store";
import { State } from "../../common/store";

export const store = new DataStore<State>({
    posts: []
});

export function setInitialState(state: State): Modifier<State>
{
    return () => { return state; }
}
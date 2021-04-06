import DataStore, { Modifier } from "simple-data-store";
import { setStore, State } from "./store";

setStore(new DataStore<State>({
    pages: [],
    posts: {},
    backgrounds: {
        dark: [],
        light: []
    },
    selectedPageId: '',
    darkTheme: false,
    postsHeight: 0,
    isMobile: false,
    ripplesEnabled: true
}));

export function setInitialState(state: State): Modifier<State>
{
    return () => { return state; }
}
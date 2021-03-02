import './normalize.css';
import './styles.scss';

import { vdom, render, hydrate } from "simple-tsx-vdom";
import { State, store } from "../../common/store";
import { App } from "../../common/components/app";
import { setInitialState } from './store';

(globalThis as any).__store = store;

const initialState = (globalThis as any).__state as State | undefined;
if (initialState != undefined)
{
    store.execute(setInitialState(initialState));
    hydrate(<App state={store.state()} />, document.body);
}

function renderApp(state: State)
{
    render(<App state={state} />, document.body);
}
// Render the app on start
renderApp(store.state());

// Re-render the app when the store changes
store.subscribeAny((state) =>
{
    renderApp(state);
});

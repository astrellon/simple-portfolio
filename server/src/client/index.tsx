import { vdom, render } from "simple-tsx-vdom";
import { setSelectedPageId, WindowHistory, State, store } from "./store";
import { App } from "./components/app";
import { setInitialState } from './clientStore';
import { hydrate } from 'simple-tsx-vdom-hydration';

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

window.addEventListener('popstate', (event) =>
{
    console.log(event);
    const stateData: WindowHistory = event.state;
    if (stateData.pageId)
    {
        store.execute(setSelectedPageId(stateData.pageId));
    }
});
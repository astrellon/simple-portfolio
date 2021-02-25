import './normalize.css';
import './styles.scss';

import { vdom, render, VDom, hydrate } from "simple-tsx-vdom";
import { State } from "../../common/store";
import { App } from "../../common/components/app";
import { setInitialState, store } from './store';

const rootElement = document.getElementById('root');
if (rootElement == null)
{
    alert('Cannot find root element!');
    throw new Error('Oh no!');
}

let hydrateFirst = false;
const initialState = (globalThis as any).__state as State | undefined;
if (initialState != undefined)
{
    hydrateFirst = true;
    store.execute(setInitialState(initialState));
}

function renderApp(state: State)
{
    if (hydrateFirst)
    {
        hydrate(<App state={state} />, rootElement as HTMLElement);
        hydrateFirst = false;
    }
    else
    {
        render(<App state={state} />, rootElement as HTMLElement);
    }
}

// Render the app on start
renderApp(store.state());

// Re-render the app when the store changes
store.subscribeAny((state) =>
{
    renderApp(state);
});

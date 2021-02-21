import "array-flat-polyfill";
import { FunctionalComponent, render, VDom, vdom } from "simple-tsx-vdom";
import { SSRDomDocument } from "./ssr-vdom";

const ssrDomDocument = new SSRDomDocument();
const ssrVDom = new VDom(ssrDomDocument);
VDom.current = ssrVDom;

interface TestProps
{
    readonly name: string;
}
const TestFunc: FunctionalComponent<TestProps> = (props: TestProps) =>
{
    return vdom('strong', {}, props.name);
}

const testVDom = vdom('main', {'class': 'main', id: 'MainId'}, 'Inner text',
    vdom(TestFunc, {name: 'Alan'}));
const parent = ssrDomDocument.createElement('div');
render(testVDom, parent);

console.log(parent.toString());
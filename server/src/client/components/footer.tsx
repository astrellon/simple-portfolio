import { ClassComponent, vdom } from "simple-tsx-vdom";
import './footer.scss';

export class Footer extends ClassComponent
{
    public render()
    {
        return <footer class='footer'>
            Alan Lawrey 2021
        </footer>
    }
}
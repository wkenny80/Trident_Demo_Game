import vars from './vars';
import { EventManager as events } from './managers/EventManager';

const SelectKraken = ({ id }) => {
    const setKraken = () => {
        vars.chosenKrakenID = id;
        events.emit('updateKrakenIDs');
    }

    return(
        <a className="md:block hidden shadow-md w-auto bg-indigo-800 px-3 py-1 rounded-sm hover:bg-indigo-700 font-mono text-zinc-400 hover:text-white text-center cursor-pointer mr-2"
            onClick={() => setKraken()}
        >
            View Kraken
        </a>
    )
}

export default SelectKraken;
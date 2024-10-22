import { useEffect } from 'react';
import vars from './vars';
import { EventManager as events } from './managers/EventManager';

// When the page changes, remove all event listeners. This is to prevent old Phaser games from persisting.
const PageChangeHandler = ({ currentPage }) => {
    useEffect(() => {
        events.removeAllListeners();
    }, [currentPage]);

    return(
        <div className="hidden"></div>
    )
}

export default PageChangeHandler;
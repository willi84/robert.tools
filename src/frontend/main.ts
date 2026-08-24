// import 'vite/dynamic-import-polyfill'; // for prod mode
import './_shared/index.css';
import { setupSearch } from './components/molecules/search/search.molecule';

(() => {
        // insert function here
        setupSearch();

        if ('serviceWorker' in navigator && import.meta.env.PROD) {
                window.addEventListener('load', () => {
                        navigator.serviceWorker.register('/sw.js').catch(() => undefined);
                });
        }
})();

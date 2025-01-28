declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: {
                url: string;
            }) => void;
        };
    }
}

export const loadCalendlyScript = () => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}; 


export const fetchUDOData = async () => {
    try {
        const response = await fetch('/udoData.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching UDO data:', error);
        return null;
    }
};

export const updateUDOData = async () => {
    // Logic to update UDO data by crawling the website
}; 
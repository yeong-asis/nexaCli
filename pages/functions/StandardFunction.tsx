export async function ChangeDateTime(currentValue: any) {
    try {
        const newFormatDate = new Date(currentValue).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric',hour: '2-digit', minute: '2-digit' });
        return newFormatDate;
    } catch (error) {
        console.log("Change Date Time error:", error);
        return null;
    }
}

export const formatDateTime = (dateString: string) => {
    // Create a Date object from the string
    const dateObj = new Date(dateString);

    // Get individual components
    const year = dateObj.getFullYear();  // 2024
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[dateObj.getMonth()];  // October
    const day = dateObj.getDate();  // 2

    // Get hours and minutes
    let hours = dateObj.getHours();  // 3
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');  // 45

    // AM/PM format
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;  // Convert to 12-hour format

    // Final formatted date string
    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
};
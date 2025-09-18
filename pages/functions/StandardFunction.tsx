export async function ChangeDateTime(currentValue: any) {
    try {
        const newFormatDate = new Date(currentValue).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric',hour: '2-digit', minute: '2-digit' });
        return newFormatDate;
    } catch (error) {
        console.log("Change Date Time error:", error);
        return null;
    }
}
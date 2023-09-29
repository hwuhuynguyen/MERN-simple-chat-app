export const formatDate = (date) => {
	const originalDate = new Date(date);
	const day = String(originalDate.getDate()).padStart(2, "0");
	const month = String(originalDate.getMonth() + 1).padStart(2, "0");
	const year = originalDate.getFullYear();

	const hours = String(originalDate.getHours()).padStart(2, "0");
	const minutes = String(originalDate.getMinutes()).padStart(2, "0");
	const seconds = String(originalDate.getSeconds()).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC`;
};

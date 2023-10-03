const fs = require("fs");

const uploadFile = (data) => {
	const filePath = `uploads/images/chat/${data.message.fileName}`;

	const base64String = data.image;
	const index = base64String.indexOf("base64");
	let substring = base64String.slice(0, index + 7);
	const base64Data = base64String.replace(substring, "");
	const extension = base64String.substring(
		base64String.indexOf("/") + 1,
		base64String.indexOf(";")
	);

	// Create a buffer from the base64 string
	const buffer = Buffer.from(base64Data, "base64");

	// Write the buffer to a file
	fs.writeFileSync(`${filePath}.${extension}`, buffer);

	console.log("File saved at:", filePath);
};

module.exports = uploadFile;

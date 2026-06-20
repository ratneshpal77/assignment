import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: "private_ihDKMHXHuhv8c4A2jGh4M+RGW+g=",
});

async function uploadFile(buffer) {
  console.log(buffer);
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.png",
  });
  return result;
}

export default uploadFile;

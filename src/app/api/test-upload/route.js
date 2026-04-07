import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {

  const client = new S3Client({
    region: "us-east-1", // change if needed
    endpoint: "https://del1.vultrobjects.com",
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  try {

    const imageUrl =
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/JPEG_example_flower.jpg";

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const fileName = `test-${Date.now()}.jpg`;

    await client.send(
      new PutObjectCommand({
        Bucket: "qms-images",
        Key: `images-parmar/${fileName}`,
        Body: imageBuffer,
        ACL: "public-read",
        ContentType: "image/jpeg",
      })
    );

    const uploadedUrl =
      `https://qms-images.del1.vultrobjects.com/images-parmar/${fileName}`;

    return Response.json({
      success: true,
      url: uploadedUrl,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
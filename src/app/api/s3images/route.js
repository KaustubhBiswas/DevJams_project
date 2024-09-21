import AWS from 'aws-sdk';

// Initialize the S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export async function GET(req) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    // Fetch metadata for each object
    const imageDetails = await Promise.all(
      data.Contents.map(async (item) => {
        const headParams = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
          Key: item.Key,
        };
        
        try {
          const headData = await s3.headObject(headParams).promise();
          
        //   console.log(`Metadata for ${item.Key}:`, headData.Metadata);
          
          return {
            url: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${item.Key}`,
            key: item.Key,
            lastModified: item.LastModified,
            size: item.Size,
            location: headData.Metadata['location'] || 'Unknown', // Metadata for location
            timestamp: headData.Metadata['timestamp'] || 'Unknown', // Metadata for timestamp
          };
        } catch (error) {
          console.error(`Error fetching metadata for ${item.Key}:`, error);
          return {
            url: `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${item.Key}`,
            key: item.Key,
            lastModified: item.LastModified,
            size: item.Size,
            location: 'Unknown',
            timestamp: 'Unknown',
          };
        }
      })
    );

    return new Response(JSON.stringify({ images: imageDetails }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    return new Response(JSON.stringify({ error: 'Error fetching images' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


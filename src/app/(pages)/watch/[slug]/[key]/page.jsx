import Trailler from "@/app/components/watch/trailler";

const Trailer = async ({ params }) => {
  const { key } = await params;
  // const { slug } = await params;

  return <Trailler keyID={key} />;
};

export default Trailer;
 
export async function generateMetadata({ params }) {
  const { slug, key } = await params;

  // Capitalize the first letter of each word in the slug for a clean title
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const pageTitle = `Watch Trailer: ${title} | HF Universe`;
  const description = `Watch the official trailer for ${title} on HF Universe. Get a sneak peek before you watch.`;
  const url = `https://hf-universe-2.vercel.app/watch/${slug}/${key}`;

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: url,
      type: "video.other",
      videos: [{
        url: `https://www.youtube.com/embed/${key}`,
        secure_url: `https://www.youtube.com/embed/${key}`,
        type: 'text/html',
        width: 1280,
        height: 720,
      }],
      images: [`https://i.ytimg.com/vi/${key}/maxresdefault.jpg`],
    },
  };
}

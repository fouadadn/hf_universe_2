import Trailler from "@/app/components/watch/trailler";

const Trailer = async ({ params }) => {

  const { key } = await params;
  // const { slug } = await params;

  return <Trailler keyID={key} />;
};

export default Trailer;

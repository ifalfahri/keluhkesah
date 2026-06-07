import { HomeClient } from "@/components/home-client";
import { getPosts } from "@/lib/storage";

export default async function Home() {
  const initialPosts = await getPosts(0, 12);

  return <HomeClient initialPosts={initialPosts} />;
}

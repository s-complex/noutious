// eslint-disable-next-line antfu/no-import-dist
import type { Post } from "../../../dist/index";
import { initLocalify } from "@/localify";

export default async function Home() {
  const localify = await initLocalify();
  const posts = localify.getPosts();
  return (
    <ul>
      {Object.keys(posts).map((key) => {
        const post = posts[key];
        return (
          <li key={key}>
            <h2>{post.title}</h2>
            <p>{post.date}</p>
            <p>{post.excerpt}</p>
          </li>
        );
      })}
    </ul>
  );
}

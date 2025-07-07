export const revalidate = 60;
import graphqlClient from '@/lib/graphqlClient';
import { gql } from 'graphql-request';

interface Post {
  title: string;
  uri: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface PostsData {
  posts: {
    nodes: Post[];
  };
}

export default async function Home() {
  const query = gql`
    query NewQuery {
      posts {
        nodes {
          title
          uri
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const data = await graphqlClient.request<PostsData>(query);
    posts = data.posts.nodes;
  } catch (err) {
    console.error("Error fetching posts:", err);
    error = "Failed to load posts. Please check your WordPress GraphQL endpoint and network connection.";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-6 pb-24 px-4 md:px-24">
      <h1 className="text-4xl font-bold mb-8">Latest WordPress Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && posts.length === 0 && <p>No posts found.</p>}
      {!error && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
          {posts.map((post) => {
            const slug = post.uri.replace(/^\/+|\/+$/g, '');
            // Funzione per estrarre la prima immagine dal contenuto HTML
            function getFirstImageFromContent(html: string): string | null {
              // Cerca la prima immagine ovunque nel markup
              const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
              if (match) return match[1];
              // Debug temporaneo
              console.log('Nessuna immagine trovata in:', html);
              return null;
            }
            // Debug temporaneo: mostra il contenuto dell'articolo
            // console.log('Contenuto articolo:', post.content);
            console.log('DEBUG content:', post.content);
            const contentImage = getFirstImageFromContent(post.content);
            const thumbUrl = post.featuredImage?.node?.sourceUrl || contentImage;
            console.log('DEBUG thumbUrl:', thumbUrl);
            const thumbAlt = post.featuredImage?.node?.altText || post.title;
            return (
              <a
                key={post.uri}
                href={`/articoli/${slug}`}
                className="block bg-white rounded-lg shadow-md p-6 h-48 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 border border-gray-200"
                style={{ minHeight: '12rem', maxHeight: '12rem' }}
              >
                {thumbUrl && (
                  <img
                    src={thumbUrl}
                    alt={thumbAlt}
                    className="mb-2 object-cover rounded w-20 h-20 mx-auto"
                    style={{ width: '5rem', height: '5rem' }}
                  />
                )}
                <span className="text-xl font-semibold text-gray-800 line-clamp-3">
                  {post.title}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}

import graphqlClient from '@/lib/graphqlClient';
import { gql } from 'graphql-request';
import { notFound } from 'next/navigation';

interface PostData {
  post: {
    title: string;
    content: string;
  } | null;
}

interface Params {
  params: { slug: string };
}

export default async function ArticoloPage({ params }: Params) {
  const query = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: URI) {
        title
        content
      }
    }
  `;

  let post: PostData['post'] = null;
  try {
    const data = await graphqlClient.request<PostData>(query, { slug: `/${params.slug}/` });
    post = data.post;
  } catch (err) {
    console.error('Errore nel recupero articolo:', err);
  }

  if (!post) return notFound();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}

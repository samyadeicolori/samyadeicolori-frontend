import graphqlClient from '@/lib/graphqlClient';
import { gql } from 'graphql-request';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const query = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: URI) {
        title
        content
      }
    }
  `;

  let post = null;
  try {
    const data: any = await graphqlClient.request(query, { slug: `/${params.slug}/` });
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

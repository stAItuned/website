declare module 'contentlayer/generated' {
  // Minimal declarations to satisfy type-only imports during build.
  // Replace `any` with more precise shapes if you want stricter typing.
  export type Post = any
  export type Author = any
  export const allPosts: Post[]
  export const allAuthors: Author[]
  export default {
    allPosts: [] as Post[],
    allAuthors: [] as Author[],
  }
}

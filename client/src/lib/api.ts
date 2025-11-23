// API calls for database operations

export async function fetchPosts() {
  const res = await fetch("/api/posts");
  return res.json();
}

export async function fetchUserPosts(userId: string) {
  const res = await fetch(`/api/posts/user/${userId}`);
  return res.json();
}

export async function fetchFollowingPosts(userId: string) {
  const res = await fetch(`/api/posts/following/${userId}`);
  return res.json();
}

export async function createPost(post: any) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function fetchStories() {
  const res = await fetch("/api/stories");
  return res.json();
}

export async function fetchFollowingStories(userId: string) {
  const res = await fetch(`/api/stories/following/${userId}`);
  return res.json();
}

export async function createStory(story: any) {
  const res = await fetch("/api/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(story),
  });
  return res.json();
}

export async function searchPosts(query: string) {
  const res = await fetch(`/api/search/posts?q=${encodeURIComponent(query)}`);
  return res.json();
}

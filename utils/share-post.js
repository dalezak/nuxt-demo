export default function (post) {
  shareSocial({
    title: post.title, 
    description: post.body
  });
}
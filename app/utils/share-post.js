export default function (post, event = null) {
  shareSocial({
    title: post.title, 
    description: post.body
  }, event);
}
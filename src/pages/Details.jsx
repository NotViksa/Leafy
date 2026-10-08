import { useParams } from "react-router-dom";

export default function Details() {
  const { postId } = useParams();
  return <div className="page"><h1>Post {postId}</h1></div>;
}
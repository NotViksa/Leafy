import { useParams } from "react-router-dom";

export default function Edit() {
  const { postId } = useParams();
  return <div className="page"><h1>Edit post {postId}</h1></div>;
}
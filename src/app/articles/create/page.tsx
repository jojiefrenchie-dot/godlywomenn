import { Metadata } from "next";
import CreateArticleClient from "./CreateArticleClient";

export const metadata: Metadata = {
  title: "Create Article | Godly Women",
  description: "Create a new article on Godly Women",
};

export default function CreateArticlePage() {
  return <CreateArticleClient />;
}

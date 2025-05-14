import { getAllNews } from "./newsQueries";

const stringy = JSON.stringify;

export async function GET() {
  try {
    const allNews = await getAllNews();
    console.log("=== GET all news", allNews, "===");

    if (allNews) {
      return new Response(stringy(allNews), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("No news found", {
        status: 404,
      });
    }
  } catch (error) {
    console.error("ERROR news.GET /", { error });
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

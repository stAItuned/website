import type Author from "./author";
import type { Article } from "./article";

interface CMSData {
    articles: Article[]
    authors: Author[],
}

export default CMSData
import { Doc } from "./document.model";
import { Highlight } from "./highlight.model";

export class Study {
    document!: Doc;

    source!: {
        title: string,
        doi: string,
        method?: string,
    }

    highlights!: Highlight[];

    relations!: {
        iids: string[]
    }[];

}

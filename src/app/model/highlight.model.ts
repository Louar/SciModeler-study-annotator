export class Highlight {

    id!: string;
    creator!: { id: string, name: string, image: string };
    timestamp!: number;
    position!: {
        pnum: number,
        rects: {
            t: number, l: number, h: number, w: number,
        }[]
    };
    selection!: string;
    notes!: string;
    tags!: {
        entity?: string,
        instance: { ref?: string, label?: string },
        attribute?: string,
        relations?: string[],
    };
    likes?: {
        nlikes: number,
        users: { id: string, name: string, image: string, timestamp: number },
    }
    reactions?: {
        nreactions: number,
        users: { id: string, name: string, image: string, timestamp: number, reaction: string, },
    }

}

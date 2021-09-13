import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Doc } from "../model/document.model";
import { Highlight } from '../model/highlight.model';
import { Study } from "../model/study.model";
import { DataModelService } from './data-model.service';

@Injectable()
export class HighlightService {


    study!: Study;
    private studySubject = new Subject<Study>();
    study$ = this.studySubject.asObservable();

    private highlightSubject = new Subject<any>();
    highlight$ = this.highlightSubject.asObservable();


    constructor(
        private http: HttpClient,
        private dm: DataModelService,
    ) {
    }



    getStudy(): Study {
        return this.study;
    }

    async setStudy(doc: Doc) {
        let study: Study | null = null;

        if (doc.annoturi) {
            await new Promise<void>((resolve) => {
                if (doc.annoturi) {
                    this.http.get((environment.production ? 'https://gitcdn.link/cdn/Louar/SciModeler-study-annotator/main/docs' : '') + doc.annoturi).subscribe(
                        (data: any) => {
                            study = data as Study;
                            resolve();
                        },
                        (error) => {
                            console.warn(`${doc.annoturi} was not found...`)
                            resolve();
                        }
                    );
                }
            });
        }

        if (!study) {
            study = {
                document: doc,
                source: {
                    title: doc.title,
                    doi: doc.doi,
                },
                highlights: [],
                relations: [],
            };
        }

        this.study = study;

        this.studySubject.next(this.study);
    }



    selectHighlight(highlight: Highlight | null) {
        this.highlightSubject.next(highlight);
    }


    saveHighlight(nh: Highlight) {
        let highlight = this.study.highlights.find((h: Highlight) => h.id === nh.id)
        if (highlight) {
            highlight = nh;
        } else {
            this.study.highlights.push(nh);
        }

        this.studySubject.next(this.study);
    }

    removeHighlight(rh: Highlight) {
        this.study.highlights = this.study.highlights.filter((h: Highlight) => h.id !== rh.id)
        this.studySubject.next(this.study);
    }




    updateRelations(method: string, iids: string[]) {
        if (method === 'add') {
            this.study.relations.push({ iids });
        } else if (method === 'remove') {
            this.study.relations = this.study.relations.filter((r: any) => !iids.every(iid => r.iids.includes(iid)))
        }
    }

    getAllowedRelations(highlight: Highlight, erefs: string[]) {
        const iid = highlight.tags.instance.ref;

        if (!iid) { return; }

        const rselected = this.study.relations.filter(r => r.iids.includes(iid)).map(r => r.iids).reduce((a, b) => a.concat(b), [])
            .filter(hiid => iid !== hiid);

        const rallowed = [...new Map(this.study.highlights
            .filter((h: Highlight) => h.tags && h.tags.entity ? erefs.includes(h.tags.entity) : false)
            .map((h: Highlight) => (
                {
                    ref: `${iid} ${h.tags.instance.ref}`,
                    label: `${h.tags.entity}: ${h.tags.instance.label}`,
                    iids: [iid, h.tags.instance.ref],
                    entities: [highlight.tags.entity, h.tags.entity],
                    isSelected: rselected.includes(h.tags.instance.ref || ''),
                }
            )).map(item => [item.ref, item])).values()];

        if (highlight.tags.entity === 'Classification') {
            const dm = this.dm.getDataModel();
            for (const construct of dm.constructs) {
                rallowed.push(
                    {
                        ref: `${iid} ${construct.name}`,
                        label: `${construct.theory}: ${construct.name}`,
                        iids: [iid, construct.name],
                        entities: [highlight.tags.entity, 'Classification'],
                        isSelected: rselected.includes(construct.name),
                    }
                );
            }

        }

        return rallowed;
    }



    getInstancesOfEntity(eref: string) {
        let instances = this.study.highlights
            .filter((h: Highlight) => h.tags?.entity === eref && h.tags.instance.ref && h.tags.instance.label)
            .map((h: Highlight) => h.tags.instance);

        if (instances && instances.length > 0) {
            instances = [...new Map(instances.map(item => [item.ref, item])).values()];

            return instances;
        }

        return [];
    }



}
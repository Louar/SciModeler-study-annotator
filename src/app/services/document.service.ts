import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Doc } from "../model/document.model";

@Injectable()
export class DocumentService {

    docs: Doc[] = [
        {
            id: 'nuijten2021preadolescent',
            doi: '10.2196/21202',
            authors: 'Nuijten, R. C. Y., Van Gorp, P. M. E., Borghouts, T., Le Blanc, P. M., van den Berg, P. E. W., Kemperman, A. D. A. M., Hadian Haghighi, E., & Simons, M.',
            title: 'Preadolescent students\' engagement with an mhealth intervention fostering social comparison for health behavior change: Crossover experimental study',
            year: '2021',
            outlet: 'Journal of Medical Internet Research, 23(7)',
            uri: '/assets/documents/nuijten2021preadolescent.pdf',
            annoturi: '/assets/documents/nuijten2021preadolescent-annot.json',
        },
        {
            id: 'dhondt2019evaluation',
            doi: '10.1007/978-3-030-34974-5_11',
            authors: 'D\'Hondt, J. E., Nuijten, R. C. Y., & Van Gorp, P. M. E.',
            title: 'Evaluation of computer-tailored motivational messaging in a health promotion context',
            year: '2019',
            outlet: 'In G. Bella, & P. Bouquet (editors), Modeling and Using Context - 11th International and Interdisciplinary Conference, CONTEXT 2019, Proceedings',
            uri: '/assets/documents/dhondt2019evaluation.pdf',
            annoturi: '/assets/documents/dhondt2019evaluation-annot.json',
        },
        {
            id: 'nuijten2019evaluation',
            doi: '10.1109/EMBC.2019.8856296',
            authors: 'Nuijten, R. C. Y., Van Gorp, P., Kaymak, U., Simons, M., Kemperman, A. D. A. M., & van den Berg, P. E. W.',
            title: 'Evaluation of the impact of extrinsic rewards on user engagement in a health promotion context',
            year: '2019',
            outlet: 'In 2019 41st Annual International Conference of the IEEE Engineering in Medicine and Biology Society (EMBC)',
            uri: '/assets/documents/nuijten2019evaluation.pdf',
            annoturi: '/assets/documents/nuijten2019evaluation-annot.json',
        },
    ];

    private documentSubject = new Subject<any>();
    document$ = this.documentSubject.asObservable();

    constructor() {
    }



    getDocuments(): any[] {
        return this.docs;
    }


    getDocument(doi: string) {
        const doc = this.docs.find((d: any) => d.doi === doi);
        if (doc) {
            this.documentSubject.next(doc);
        }
    }




}
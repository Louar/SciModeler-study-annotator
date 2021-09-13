import { Component, HostListener, OnInit } from '@angular/core';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/display/api';
import { environment } from 'src/environments/environment';
import { Doc } from './model/document.model';
import { Study } from './model/study.model';
import { DataModelService } from './services/data-model.service';
import { DocumentService } from './services/document.service';
import { HighlightService } from './services/highlight.service';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isReady = false;
  nump!: number;
  pnums!: number[];

  dm!: any;

  doc: Doc | null = null;
  pdf!: PDFDocumentProxy;

  @HostListener('document:keydown.meta.s', ['$event'])
  saveAsJson($event: KeyboardEvent) {
    $event.preventDefault();

    if (this.doc && this.pdf) {

      let study: Study = this.hs.getStudy();

      if (study) {
        const json = JSON.stringify(study);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(json));
        element.setAttribute('download', `${this.doc.id}-annot.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
  }

  @HostListener('document:keydown.meta.e', ['$event'])
  saveAsCypher($event: KeyboardEvent) {
    $event.preventDefault();

    if (this.doc && this.pdf) {
      let study: Study = this.hs.getStudy();

      if (study) {
        this.convertToCypher(study);
      }
    }
  }

  constructor(
    private ds: DocumentService,
    private dms: DataModelService,
    private hs: HighlightService,
  ) {
  }

  async ngOnInit() {
    this.dm = this.dms.getDataModel();

    this.ds.document$.subscribe(
      async (doc: Doc) => {
        this.isReady = false;

        this.doc = doc;
        if (this.doc.uri) {
          await this.getDocument(this.doc.uri);
        }
        await this.hs.setStudy(this.doc);

        this.isReady = true;
      }
    );

  }


  async getDocument(uri: string): Promise<void> {

    await getDocument((environment.production ? 'https://gitcdn.link/repo/Louar/SciModeler-study-annotator/main/docs' : '') + uri).promise.then(
      (pdf: PDFDocumentProxy) => {
        this.pdf = pdf;
      }
    );

    if (this.pdf) {
      this.nump = this.pdf.numPages;
      this.pnums = Array.from({ length: this.nump }, (_, i) => i + 1);
    }

    return new Promise(resolve => resolve());
  }




  convertToCypher(study: Study) {
    let cypher = '';

    const sid = study.document.id;
    if (!sid) {
      alert('`study.document.id` not found');
      return;
    }

    const noref = study.highlights.filter(h => !h.tags.instance.ref);
    if (noref.length > 0) {
      alert('Highlights found without instance, see console!');
      return;
    }

    const iids = [...new Set(study.highlights.map(h => h.tags.instance.ref))];
    for (const iid of iids) {
      if (!iid) { continue; }

      const highlights = study.highlights.filter(h => h.tags.instance.ref === iid);
      const entity = highlights[0].tags.entity;


      const attributes: any = {
        key: `${sid}-${iid.substring(2)}`,
      };
      for (const highlight of highlights) {
        const attr = highlight.tags.attribute;
        if (attr) {
          if (!attributes[attr]) {
            attributes[attr] = '';
          }
          attributes[attr] += `"${highlight.selection}"`;
          if (highlight.notes) { `[${highlight.notes}]`; }
        }
      }

      const attr = this.printObject(attributes);
      const cmd = `CREATE (n:${entity} {${attr}});\n\n`;

      cypher += cmd;
    }

    for (const relation of study.relations) {
      const [ra, rb] = relation.iids;
      const ha = study.highlights.find(h => h.tags.instance.ref === ra);
      const hb = study.highlights.find(h => h.tags.instance.ref === rb);

      if (ha && hb) {
        const ea = ha.tags.entity;
        const eb = hb.tags.entity;

        if (ea && eb) {
          const rtype = this.dms.getRelationType(ea, eb);
          if (rtype) {
            const cmd = `MATCH (a:${ea}),(b:${eb}) WHERE a.key = '${sid}-${ra}' AND b.key = '${sid}-${ra}' CREATE (a)-[r:${rtype.substring(2)}]->(b) RETURN type(r);\n\n`;
            cypher += cmd;
          }
        }
      } else if (ha && ha.tags.entity === 'Classification') {
        const constructs = this.dm.constructs.flatMap((t: any) => t.name);
        if (constructs.includes(rb)) {
          const cmd = `MATCH (a:Classification),(b:Construct) WHERE a.key = '${sid}-${ra}' AND b.name = '${sid}-${ra}' CREATE (a)-[r:AS_CONSTRUCT]->(b) RETURN type(r);\n\n`;
          cypher += cmd;
        }
      }
    }

    // console.log(cypher);

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(cypher));
    element.setAttribute('download', `${sid}-import.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  printObject(o: any) {
    let out = '';

    const il = Object.entries(o).length;
    let i = 0;
    for (const [key, value] of Object.entries(o)) {
      i++;

      out += key + ': "' + (value as string).replace(/([^"\\]*(?:\\.[^"\\]*)*)"/g, '$1\\"') + '"';
      if (i !== il) {
        out += ', ';
      }
    }

    return out;
  }


}
import { Component, HostListener, OnInit } from '@angular/core';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/display/api';
import { Doc } from './model/document.model';
import { Study } from './model/study.model';
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

  doc: Doc | null = null;
  pdf!: PDFDocumentProxy;

  @HostListener('document:keydown.meta.s', ['$event'])
  async saveAsJson($event: KeyboardEvent) {
    $event.preventDefault();

    if (this.doc && this.pdf) {

      let study: Study | null = null;
      await this.hs.getStudy().then(s => study = s);

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
  async saveAsCypher($event: KeyboardEvent) {
    $event.preventDefault();

    if (this.doc && this.pdf) {
      let study: Study | null = null;
      await this.hs.getStudy().then(s => study = s);

      if (study) {
        this.convertToCypher(study);
      }
    }
  }

  constructor(
    private ds: DocumentService,
    private hs: HighlightService,
  ) {
  }

  async ngOnInit() {
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

    await getDocument(uri).promise.then(
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

    const noref = study.highlights.filter(h => !h.tags.instance.ref);
    if (noref.length > 0) {
      alert('Highlights found without instance, see console!');
      console.warn(noref);
      return;
    }

    const iids = [...new Set(study.highlights.map(h => h.tags.instance.ref))];
    for (const iid of iids) {
      const highlights = study.highlights.filter(h => h.tags.instance.ref === iid);
      const entity = highlights[0].tags.entity;


      const attributes: any = {};
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
      const cmd = `CREATE (n:${entity} {${attr}});`;

      cypher += cmd;
    }

    console.log(cypher);
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
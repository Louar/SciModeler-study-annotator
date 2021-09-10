import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { renderTextLayer } from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy, TextContent } from 'pdfjs-dist/types/display/api';
import { HighlightService } from '../../services/highlight.service';
import { Highlight } from '../../model/highlight.model';
import { Study } from 'src/app/model/study.model';


@Component({
  selector: 'pdf-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, AfterViewInit {

  study!: Study;

  @Input() pdf!: PDFDocumentProxy;
  @Input() pnum!: number;

  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  @ViewChild('textsEl') textsEl!: ElementRef<HTMLDivElement>;

  isHighlighting = false;
  cursor: { x: number, y: number } = { x: NaN, y: NaN };



  highlights!: Highlight[];
  shid: string | null = null;

  constructor(
    private hs: HighlightService,
  ) { }


  async ngOnInit() {
    this.study = this.hs.getStudy();
    this.parseHighlights();

    this.hs.study$.subscribe(
      (study: Study) => {
        this.study = study;
        this.parseHighlights();
        document.getSelection()?.removeAllRanges();
      }
    );
  }

  parseHighlights() {
    if (this.study.highlights) {
      this.highlights = this.study.highlights.filter((highlight: Highlight) => highlight.position.pnum === this.pnum);
    }

  }

  ngAfterViewInit() {
    if (this.canvasEl) {
      this.ctx = this.canvasEl.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    if (this.pdf) {
      this.renderPage(this.pnum);
    }
  }



  mousedown($event: MouseEvent) {
    this.cursor = { x: $event.pageX, y: $event.pageY };
  }

  mouseover($event: MouseEvent) {
    if (!this.isHighlighting && this.cursor.x && this.cursor.y && Math.abs($event.pageX - this.cursor.x) > 5 && Math.abs($event.pageY - this.cursor.y) > 1) {
      this.isHighlighting = true;
    }
  }



  async mouseup($event: MouseEvent) {
    if (!this.canvasEl || !this.textsEl) { return; }

    this.cursor = { x: NaN, y: NaN };
    this.isHighlighting = false;

    this.shid = null;

    const selection: Selection = document.getSelection() as Selection;
    if (!selection || selection.toString().length === 0) {
      this.hs.selectHighlight(null);
      return;
    }

    if (selection.rangeCount === 0) { return; }
    const range: Range = selection.getRangeAt(0);

    const textElBounds = this.textsEl.nativeElement.getBoundingClientRect();

    let clientRects = Array.from(range.getClientRects());
    const rects = clientRects.map(
      (rect) => {
        return {
          t: rect.top - textElBounds.top,
          l: rect.left - textElBounds.left,
          h: rect.height, w: rect.width,
        }
      });

    const highlight: Highlight = {
      id: (+new Date).toString(36).slice(-5),
      creator: { id: 'RN', name: 'Raoul Nuijten', image: '' },
      timestamp!: +new Date,
      position: {
        pnum: this.pnum,
        rects,
      },
      selection: range.toString(),
      notes: '',
      tags: {
        instance: {},
      },
    }

    this.hs.saveHighlight(highlight);
    this.hs.selectHighlight(highlight);
  }


  async renderPage(num: number) {
    if (!this.pdf || !this.canvasEl) { return; }

    let page!: PDFPageProxy;
    await this.pdf.getPage(num).then((p: PDFPageProxy) => page = p);

    if (!page) { return; }

    const viewport = page.getViewport({ scale: 1.5, });

    this.canvasEl.nativeElement.height = viewport.height;
    this.canvasEl.nativeElement.width = viewport.width;

    await page.render({ canvasContext: this.ctx, viewport }).promise;


    await page.getTextContent().then(
      (textContent: TextContent) => {


        if (!this.textsEl) { return; }

        this.textsEl.nativeElement.style.left = this.canvasEl.nativeElement.offsetLeft + 'px';
        this.textsEl.nativeElement.style.top = this.canvasEl.nativeElement.offsetTop + 'px';
        this.textsEl.nativeElement.style.height = this.canvasEl.nativeElement.offsetHeight + 'px';
        this.textsEl.nativeElement.style.width = this.canvasEl.nativeElement.offsetWidth + 'px';

        renderTextLayer({
          textContent: textContent,
          container: this.textsEl.nativeElement,
          viewport: viewport,
          textDivs: []
        });
      }
    );
  }


  selectHighlight(highlight: Highlight) {
    this.shid = highlight.id;
    this.hs.selectHighlight(highlight);
  }

}

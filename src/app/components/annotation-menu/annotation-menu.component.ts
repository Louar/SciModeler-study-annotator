import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Highlight } from 'src/app/model/highlight.model';
import { DataModelService } from 'src/app/services/data-model.service';
import { DocumentService } from '../../services/document.service';
import { HighlightService } from '../../services/highlight.service';
import { Study } from '../../model/study.model';

@Component({
  selector: 'pdf-annotation-menu',
  templateUrl: './annotation-menu.component.html',
  styleUrls: ['./annotation-menu.component.scss']
})
export class AnnotationMenuComponent implements OnInit, AfterViewInit {

  docs!: any[];
  sdoi!: string;

  dm: any = {};
  highlight!: Highlight | null;

  highlights: Highlight[] | null = null;



  constructor(
    private ds: DocumentService,
    private dms: DataModelService,
    private hs: HighlightService,
  ) { }

  ngOnInit(): void {
    this.docs = this.ds.getDocuments();
    this.dm.entities = this.dms.getSchemaEntities();
  }

  getDocument(doi: string) {
    if (doi) {
      this.sdoi = doi;
      this.ds.getDocument(doi);
    }
  }

  ngAfterViewInit(): void {
    this.hs.highlight$.subscribe(
      (highlight: Highlight) => {
        this.open(highlight);
      }
    );
  }

  open(highlight: Highlight) {
    if (this.highlight) {
      this.persistHighlight();
    }

    this.highlight = highlight;
    this.persistHighlight(true);

    if (this.highlight?.tags?.entity) {
      this.fetchDatamodel(this.highlight.tags.entity)
    }
  }


  persistHighlight(force = false) {
    if (this.highlight) {
      if (force || this.highlight.tags.entity) {
        this.hs.saveHighlight(this.highlight);
      }
      else {
        this.hs.removeHighlight(this.highlight);
        this.highlight = null;
      }
    }
  }


  updateEntity() {
    if (this.highlight?.tags?.entity) {
      this.fetchDatamodel(this.highlight.tags.entity);
    }
  }

  addInstanceFn(label: string) {
    return { ref: 'i-' + (+new Date).toString(36).slice(-5), label };
  }



  fetchDatamodel(eref: string | undefined, components = ['attributes', 'instances', 'relations']) {
    if (eref && components.includes('attributes')) {
      this.dm.attributes = this.dms.getSchemaAttributes(eref);
    }

    if (eref && components.includes('instances')) {
      this.dm.instances = this.hs.getInstances(eref);
    }

    if (eref && components.includes('relations') && this.highlight?.tags && this.dm.instances.length > 0) {
      const rerefs = this.dms.getSchemaRelations(eref);
      this.dm.relations = this.hs.getAllowedRelations(this.highlight, rerefs);

      if (this.dm.relations) {
        this.highlight.tags.relations = this.dm.relations.filter((r: any) => r.isSelected).map((r: any) => r.ref);
      }
    }
  }


  updateRelations(method: string, data: any) {
    let iids = [];
    if (method === 'add') {
      iids = data.iids;
    } else if (method === 'remove') {
      iids = data.value.iids;
    }

    this.hs.updateRelations(method, iids);
  }




  async showAllHighlights() {
    if (!this.sdoi) { return; }

    const study: Study = this.hs.getStudy();
    if (study && study.highlights) {
      this.highlights = study.highlights
        .sort((a: Highlight, b: Highlight) => a.position.rects[0].t - b.position.rects[0].t)
        .sort((a: Highlight, b: Highlight) => a.position.pnum - b.position.pnum);
    }



  }


}

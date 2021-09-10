import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnnotationMenuComponent } from './components/annotation-menu/annotation-menu.component';
import { PageComponent } from './components/page/page.component';
import { DataModelService } from './services/data-model.service';
import { DocumentService } from './services/document.service';
import { HighlightService } from './services/highlight.service';


@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    AnnotationMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    FormsModule,
    NgSelectModule,
  ],
  providers: [
    DocumentService,
    DataModelService,
    HighlightService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

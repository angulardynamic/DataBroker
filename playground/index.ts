/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DataBrokerModule }  from 'angulardynamic-databroker';

@Component({
  selector: 'app',
  template: `<sample-component></sample-component>`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, DataBrokerModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

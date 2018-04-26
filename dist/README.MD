
# DataBroker

## What?
DataBroker is an Angular (5+) host based messaging bus.

## Why?
Obviously, you could just use the Angular HttpClient in your service class, however, you can't easily dynamically configure these... until now!

What DataBroker does is create an internal (browser/client) messaging bus (topic/name based) to move data around.

These can be daisy chained, transformed (filtered, mapped, etc.), all kinds of neat scenarios.

We use the DataBroker to allow our components to communicate internal to Angular without needing to know about each other at compile time, while still maintaining a typed environment.

## Using Data Sources
  

### Example DataSources object
```
let dataSource = {
	"id": "uniqueDataSourceId",
	"dataSourceType": "HttpGet";
	"defaultType": "array";
	"name": "Not actually used for anything",
	"config": {
		"url": "https://www.myapi.com/getWidget.json"
	}
}
```

### Usage
```
dataBroker: DataBroker;
dataBroker.addDataSource(dataSource);

//in some component somewhere...
dataBroker.subscribeData('uniqueDataSourceId').subscribe(data => {
	// DoSomething();
});
```

## Data Source Types
Included Data Source Types:

### HttpGet
Coming soon...

### HttpPost
Coming soon...

### Websocket
Coming soon...

### Static
Coming soon...

## Filters
Coming soon...

## Cross Filtering
Coming soon...

## Transforms
Coming soon...

## Installation
To install this library, run:
```bash
$ npm install angulardynamic-databroker --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install angulardynamic-databroker
```
and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from  '@angular/platform-browser';
import { NgModule } from  '@angular/core';
import { AppComponent } from  './app.component';
// Import your library
import { DataBrokerModule } from  'angulardynamic-databroker';

@NgModule({
declarations: [
AppComponent
],
imports: [
BrowserModule,
// Specify DataBroker as an import
DataBrokerModule
],
providers: [],
bootstrap: [AppComponent]
})
export  class  AppModule { }
```

## Development
To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:
```bash
$ npm run build
```
To lint all `*.ts` files:
```bash
$ npm run lint
```

## License
MIT © [Michael Rice](mailto:meikeric@gmail.com)

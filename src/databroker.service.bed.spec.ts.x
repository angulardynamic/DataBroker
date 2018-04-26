// import { TestBed, inject } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { HttpClient } from '@angular/common/http';

// import { DataBrokerService } from './databroker.service';

// const mockAirports = {
//   DUB: { name: 'Dublin' },
//   WRO: { name: 'Wroclaw' },
//   MAD: { name: 'Madrid' }
// };

// describe('Service: DataBrokerService', () => {
//   let httpMock: HttpTestingController;
//   let service: DataBrokerService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [ HttpClientTestingModule ],
//       providers: [
//         DataBrokerService
//       ]
//     });
//   });

//   beforeEach(
//     inject([DataBrokerService, HttpTestingController], (_service, _httpMock) => {
//       service = _service;
//       httpMock = _httpMock;
//   }));

//   it('fetchAll$: should return a sorted list', () => {
//     service.fetchAll$().subscribe(airports => {
//       expect(airports.length).toBe(3);
//       expect(airports[2][0]).toBe('WRO');
//     });

//     const req = httpMock.expectOne('https://foo.bar.com/airports');

//     req.flush(mockAirports);
//     httpMock.verify();
//   });

//   it('fetchByIATA$: should the selected airport', () => {
//     service.fetchByIATA$('MAD').subscribe(airport => {
//       expect(airport.name).toBe('Madrid');
//     });

//     const req = httpMock.expectOne('https://foo.bar.com/airports');

//     req.flush(mockAirports);
//     httpMock.verify();
//   });
// });
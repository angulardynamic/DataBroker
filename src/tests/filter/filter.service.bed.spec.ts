import 'rxjs/add/operator/first';

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Template } from 'template.service';
import { FilterService } from 'filter/filter.service';
import { Query, BoolType, Filter, OpType } from 'filter';

interface Name {
    name: string;
}

interface City {
    city: Name;
    population: number;
}

const data: City[] = [
    {city: { name: 'Dublin', population: 1800000 } },
    {city: { name: 'Wroclaw', population: 638000 } },
    {city: { name: 'Madrid', population: 3200000 } }
];

describe('Service: FilterService', () => {
    let injector: Injector;
    let filterService: FilterService = new FilterService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Injector,
                Template
            ]
        });
        injector = TestBed.get(Injector);

    });

    it('#filter: should filter and array', () => {

        const search: object = {
            'field': 'Madrid'
        };

        const query: Query[] = [
            {
                type: BoolType.or,
                filters: [
                    {
                        field: '$.city.name',
                        op: OpType.eq,
                        filterBinding: '{{field}}'
                    }
                ]
            }
        ];

        let result = data.filter(item => filterService.filter(query, item, search));

        expect(typeof result === 'array', true);
        expect(result.length).toBe(1);
        expect(result[0].city.name).toBe('Madrid');
    });

    it('#filter: should match numbers >', () => {
        const search: object = {
            'field': 'Madrid'
        };

        const query: Query[] = [
            {
                type: BoolType.or,
                filters: [
                    {
                        field: '$.city.population',
                        op: OpType.gt,
                        filterBinding: '1500000'
                    }
                ]
            }
        ];

        let result = data.filter(item => filterService.filter(query, item, search));

        expect(typeof result === 'array', true);
        expect(result.length).toBe(2);
        expect(result[0].city.name).toBe('Dublin');
        expect(result[1].city.name).toBe('Madrid');
    });

    it('#filter: should match numbers <', () => {
        const search: object = {
            'field': 'Madrid'
        };

        const query: Query[] = [
            {
                type: BoolType.or,
                filters: [
                    {
                        field: '$.city.population',
                        op: OpType.lt,
                        filterBinding: '1500000'
                    }
                ]
            }
        ];

        let result = data.filter(item => filterService.filter(query, item, search));

        expect(typeof result === 'array', true);
        expect(result.length).toBe(1);
        expect(result[0].city.name).toBe('Wroclaw');
    });

    it('#filter: should match numbers ==', () => {
        const search: object = {
            'field': 'Madrid'
        };

        const query: Query[] = [
            {
                type: BoolType.or,
                filters: [
                    {
                        field: '$.city.population',
                        op: OpType.eq,
                        filterBinding: '1800000'
                    }
                ]
            }
        ];

        let result = data.filter(item => filterService.filter(query, item, search));

        expect(typeof result === 'array', true);
        expect(result.length).toBe(1);
        expect(result[0].city.name).toBe('Dublin');
    });
});

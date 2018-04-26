import 'rxjs/add/operator/first';

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Template } from 'template.service';

describe('Service: FilterService', () => {
    // let injector: Injector;
    let service: Template = new Template();

    it('#template: should replace values', () => {
        let t = '{{name}} is now the king of {{country}}!';
        let map = { name: 'Bryan', country: 'Scotland'};
        let bindings = [];
        let result = service.parseTpl(t, map, bindings);

        expect(typeof result === 'string', true);
        expect(result).toBe('Bryan is now the king of Scotland!');
        expect(bindings.length).toBe(2);
    });
});

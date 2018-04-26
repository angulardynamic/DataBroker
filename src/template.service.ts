import { Injectable } from '@angular/core';

@Injectable()
export class Template {
    // https://jsperf.com/es6-parse-template-string-rev2
    cache: object = {};

    createParser(template: string, bindings: string[]): Function {
        let sanitized = template
            // Replace ${expressions} (etc) with ${map.expressions}.
            // .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, // string interpolation style: ${variable}
            // .replace(/\{([\s]*[^;\s\{]+[\s]*)\}/g, //
            .replace(/\{\{([\s]*[^;\s\{]+[\s]*)\}\}/g, // Mustache style: {{variable}}
            (_, match) => {
                // console.log("_", _);
                // console.log("match", match);
                bindings.push(match);

                return `\$\{map.${match.trim()}\}`;
            })
            // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
            // .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
            // .replace(/(\{(?!map\.)[^}]+\})/g, '');
            .replace(/(\{\{(?!map\.)[^}]+\}\})/g, '');

        return Function('map', `return \`${sanitized}\``);
    }

    parseTpl(template: string, map: object, bindings: string[] = []): string {
        // console.log("parseTpl:map:", map);
        const parser: Function = this.cache[template] = this.cache[template] || this.createParser(template, bindings);
        // console.log("parser:", parser);

        return map ? parser(map) : parser;
    };

    // get(path, obj, fb = `$\{${path}}`):string {
    //   return path.split('.').reduce((res, key) => res[key] || fb, obj);
    // }

    // parseTpl(template, map, fallback): string {
    //   return template.replace(/\$\{.+?}/g, (match) => {
    //     const path = match.substr(2, match.length - 3).trim();
    //     return this.get(path, map, fallback);
    //   });
    // }

     /**
     * Produces a function which uses template strings to do simple interpolation from objects.
     *
     * Usage:
     *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
     *
     *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
     *    // Logs 'Bryan is now the king of Scotland!'
     */

    //  generateTemplateString(x: string): (template: string) => string {
    //      var cache = {};

    //      function generateTemplate(template: string) {
    //          var fn = cache[template];

    //          if (!fn) {
    //              // Replace ${expressions} (etc) with ${map.expressions}.

    //              var sanitized = template
    //                  .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
    //                      return `\$\{map.${match.trim()}\}`;
    //                  })
    //              // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
    //              .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

    //              fn = cache[template] = Function('map', `return \`${sanitized}\``);
    //          }

    //          return fn;
    //      }

    //      return generateTemplate;
    //  }
}

import { Injectable } from '@angular/core';
import * as jsonpath from 'jsonpath';

import { Query, OpType, BoolType } from './query';
import { Template } from '../template.service';

@Injectable()
export class FilterService {
    template: Template;
    // constructor(template: Template)
    // {
    // }

    filter(query: Query[], item: any, data: any): boolean {
        this.template = new Template();

        let itemMatch = false;

        query.forEach(q => {
            if (q.type === BoolType.or) {
                q.filters.forEach(filter => {
                    // if (filter.op == "eq")
                    if (true) {
                        let matches;

                        let t = jsonpath.query(item, filter.field);
                        // let testItem = item[filter.field];
                        let testItem;
                        // TODO: This is hacky, maybe we iterate over the returned results??
                        if (t instanceof Array)
                        {
                            testItem = t[0];
                        }

                        const matchAgainst: any = this.template.parseTpl(filter.filterBinding, data, matches);

                        // console.log(" testItem: ", testItem, " matchAgainst: ", matchAgainst);

                        // console.log(`     filterItem:"`, filterItem,
                        //   '",typeof filterItem:', typeof filterItem, " _.isNil(filterItem):", _.isNil(filterItem),
                        //   " _.isEmpty(filterItem):", _.isEmpty(filterItem),
                        //   " filterItem.length:", filterItem.length
                        // );

                        // if (filterItem == null || filterItem == undefined || typeof filterItem === 'undefined')
                        // if (!filterItem || _.isNil(filterItem) || _.isEmpty(filterItem) || filterItem == "" || filterItem.length <= 0)
                        if (matchAgainst === 'undefined') {
                            itemMatch = true;
                        } else {
                            let testItemType = typeof testItem;
                            let matchAgainstConverted;

                            if (testItemType === 'string') {
                                // TODO: setting for case sensitive
                                if (true) {
                                    testItem = testItem.toLowerCase();
                                    matchAgainstConverted = matchAgainst.toLowerCase();
                                }
                                // TODO: Finish
                                // else
                                // {
                                //     matchAgainstConverted = matchAgainst;
                                // }
                            } else if (testItemType === 'number') {
                                // matchAgainstConverted = Number(matchAgainst);
                                matchAgainstConverted = +matchAgainst;
                            }

                            // console.log(` testItemType: ${testItemType}`, " typeof matchAgainstConverted:", typeof matchAgainstConverted);

                            // console.log("filterItem != undefined");
                            if (filter.op === OpType.eq && testItem === matchAgainstConverted) {
                                // console.log(`       item[${filter.prop}] === data.${filter.filterBinding}`);
                                itemMatch = true;
                            } else if (filter.op === OpType.gt && testItem > matchAgainstConverted) {
                                itemMatch = true;
                            } else if (filter.op === OpType.gte && testItem >= matchAgainstConverted) {
                                itemMatch = true;
                            } else if (filter.op === OpType.lt && testItem < matchAgainstConverted) {
                                itemMatch = true;
                            } else if (filter.op === OpType.lte && testItem <= matchAgainstConverted) {
                                itemMatch = true;
                            } else if (filter.op === OpType.like && typeof testItem === 'string' && testItem.indexOf(matchAgainstConverted) >= 0) {
                                itemMatch = true;
                            } else {
                                // console.log(`       item[${filter.prop}]: ${item[filter.prop]} !== data.${filter.filterBinding}: ${filterItem}`);
                            }

                            // console.log("testItem: ", testItem, "matchAgainstConverted: ", matchAgainstConverted, "filter.op:", filter.op, "itemMatch: ", itemMatch);
                        }
                    } else {
                        // console.log(`      filter.op = ${filter.op}`);
                    }
                });
            } else {
                // console.log(`      q.type = ${q.type}`);
            }
        });

        return itemMatch;
    }
}

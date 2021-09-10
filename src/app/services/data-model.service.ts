import { Injectable } from "@angular/core";
import { Study } from "../model/study.model";

@Injectable()
export class DataModelService {

    dm: any =
        {
            entities: [
                {
                    entity: {
                        ref: 'Experiment',
                        label: 'Experiment'
                    },
                    attributes: [
                        { ref: 'description', label: 'Description' },
                        { ref: 'pointOfInterest', label: 'Point of interest' },
                        { ref: 'conclusion', label: 'Conclusion' },
                    ],
                },
                {
                    entity: {
                        ref: 'Context',
                        label: 'Context'
                    },
                    attributes: [
                        { ref: 'location', label: 'Location' },
                        { ref: 'timing', label: 'Timing' },
                    ],
                },
                {
                    entity: {
                        ref: 'Treatment',
                        label: 'Treatment'
                    },
                    attributes: [
                        { ref: 'name', label: 'Name' },
                        { ref: 'description', label: 'Description' },
                        { ref: 'duration', label: 'Duration' },
                    ],
                },
                {
                    entity: {
                        ref: 'Intervention',
                        label: 'Intervention'
                    },
                    attributes: [
                        { ref: 'name', label: 'Name' },
                        { ref: 'description', label: 'Description' },
                    ],
                },
                {
                    entity: {
                        ref: 'Platform',
                        label: 'Platform'
                    },
                    attributes: [
                        { ref: 'name', label: 'Name' },
                        { ref: 'description', label: 'Description' },
                    ],
                },
                {
                    entity: {
                        ref: 'TreatmentAssignment',
                        label: 'Treatment Assignment'
                    },
                    attributes: [
                        { ref: 'orderNumber', label: 'Order number' },
                    ],
                },
                {
                    entity: {
                        ref: 'Population',
                        label: 'Population'
                    },
                    attributes: [
                        { ref: 'inExclusionCriteria', label: 'In-/exclusion criteria' },
                    ],
                },
                {
                    entity: {
                        ref: 'Demographic',
                        label: 'Demographic'
                    },
                    attributes: [
                        { ref: 'aggregationFunction', label: 'Aggregation function' },
                        { ref: 'value', label: 'Value' },
                    ],
                },
                {
                    entity: {
                        ref: 'Sample',
                        label: 'Sample'
                    },
                    attributes: [
                        { ref: 'size', label: 'Size' },
                    ],
                },
                {
                    entity: {
                        ref: 'Group',
                        label: 'Group'
                    },
                    attributes: [
                        { ref: 'size', label: 'Size' },
                    ],
                },
                {
                    entity: {
                        ref: 'Outcome',
                        label: 'Outcome'
                    },
                    attributes: [
                        { ref: 'result', label: 'Result' },
                        { ref: 'significance', label: 'Significance' },
                    ],
                },
                {
                    entity: {
                        ref: 'Variable',
                        label: 'Variable'
                    },
                    attributes: [
                        { ref: 'type', label: 'Type' },
                        { ref: 'dimension', label: 'Dimension' },
                    ],
                },
                {
                    entity: {
                        ref: 'Classification',
                        label: 'Classification'
                    },
                    attributes: [
                        { ref: 'explanation', label: 'Explanation' },
                        { ref: 'dimension', label: 'Dimension' },
                    ],
                },
                {
                    entity: {
                        ref: 'Source',
                        label: 'Source'
                    },
                    attributes: [
                        { ref: 'title', label: 'Title' },
                        // { ref: 'doi', label: 'DOI' },
                        { ref: 'method', label: 'Method' },
                    ],
                },
            ],




            relations: [
                { entities: ['Source', 'Experiment'] },
                { entities: ['Experiment', 'Treatment'] },
                { entities: ['Experiment', 'Context'] },
                { entities: ['Treatment', 'TreatmentAssignment'] },
                { entities: ['Treatment', 'Intervention'] },
                { entities: ['Treatment', 'Classification'] },
                { entities: ['Intervention', 'Classification'] },
                { entities: ['Intervention', 'Platform'] },
                { entities: ['Context', 'Population'] },
                { entities: ['Population', 'Demographic'] },
                { entities: ['Population', 'Sample'] },
                { entities: ['Sample', 'Demographic'] },
                { entities: ['Group', 'Demographic'] },
                { entities: ['Sample', 'Group'] },
                { entities: ['TreatmentAssignment', 'Group'] },
                { entities: ['Demographic', 'Variable'] },
                { entities: ['Treatment', 'Outcome'] },
                { entities: ['Outcome', 'Variable'] },
                { entities: ['Experiment', 'Variable'] },
            ]
        };



    constructor() {
    }



    getDataModel(): Promise<Study> {
        return new Promise((resolve) => resolve(this.dm));
    }


    getSchemaEntities() {
        return this.dm.entities.map((e: any) => e.entity);
    }

    getSchemaAttributes(eref: string) {
        const entity = this.dm.entities.find((e: any) => e.entity.ref === eref);
        if (entity) {
            return entity.attributes;
        }
    }

    getSchemaRelations(eref: string) {
        return this.dm.relations.filter((r: any) => r.entities.includes(eref)).flatMap((r: any) => r.entities).filter((e: any) => e !== eref);
    }



}
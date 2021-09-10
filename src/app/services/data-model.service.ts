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
                { entities: ['Source', 'Experiment'], type: 'PRESENTS_EXPERIMENT' },
                { entities: ['Experiment', 'Treatment'], type: 'EVALUATES_TREATMENT' },
                { entities: ['Experiment', 'Context'], type: 'EXECUTED_WITHIN_CONTEXT' },
                { entities: ['Experiment', 'Variable'], type: 'HAS_INTEREST_IN_VARIABLE' },
                { entities: ['Treatment', 'TreatmentAssignment'], type: 'AS_ASSIGNED_BY' },
                { entities: ['Treatment', 'Outcome'], type: 'HAS_OUTCOME' },
                { entities: ['Classification', 'Treatment'], type: 'OF_TREATMENT' },
                { entities: ['Classification', 'Intervention'], type: 'OF_INTERVENTION' },
                { entities: ['Intervention', 'Treatment'], type: 'DELIVERS_TREATMENT' },
                { entities: ['Intervention', 'Platform'], type: 'HOSTED_ON_PLATFORM' },
                { entities: ['Context', 'Population'], type: 'TARGETS_POPULATION' },
                { entities: ['Population', 'Sample'], type: 'CONTAINS_SAMPLE' },
                { entities: ['Sample', 'Group'], type: 'CONTAINS_GROUP' },
                { entities: ['Demographic', 'Population'], type: 'FOR_POPULATION' },
                { entities: ['Demographic', 'Sample'], type: 'FOR_SAMPLE' },
                { entities: ['Demographic', 'Group'], type: 'FOR_GROUP' },
                { entities: ['Demographic', 'Variable'], type: 'ON_VARIABLE' },
                { entities: ['TreatmentAssignment', 'Group'], type: 'TO_GROUP' },
                { entities: ['Outcome', 'Variable'], type: 'BASED_ON_VARIABLE' },
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

    getRelationType(ea: string, eb: string) {
        const relation = this.dm.relations.find((r: any) => r.entities.includes(ea) && r.entities.includes(eb));
        if (relation) {
            return relation.type;
        }
    }


}
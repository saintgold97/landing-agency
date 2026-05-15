import { SharedSectionContentMap, SharedSectionType } from "./shared";
import { AccommodationSectionContentMap, AccommodationSectionType } from "./accomodation";
// import { EstheticSectionContentMap, EstheticSectionType } from "./esthetic";

/**
 * Union di tutti i tipi di sezione disponibili
 */
export type SectionType =
    | SharedSectionType
    | AccommodationSectionType
// | EstheticSectionType;

/**
 * Mappa unificata: ogni SectionType mappa al suo contenuto specifico
 * Usa conditional types per mantenere la type-safety
 */
export type SectionContentMap = {
    [K in SectionType]:
    K extends SharedSectionType ? SharedSectionContentMap[K] :
    K extends AccommodationSectionType ? AccommodationSectionContentMap[K] :
    //K extends RestaurantSectionType ? RestaurantSectionContentMap[K] :
    never;
};

/**
 * Tipo generico per una sezione con type narrowing
 */
export type Section<K extends SectionType = SectionType> = {
    id: string;
    type: K;
    title?: string;
    subtitle?: string;
    visible?: boolean;
    order: number;
    content: SectionContentMap[K];
};

/**
 * Helper per verificare se un tipo di sezione è valido per un template
 */
export function isSectionValidForTemplate<T extends string>(
    sectionType: string,
    allowedTypes: readonly T[]
): sectionType is T {
    return allowedTypes.includes(sectionType as T);
}
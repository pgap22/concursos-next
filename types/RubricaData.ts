import { CriteriosSchema } from "@/schemas/criterios";
import { RubricaSchema } from "@/schemas/rubrica";

export interface RubricaData extends RubricaSchema{
    criterios: CriteriosSchema[]
}

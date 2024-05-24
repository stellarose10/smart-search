import { PrismaClient, City, Brand, DishType, Diet } from "@prisma/client";

const prisma = new PrismaClient();

interface EntityCombination {
  city?: City;
  brand?: Brand;
  dishType?: DishType;
  diet?: Diet;
}

export async function extractEntities(
  searchTerm: string
): Promise<EntityCombination[]> {
  const words = searchTerm.trim().split(/\s+/);

  let cities: City[] = [];
  let brands: Brand[] = [];
  let dishTypes: DishType[] = [];
  let diets: Diet[] = [];

  await Promise.all(
    words.map(async (word) => {
      const [cityMatch, brandMatch, dishTypeMatch, dietMatch] =
        await Promise.all([
          prisma.city.findMany({
            where: { name: { contains: word, mode: "insensitive" } },
          }),
          prisma.brand.findMany({
            where: { name: { contains: word, mode: "insensitive" } },
          }),
          prisma.dishType.findMany({
            where: { name: { contains: word, mode: "insensitive" } },
          }),
          prisma.diet.findMany({
            where: { name: { contains: word, mode: "insensitive" } },
          }),
        ]);

      cities = [...new Set([...cities, ...cityMatch])];
      brands = [...new Set([...brands, ...brandMatch])];
      dishTypes = [...new Set([...dishTypes, ...dishTypeMatch])];
      diets = [...new Set([...diets, ...dietMatch])];
    })
  );

  const results: EntityCombination[] = [];

  const addCombinations = (types: (keyof EntityCombination)[]) => {
    const entitiesByType = {
      city: cities,
      brand: brands,
      dishType: dishTypes,
      diet: diets,
    };

    const entityArrays = types.map((type) => entitiesByType[type]);

    if (entityArrays.every((array) => array.length > 0)) {
      const combinations = combineArrays(...entityArrays);
      combinations.forEach((combination) => {
        const entityCombination: EntityCombination = {};
        types.forEach((type, index) => {
          entityCombination[type] = combination[index];
        });
        results.push(entityCombination);
      });
    }
  };

  const combineArrays = <T>(...arrays: T[][]): T[][] => {
    if (arrays.length === 0) return [[]];
    const [first, ...rest] = arrays;
    const restCombinations = combineArrays(...rest);
    return first.flatMap((value) =>
      restCombinations.map((combination) => [value, ...combination])
    );
  };

  addCombinations(["city", "brand"]);
  addCombinations(["city", "diet", "dishType"]);
  addCombinations(["city", "dishType"]);
  addCombinations(["city", "diet"]);
  addCombinations(["brand", "diet", "dishType"]);
  addCombinations(["brand", "dishType"]);
  addCombinations(["brand", "diet"]);
  addCombinations(["dishType", "diet"]);

  if (results.length === 0) {
    cities.forEach((city) => results.push({ city }));
    brands.forEach((brand) => results.push({ brand }));
    dishTypes.forEach((dishType) => results.push({ dishType }));
    diets.forEach((diet) => results.push({ diet }));
  }

  return results;
}
// check in console 
const searchTerm = "McDonalds in London or Manchester";
extractEntities(searchTerm).then((result) => console.log(result));

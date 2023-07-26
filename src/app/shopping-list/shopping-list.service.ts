import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();
  ingredients: Ingredient[] = [];

  constructor() {}

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredientToList(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients);
  }

  updateIngredientAmount(ingredient: Ingredient) {
    let found = false;
    this.ingredients.forEach((existingIngredient) => {
      if (ingredient.name === existingIngredient.name) {
        existingIngredient.amount += ingredient.amount;
        this.ingredientsChanged.emit(this.ingredients);
        found = true;
      }
    });

    return found;
  }
}

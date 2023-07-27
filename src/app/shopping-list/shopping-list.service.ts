import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredients: Ingredient[] = [];
  startedEditing = new Subject<number>();

  constructor() {}

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredientToList(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredientAmount(ingredient: Ingredient) {
    let found = false;
    this.ingredients.forEach((existingIngredient) => {
      if (ingredient.name === existingIngredient.name) {
        existingIngredient.amount += ingredient.amount;
        this.ingredientsChanged.next(this.ingredients.slice());
        found = true;
      }
    });

    return found;
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}

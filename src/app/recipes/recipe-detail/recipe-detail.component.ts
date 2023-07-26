import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = +this.route.snapshot.params['id'];

      this.recipe = this.recipeService
        .getRecipes()
        .find((recipe) => recipe.id === id);
    });
  }

  sendToShoppingList() {
    this.recipe.ingredients.forEach((ingredient) => {
      let found = this.shoppingListService.updateIngredientAmount(ingredient);

      if (!found) {
        this.shoppingListService.addIngredientToList(ingredient);
      }
    });
  }
}

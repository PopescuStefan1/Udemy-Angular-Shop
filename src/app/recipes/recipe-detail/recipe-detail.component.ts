import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +this.route.snapshot.params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
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

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
